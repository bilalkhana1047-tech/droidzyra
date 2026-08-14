import { unstable_cache } from 'next/cache';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type {
  App,
  AppDetail,
  Category,
  CompatibilityRecord,
  Screenshot,
  Version,
} from '@/lib/types';

function compareAndroid(a: string, b: string): number {
  return parseFloat(a) - parseFloat(b);
}

const getCategoriesCached = unstable_cache(
  async (): Promise<Category[]> => {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) return [];

    return data as Category[];
  },
  ['droidzyra-categories'],
  { revalidate: 60 }
);

export async function getCategories(): Promise<Category[]> {
  return getCategoriesCached();
}

async function attachLatestVersions(apps: App[]): Promise<App[]> {
  if (!supabase || apps.length === 0) return apps;

  const appIds = apps.map((a) => a.id);

  const { data, error } = await supabase
    .from('latest_versions')
    .select(
      'id, app_id, version_name, version_code, release_date, min_android, target_android, architecture, file_size, sha256, source_url, source_type, verified, created_at'
    )
    .in('app_id', appIds);

  if (error || !data) {
    console.error('Latest versions loading error:', error);
    return apps;
  }

  const latestByApp = new Map<string, Version>(
    (data as Version[]).map((version) => [
      version.app_id,
      version,
    ])
  );

  return apps.map((app) => ({
    ...app,
    latest_version: latestByApp.get(app.id) ?? null,
  }));
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;

  return data as Category;
}

