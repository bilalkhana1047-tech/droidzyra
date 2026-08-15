export type AppStatus = 'active' | 'deprecated' | 'beta';

export type SourceType = 'official' | 'third-party-authorized' | 'unofficial';

export type CompatibilityStatus = 'compatible' | 'limited' | 'incompatible';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  app_count?: number;
}

export interface App {
  id: string;
  name: string;
  slug: string;
  developer: string;
  package_name: string;
  description: string | null;
  category_id: string | null;
  icon_url: string | null;
  official_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  focus_keyword: string | null;
  status: AppStatus;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  latest_version?: Version | null;
  version_count?: number;
}

export interface Version {
  id: string;
  app_id: string;
  version_name: string;
  version_code: string;
  release_date: string;
  min_android: string;
  target_android: string;
  architecture: string;
  file_size: number;
  sha256: string | null;
  source_url: string | null;
  custom_download_url: string | null;
  source_type: SourceType;
  verified: boolean;
  created_at: string;
  changelog?: Changelog | null;
  app?: Pick<App, 'id' | 'name' | 'slug' | 'icon_url'> | null;
}

export interface Changelog {
  id: string;
  version_id: string;
  content: string;
  source_url: string | null;
  published_at: string;
}

export interface CompatibilityRecord {
  id: string;
  app_id: string;
  android_version: string;
  version_id: string;
  status: CompatibilityStatus;
  notes: string | null;
  version?: Pick<Version, 'id' | 'version_name' | 'version_code'> | null;
}

export interface Screenshot {
  id: string;
  app_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  image_width: number | null;
  image_height: number | null;
}

export interface AppDetail extends App {
  versions: Version[];
  screenshots: Screenshot[];
  compatibility: CompatibilityRecord[];
}