export async function getApps(opts?: {
  category?: string;
  search?: string;
  androidVersion?: string;
  sort?: 'latest' | 'oldest' | 'newest-added' | 'oldest-added';
  limit?: number;
  offset?: number;
}): Promise<{ apps: App[]; total: number }> {
  if (!supabase) {
    return { apps: [], total: 0 };
  }

  const limit = Math.min(Math.max(opts?.limit ?? 12, 1), 50);
  const offset = Math.max(opts?.offset ?? 0, 0);
  const sort = opts?.sort ?? 'latest';

  let query = supabase
    .from('apps')
    .select('*, category:categories(*)', { count: 'exact' })
    .eq('status', 'active');

  if (opts?.search?.trim()) {
    const search = opts.search.trim();

    query = query.or(
      `name.ilike.%${search}%,developer.ilike.%${search}%,package_name.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  if (opts?.category) {
    query = query.eq('category_id', opts.category);
  }

  if (opts?.androidVersion) {
    const { data: compatibilityData, error: compatibilityError } =
      await supabase
        .from('compatibility')
        .select('app_id')
        .eq('android_version', opts.androidVersion);

    if (compatibilityError) {
      console.error(
        'Android compatibility filter error:',
        compatibilityError
      );

      return { apps: [], total: 0 };
    }

    const compatibleAppIds = Array.from(
      new Set(
        (compatibilityData ?? []).map(
          (record: { app_id: string }) => record.app_id
        )
      )
    );

    if (compatibleAppIds.length === 0) {
      return { apps: [], total: 0 };
    }

    query = query.in('id', compatibleAppIds);
  }

  switch (sort) {
    case 'oldest':
      query = query.order('updated_at', { ascending: true });
      break;

    case 'newest-added':
      query = query.order('created_at', { ascending: false });
      break;

    case 'oldest-added':
      query = query.order('created_at', { ascending: true });
      break;

    case 'latest':
    default:
      query = query.order('updated_at', { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('getApps error:', error);

    return {
      apps: [],
      total: 0,
    };
  }

  const apps = (data as App[]) ?? [];
  const withVersions = await attachLatestVersions(apps);

  return {
    apps: withVersions,
    total: count ?? apps.length,
  };
}

export async function getAppBySlug(
  slug: string
): Promise<AppDetail | null> {
  if (!supabase) return null;

  const { data: app, error } = await supabase
    .from('apps')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !app) return null;

  const [versionsRes, screenshotsRes, compatRes] = await Promise.all([
    supabase
      .from('versions')
      .select('*, changelog:changelogs(*)')
      .eq('app_id', app.id)
      .order('release_date', { ascending: false }),

    supabase
      .from('screenshots')
      .select('*')
      .eq('app_id', app.id)
      .order('sort_order', { ascending: true }),

    supabase
      .from('compatibility')
      .select('*, version:versions(id, version_name, version_code)')
      .eq('app_id', app.id),
  ]);

  const versions = (versionsRes.data as Version[]) ?? [];
  const screenshots = (screenshotsRes.data as Screenshot[]) ?? [];
  const compatibility =
    (compatRes.data as CompatibilityRecord[]) ?? [];

  return {
    ...(app as App),
    versions,
    screenshots,
    compatibility,
  };
}

export async function getLatestVersion(
  appId: string
): Promise<Version | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('versions')
    .select('*, changelog:changelogs(*)')
    .eq('app_id', appId)
    .order('release_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  return data as Version;
}

const getPopularAppsCached = unstable_cache(
  async (limit: number): Promise<App[]> => {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('apps')
      .select('*, category:categories(*)')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) return [];

    return attachLatestVersions((data as App[]) ?? []);
  },
  ['droidzyra-popular-apps'],
  { revalidate: 60 }
);

export async function getPopularApps(
  limit = 6
): Promise<App[]> {
  return getPopularAppsCached(limit);
}

const getRecentlyUpdatedAppsCached = unstable_cache(
  async (limit: number): Promise<App[]> => {
    if (!supabase) return [];

    const { data: versionData, error: vErr } = await supabase
      .from('versions')
      .select('app_id, release_date')
      .order('release_date', { ascending: false })
      .limit(limit * 3);

    if (vErr || !versionData) {
      const { data, error } = await supabase
        .from('apps')
        .select('*, category:categories(*)')
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) return [];

      return attachLatestVersions((data as App[]) ?? []);
    }

    const seenAppIds = new Set<string>();
    const orderedAppIds: string[] = [];

    for (const version of versionData as { app_id: string }[]) {
      if (!seenAppIds.has(version.app_id)) {
        seenAppIds.add(version.app_id);
        orderedAppIds.push(version.app_id);

        if (orderedAppIds.length >= limit) {
          break;
        }
      }
    }

    if (orderedAppIds.length === 0) return [];

    const { data: apps, error: aErr } = await supabase
      .from('apps')
      .select('*, category:categories(*)')
      .in('id', orderedAppIds)
      .eq('status', 'active');

    if (aErr || !apps) return [];

    const appMap = new Map(
      (apps as App[]).map((app) => [app.id, app])
    );

    const ordered = orderedAppIds
      .map((id) => appMap.get(id))
      .filter(Boolean) as App[];

    return attachLatestVersions(ordered);
  },
  ['droidzyra-recently-updated-apps'],
  { revalidate: 60 }
);

export async function getRecentlyUpdatedApps(
  limit = 8
): Promise<App[]> {
  return getRecentlyUpdatedAppsCached(limit);
}

export async function getVersionsForApp(
  slug: string
): Promise<{
  app: App | null;
  versions: Version[];
}> {
  if (!supabase) {
    return {
      app: null,
      versions: [],
    };
  }

  const { data: app, error } = await supabase
    .from('apps')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !app) {
    return {
      app: null,
      versions: [],
    };
  }

  const { data: versions, error: vErr } = await supabase
    .from('versions')
    .select('*, changelog:changelogs(*)')
    .eq('app_id', app.id)
    .order('release_date', { ascending: false });

  if (vErr) {
    return {
      app: app as App,
      versions: [],
    };
  }

  return {
    app: app as App,
    versions: (versions as Version[]) ?? [],
  };
}

export async function getVersionDetail(
  slug: string,
  versionName: string
): Promise<{
  app: App | null;
  version: Version | null;
}> {
  if (!supabase) {
    return {
      app: null,
      version: null,
    };
  }

  const { data: app, error } = await supabase
    .from('apps')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !app) {
    return {
      app: null,
      version: null,
    };
  }

  const { data: version, error: vErr } = await supabase
    .from('versions')
    .select('*, changelog:changelogs(*)')
    .eq('app_id', app.id)
    .eq('version_name', versionName)
    .maybeSingle();

  if (vErr || !version) {
    return {
      app: app as App,
      version: null,
    };
  }

  return {
    app: app as App,
    version: version as Version,
  };
}

export async function getCompatibilityForApp(
  appId: string,
  androidVersion: string
): Promise<CompatibilityRecord | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('compatibility')
    .select(
      '*, version:versions(id, version_name, version_code, min_android, target_android, release_date)'
    )
    .eq('app_id', appId)
    .eq('android_version', androidVersion)
    .maybeSingle();

  if (error || !data) return null;

  return data as CompatibilityRecord;
}

export async function getAllCompatibilityForApp(
  appId: string
): Promise<CompatibilityRecord[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('compatibility')
    .select(
      '*, version:versions(id, version_name, version_code, min_android, target_android, release_date)'
    )
    .eq('app_id', appId);

  if (error) return [];

  return (data as CompatibilityRecord[]) ?? [];
}

export async function getCompatibleVersions(
  appId: string,
  androidVersion: string
): Promise<{
  records: CompatibilityRecord[];
  recommended: CompatibilityRecord | null;
}> {
  if (!supabase) {
    return {
      records: [],
      recommended: null,
    };
  }

  const { data, error } = await supabase
    .from('compatibility')
    .select(
      '*, version:versions(id, version_name, version_code, min_android, target_android, release_date, file_size, architecture)'
    )
    .eq('app_id', appId)
    .order('android_version', { ascending: false });

  if (error || !data) {
    return {
      records: [],
      recommended: null,
    };
  }

  const all = (data as CompatibilityRecord[]) ?? [];

  const matching = all.filter(
    (record) =>
      compareAndroid(record.android_version, androidVersion) === 0
  );

  if (matching.length > 0) {
    const recommended =
      matching.find((record) => record.status === 'compatible') ??
      matching[0];

    return {
      records: matching,
      recommended,
    };
  }

  const lower = all
    .filter(
      (record) =>
        compareAndroid(record.android_version, androidVersion) <= 0
    )
    .sort(
      (a, b) =>
        compareAndroid(b.android_version, a.android_version)
    );

  if (lower.length > 0) {
    return {
      records: [lower[0]],
      recommended: lower[0],
    };
  }

  const higher = all
    .filter(
      (record) =>
        compareAndroid(record.android_version, androidVersion) > 0
    )
    .sort(
      (a, b) =>
        compareAndroid(a.android_version, b.android_version)
    );

  if (higher.length > 0) {
    return {
      records: [higher[0]],
      recommended: higher[0],
    };
  }

  return {
    records: [],
    recommended: null,
  };
}

export async function searchApps(
  query: string,
  limit = 5
): Promise<App[]> {
  if (!supabase || !query.trim()) return [];

  const search = query.trim();

  const { data, error } = await supabase
    .from('apps')
    .select('*, category:categories(*)')
    .eq('status', 'active')
    .or(
      `name.ilike.%${search}%,developer.ilike.%${search}%,package_name.ilike.%${search}%,description.ilike.%${search}%`
    )
    .limit(limit);

  if (error) return [];

  return attachLatestVersions((data as App[]) ?? []);
}

export async function getSitemapApps(): Promise<
  Pick<App, "id" | "slug" | "updated_at">[]
> {
  if (!supabase) return [];

  const PAGE_SIZE = 500;
  const allApps: Pick<App, "id" | "slug" | "updated_at">[] = [];

  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("apps")
      .select("id, slug, updated_at")
      .eq("status", "active")
      .order("id", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error("Sitemap apps loading error:", error);
      break;
    }

    const batch =
      (data ?? []) as Pick<App, "id" | "slug" | "updated_at">[];

    allApps.push(...batch);

    if (batch.length < PAGE_SIZE) {
      break;
    }

    offset += PAGE_SIZE;
  }

  return allApps;
}

export async function getSitemapVersions(): Promise<
  Pick<Version, "app_id" | "version_name" | "release_date">[]
> {
  if (!supabase) return [];

  const PAGE_SIZE = 500;

  const allVersions: Pick<
    Version,
    "app_id" | "version_name" | "release_date"
  >[] = [];

  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("versions")
      .select("app_id, version_name, release_date")
      .order("id", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error("Sitemap versions loading error:", error);
      break;
    }

    const batch =
      (data ?? []) as Pick<
        Version,
        "app_id" | "version_name" | "release_date"
      >[];

    allVersions.push(...batch);

    if (batch.length < PAGE_SIZE) {
      break;
    }

    offset += PAGE_SIZE;
  }

  return allVersions;
}
export { isSupabaseConfigured };

const getTrendingAppsCached = unstable_cache(
  async (limit: number): Promise<App[]> => {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('apps')
      .select('*, category:categories(*)')
      .eq('status', 'active')
      .eq('is_trending', true)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.error('Trending apps error:', error);
      return [];
    }

    return attachLatestVersions((data as App[]) ?? []);
  },
  ['droidzyra-trending-apps'],
  { revalidate: 60 }
);

export async function getTrendingApps(
  limit = 6
): Promise<App[]> {
  return getTrendingAppsCached(limit);
}







