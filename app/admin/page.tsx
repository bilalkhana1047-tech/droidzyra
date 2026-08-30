"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import "./admin-theme.css";

type DashboardStats = {
  activeApps: number;
  compatibilityChecks: number;
  totalApps: number;
  totalVersions: number;
};

type Activity = {
  id: string;
  action: string;
  user: string;
  time: string;
  status: string;
};

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type AppItem = {
  id: string;
  name: string;
  slug: string;
  developer: string;
  package_name: string;
  category_id: string | null;
  icon_url: string | null;
  description: string | null;
  short_description: string | null;
  features: string | null;
  editorial_notes: string | null;
  official_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  focus_keyword: string | null;
  status: string;
  is_trending: boolean;
  updated_at: string;
};

type InternalLinkItem = {
  id?: string;
  source_app_id?: string;
  target_app_id: string;
  anchor_text: string;
  placement: "description" | "editorial_notes";
};

type InternalLinkTarget = {
  id: string;
  name: string;
  slug: string;
};
type AppForm = {
  name: string;
  slug: string;
  developer: string;
  package_name: string;
  category_id: string;
  description: string;
  short_description: string;
  features: string;
  editorial_notes: string;
  icon_url: string;
  official_url: string;
  seo_title: string;
  seo_description: string;
  focus_keyword: string;
  status: string;
  is_trending: boolean;
};
type VersionItem = {
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
  verified: boolean;
};

type VersionForm = {
  version_name: string;
  version_code: string;
  release_date: string;
  min_android: string;
  target_android: string;
  architecture: string;
  file_size: string;
  sha256: string;
  source_url: string;
  custom_download_url: string;
  verified: boolean;
};

const emptyVersion: VersionForm = {
  version_name: "",
  version_code: "",
  release_date: "",
  min_android: "",
  target_android: "",
  architecture: "",
  file_size: "",
  sha256: "",
  source_url: "",
  custom_download_url: "",
  verified: false,
};

function isValidHttpsUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return true;

  try {
    const url = new URL(trimmed);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function timeAgo(dateString?: string | null) {
  if (!dateString) return "Recently";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const now = new Date();
  const diff = Math.max(0, now.getTime() - date.getTime());

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day ago`;

  return date.toLocaleDateString();
}

const emptyApp: AppForm = {
  name: "",
  slug: "",
  developer: "",
  package_name: "",
  category_id: "",
  description: "",
  short_description: "",
  features: "",
  editorial_notes: "",
  icon_url: "",
  official_url: "",
  seo_title: "",   seo_description: "",   focus_keyword: "",
  status: "active",
  is_trending: false,
};

export default function AdminPage() {

  async function loadInternalLinkTargets() {
    if (!supabase) {
      console.error("Supabase client is not available.");
      return;
    }

    const { data, error } = await supabase
      .from("apps")
      .select("id, name, slug")
      .eq("status", "active")
      .order("name", { ascending: true });

    if (error) {
      console.error("Internal link target loading error:", error);
      return;
    }

    setInternalLinkTargets((data ?? []) as InternalLinkTarget[]);
  }
  const [internalLinks, setInternalLinks] = useState<InternalLinkItem[]>([]);

  const [newInternalLink, setNewInternalLink] = useState<InternalLinkItem>({
    target_app_id: "",
    anchor_text: "",
    placement: "description",
  });
  const [internalLinkTargets, setInternalLinkTargets] = useState<InternalLinkTarget[]>([]);
  function addInternalLink() {
    const anchor = newInternalLink.anchor_text.trim();

    if (!anchor || !newInternalLink.target_app_id) {
      setErrorMessage("Enter anchor text and select a target app.");
      return;
    }

    const sourceText =
      newInternalLink.placement === "description"
        ? newApp.description
        : newApp.editorial_notes;

    if (!sourceText.toLowerCase().includes(anchor.toLowerCase())) {
      setErrorMessage(
        newInternalLink.placement === "description"
          ? "Anchor text must exist in Long Description."
          : "Anchor text must exist in Editorial Notes."
      );
      return;
    }

    if (
      editingAppId &&
      newInternalLink.target_app_id === editingAppId
    ) {
      setErrorMessage("An app cannot link to itself.");
      return;
    }

    const duplicate = internalLinks.some(
      (link) =>
        link.target_app_id === newInternalLink.target_app_id &&
        link.anchor_text.toLowerCase() === anchor.toLowerCase() &&
        link.placement === newInternalLink.placement
    );

    if (duplicate) {
      setErrorMessage("This internal link has already been added.");
      return;
    }

    setInternalLinks((current) => [
      ...current,
      {
        target_app_id: newInternalLink.target_app_id,
        anchor_text: anchor,
        placement: newInternalLink.placement,
      },
    ]);

    setNewInternalLink({
      target_app_id: "",
      anchor_text: "",
      placement: "description",
    });

    setErrorMessage("");
  }

  function removeInternalLink(index: number) {
    setInternalLinks((current) =>
      current.filter((_, currentIndex) => currentIndex !== index)
    );
  }

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  useEffect(() => {
    loadInternalLinkTargets();
  }, []);

  useEffect(() => {
    const section = new URLSearchParams(window.location.search)
      .get("section")
      ?.toLowerCase();

    const sectionMap: Record<string, string> = {
      dashboard: "Dashboard",
      apps: "Apps",
      compatibility: "Compatibility",
      analytics: "Analytics",
      settings: "Settings",
    };

    if (section && sectionMap[section]) {
      setActiveMenu(sectionMap[section]);
    }
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [stats, setStats] = useState<DashboardStats>({
    activeApps: 0,
    compatibilityChecks: 0,
    totalApps: 0,
    totalVersions: 0,
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showAddApp, setShowAddApp] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  const [newApp, setNewApp] = useState<AppForm>(emptyApp);
  const [iconUploading, setIconUploading] = useState(false);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [selectedAppForVersions, setSelectedAppForVersions] =
  useState<AppItem | null>(null);

const [versions, setVersions] = useState<VersionItem[]>([]);
const [showVersionForm, setShowVersionForm] = useState(false);
const [editingVersionId, setEditingVersionId] =
  useState<string | null>(null);

const [newVersion, setNewVersion] =
  useState<VersionForm>(emptyVersion);

const [versionLoading, setVersionLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const ADMIN_PAGE_SIZE = 50;

  const [adminPage, setAdminPage] = useState(1);
  const [adminTotalApps, setAdminTotalApps] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (activeMenu !== "Apps") return;

      loadAdminApps(
        1,
        searchTerm,
        statusFilter
      );
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchTerm, statusFilter, activeMenu]);
  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Apps", icon: "◈" },
    { name: "Compatibility", icon: "♡" },
    { name: "Analytics", icon: "⌁" },
    { name: "Settings", icon: "⚙" },
  ];

  async function loadAdminApps(
    page = adminPage,
    search = searchTerm,
    status = statusFilter
  ) {
    if (!supabase) return;

    const safePage = Math.max(page, 1);
    const from = (safePage - 1) * ADMIN_PAGE_SIZE;
    const to = from + ADMIN_PAGE_SIZE - 1;

    let query = supabase
      .from("apps")
      .select(
        "id, name, slug, developer, package_name, category_id, description, short_description, features, editorial_notes, icon_url, official_url, seo_title, seo_description, focus_keyword, status, is_trending, updated_at",
        { count: "exact" }
      );

    const cleanSearch = search.trim();

    if (cleanSearch) {
      query = query.or(
        `name.ilike.%${cleanSearch}%,slug.ilike.%${cleanSearch}%,developer.ilike.%${cleanSearch}%,package_name.ilike.%${cleanSearch}%`
      );
    }

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Admin apps loading error:", error);
      setErrorMessage(error.message);
      return;
    }

    setApps((data ?? []) as AppItem[]);
    setAdminTotalApps(count ?? 0);
    setAdminPage(safePage);
  }
  function getJoinedAppName(
    app: { name?: string } | { name?: string }[] | null | undefined
  ) {
    if (Array.isArray(app)) {
      return app[0]?.name ?? "Application";
    }

    return app?.name ?? "Application";
  }
  async function loadDashboard() {
    if (!supabase) {
      setErrorMessage(
        "Supabase is not configured. Check your environment variables."
      );
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMessage("");

    try {
      const [
        activeAppsResult,
        totalAppsResult,
        compatibilityResult,
        versionsResult,
        versionsActivityResult,
        compatibilityActivityResult,
      ] = await Promise.all([
        supabase
          .from("apps")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),

        supabase
          .from("apps")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("compatibility")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("versions")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("versions")
          .select(
            "id, app_id, version_name, version_code, release_date, created_at, app:apps(name)"
          )
          .order("created_at", { ascending: false })
          .limit(20),

        supabase
          .from("compatibility")
          .select(
            "id, app_id, android_version, status, app:apps(name)"
          )
          .order("id", { ascending: false })
          .limit(20),
      ]);

      if (activeAppsResult.error) {
        console.error("Active apps error:", activeAppsResult.error);
      }

      if (totalAppsResult.error) {
        console.error("Total apps error:", totalAppsResult.error);
      }

      if (compatibilityResult.error) {
        console.error(
          "Compatibility count error:",
          compatibilityResult.error
        );
      }

      if (versionsResult.error) {
        console.error("Versions count error:", versionsResult.error);
      }
      setStats({
        activeApps: activeAppsResult.count ?? 0,
        compatibilityChecks: compatibilityResult.count ?? 0,
        totalApps: totalAppsResult.count ?? 0,
        totalVersions: versionsResult.count ?? 0,
      });

      const newActivities: Activity[] = [];

      for (const version of versionsActivityResult.data ?? []) {
        newActivities.push({
          id: `version-${version.id}`,
          action: `Version ${version.version_name ?? "New"} added`,
          user: getJoinedAppName(version.app),
          time: timeAgo(version.created_at ?? version.release_date),
          status: "Updated",
        });
      }

      for (const record of compatibilityActivityResult.data ?? []) {
        newActivities.push({
          id: `compat-${record.id}`,
          action: `Android ${record.android_version} compatibility`,
          user: getJoinedAppName(record.app),
          time: "Recent",
          status:
            record.status === "compatible"
              ? "Compatible"
              : record.status === "limited"
                ? "Limited"
                : "Incompatible",
        });
      }

      newActivities.sort((a, b) => {
        return a.time === "Just now" ? -1 : 1;
      });

      setActivities(newActivities.slice(0, 8));

      await loadAdminApps(
        adminPage,
        searchTerm,
        statusFilter
      );
    } catch (error) {
      console.error("Admin dashboard error:", error);
      setErrorMessage("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

    async function loadVersions(app: AppItem) {
      if (!supabase) {
        setErrorMessage("Supabase is not configured.");
        return;
      }
    
      setSelectedAppForVersions(app);
      setVersionLoading(true);
      setErrorMessage("");
    
      try {
        const { data, error } = await supabase
          .from("versions")
          .select(
            "id, app_id, version_name, version_code, release_date, min_android, target_android, architecture, file_size, sha256, source_url, custom_download_url, verified"
          )
          .eq("app_id", app.id)
          .order("release_date", { ascending: false });
    
        if (error) {
          console.error("Load versions error:", error);
          setErrorMessage(error.message);
          setVersions([]);
          return;
        }
    
        setVersions((data as VersionItem[]) ?? []);
        setShowVersionForm(false);
        setEditingVersionId(null);
        setNewVersion(emptyVersion);
      } catch (error) {
        console.error("Load versions error:", error);
        setErrorMessage("Unable to load versions.");
        setVersions([]);
      } finally {
        setVersionLoading(false);
      }
    }
    
    function startAddVersion() {
      setEditingVersionId(null);
      setNewVersion({
        ...emptyVersion,
        release_date: new Date().toISOString().split("T")[0],
      });
      setShowVersionForm(true);
      setErrorMessage("");
    }
    
    function startEditVersion(version: VersionItem) {
      setEditingVersionId(version.id);
    
      setNewVersion({
        version_name: version.version_name,
        version_code: version.version_code,
        release_date: version.release_date,
        min_android: version.min_android,
        target_android: version.target_android,
        architecture: version.architecture,
        file_size: String(version.file_size ?? ""),
        sha256: version.sha256 ?? "",
        source_url: version.source_url ?? "",
        custom_download_url: version.custom_download_url ?? "",
        verified: Boolean(version.verified),
      });
    
      setShowVersionForm(true);
      setErrorMessage("");
    }
    
    function cancelVersionForm() {
      setShowVersionForm(false);
      setEditingVersionId(null);
      setNewVersion(emptyVersion);
    }
    
    async function createVersion() {
      if (!supabase || !selectedAppForVersions) {
        setErrorMessage("No application selected.");
        return;
      }
    
      if (
        !newVersion.version_name.trim() ||
        !newVersion.version_code.trim() ||
        !newVersion.release_date ||
        !newVersion.min_android.trim() ||
        !newVersion.target_android.trim() ||
        !newVersion.architecture.trim() ||
        !newVersion.file_size.trim()
      ) {
        setErrorMessage(
          "Version name, code, release date, Android versions, architecture and file size are required."
        );
        return;
      }
    
      const fileSize = Number(newVersion.file_size);
    
      if (!Number.isFinite(fileSize) || fileSize < 0) {
        setErrorMessage("File size must be a valid positive number.");
        return;
      }
    
      if (!isValidHttpsUrl(newVersion.source_url)) {
        setErrorMessage("Source URL must be a valid HTTPS URL.");
        return;
      }

      if (!isValidHttpsUrl(newVersion.custom_download_url)) {
        setErrorMessage("Custom Download URL must be a valid HTTPS URL.");
        return;
      }

      setVersionLoading(true);
      setErrorMessage("");
    
      try {
        const { error } = await supabase.from("versions").insert({
          app_id: selectedAppForVersions.id,
          version_name: newVersion.version_name.trim(),
          version_code: newVersion.version_code.trim(),
          release_date: newVersion.release_date,
          min_android: newVersion.min_android.trim(),
          target_android: newVersion.target_android.trim(),
          architecture: newVersion.architecture.trim(),
          file_size: Math.floor(fileSize),
          sha256: newVersion.sha256.trim() || null,
          source_url: newVersion.source_url.trim() || null,
            custom_download_url: newVersion.custom_download_url.trim() || null,
            verified: newVersion.verified,
        });
    
        if (error) {
          console.error("Create version error:", error);
          setErrorMessage(error.message);
          return;
        }
    
        cancelVersionForm();
        await loadVersions(selectedAppForVersions);
        await loadDashboard();
      } catch (error) {
        console.error("Create version error:", error);
        setErrorMessage("Unable to create version.");
      } finally {
        setVersionLoading(false);
      }
    }
    
    async function updateVersion() {
      if (!supabase || !selectedAppForVersions || !editingVersionId) {
        setErrorMessage("No version selected for editing.");
        return;
      }
    
      if (
        !newVersion.version_name.trim() ||
        !newVersion.version_code.trim() ||
        !newVersion.release_date ||
        !newVersion.min_android.trim() ||
        !newVersion.target_android.trim() ||
        !newVersion.architecture.trim() ||
        !newVersion.file_size.trim()
      ) {
        setErrorMessage(
          "Version name, code, release date, Android versions, architecture and file size are required."
        );
        return;
      }
    
      const fileSize = Number(newVersion.file_size);
    
      if (!Number.isFinite(fileSize) || fileSize < 0) {
        setErrorMessage("File size must be a valid positive number.");
        return;
      }
    
      if (!isValidHttpsUrl(newVersion.source_url)) {
        setErrorMessage("Source URL must be a valid HTTPS URL.");
        return;
      }

      if (!isValidHttpsUrl(newVersion.custom_download_url)) {
        setErrorMessage("Custom Download URL must be a valid HTTPS URL.");
        return;
      }

      setVersionLoading(true);
      setErrorMessage("");
    
      try {
        const { error } = await supabase
          .from("versions")
          .update({
            version_name: newVersion.version_name.trim(),
            version_code: newVersion.version_code.trim(),
            release_date: newVersion.release_date,
            min_android: newVersion.min_android.trim(),
            target_android: newVersion.target_android.trim(),
            architecture: newVersion.architecture.trim(),
            file_size: Math.floor(fileSize),
            sha256: newVersion.sha256.trim() || null,
            source_url: newVersion.source_url.trim() || null,
            custom_download_url: newVersion.custom_download_url.trim() || null,
            verified: newVersion.verified,
          })
          .eq("id", editingVersionId)
          .eq("app_id", selectedAppForVersions.id);
    
        if (error) {
          console.error("Update version error:", error);
          setErrorMessage(error.message);
          return;
        }
    
        cancelVersionForm();
        await loadVersions(selectedAppForVersions);
        await loadDashboard();
      } catch (error) {
        console.error("Update version error:", error);
        setErrorMessage("Unable to update version.");
      } finally {
        setVersionLoading(false);
      }
    }
    
    async function deleteVersion(version: VersionItem) {
      if (!supabase || !selectedAppForVersions) {
        setErrorMessage("No application selected.");
        return;
      }
    
      const confirmed = window.confirm(
        `Are you sure you want to delete version "${version.version_name}"?\n\nThis action cannot be undone.`
      );
    
      if (!confirmed) return;
    
      setVersionLoading(true);
      setErrorMessage("");
    
      try {
        const { error } = await supabase
          .from("versions")
          .delete()
          .eq("id", version.id)
          .eq("app_id", selectedAppForVersions.id);
    
        if (error) {
          console.error("Delete version error:", error);
          setErrorMessage(error.message);
          return;
        }
    
        if (editingVersionId === version.id) {
          cancelVersionForm();
        }
    
        await loadVersions(selectedAppForVersions);
        await loadDashboard();
      } catch (error) {
        console.error("Delete version error:", error);
        setErrorMessage("Unable to delete version.");
      } finally {
        setVersionLoading(false);
      }
    }
    
    function formatFileSize(bytes: number) {
      if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
    
      if (bytes < 1024) {
        return `${bytes} B`;
      }
    
      if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
      }
    
      if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      }
    
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }



  useEffect(() => {
    loadDashboard();
    loadCategories();
  }, []);

  async function loadCategories() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description")
      .order("name", { ascending: true });

    if (error) {
      console.error("Category loading error:", error);
      setErrorMessage(error.message);
      return;
    }

    setCategories((data ?? []) as CategoryItem[]);
  }

  function makeCategorySlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function createCategory() {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }

    const name = newCategoryName.trim();
    const slug = makeCategorySlug(name);

    if (!name) {
      setErrorMessage("Category name is required.");
      return;
    }

    if (!slug) {
      setErrorMessage("Please enter a valid category name.");
      return;
    }

    setCategoryLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name,
          slug,
          description: newCategoryDescription.trim() || null,
        })
        .select("id, name, slug, description")
        .single();

      if (error) {
        console.error("Create category error:", error);
        setErrorMessage(error.message);
        return;
      }

      const created = data as CategoryItem;

      await loadCategories();

      setNewApp((current) => ({
        ...current,
        category_id: created.id,
      }));

      setNewCategoryName("");
      setNewCategoryDescription("");
      setShowAddCategory(false);
    } catch (error) {
      console.error("Create category error:", error);
      setErrorMessage("Unable to create category.");
    } finally {
      setCategoryLoading(false);
    }
  }
  function resetAppForm() {
    setNewApp({ ...emptyApp });
    setEditingAppId(null);
    setInternalLinks([]);
    setNewInternalLink({
      target_app_id: "",
      anchor_text: "",
      placement: "description",
    });
  }

  function startAddApp() {
    resetAppForm();
    setErrorMessage("");
    setShowAddApp(true);
  }

  async function loadInternalLinksForApp(appId: string) {
    if (!supabase) {
      console.error("Supabase client is not available.");
      return;
    }

    const { data, error } = await supabase
      .from("app_internal_links")
      .select("id, source_app_id, target_app_id, anchor_text, placement")
      .eq("source_app_id", appId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Internal links loading error:", error);
      setErrorMessage("Could not load internal links.");
      return;
    }

    setInternalLinks((data ?? []) as InternalLinkItem[]);
  }

  function startEditApp(app: AppItem) {
    setInternalLinks([]);
    loadInternalLinksForApp(app.id);
    setEditingAppId(app.id);
    setErrorMessage("");

    setNewApp({
      name: app.name || "",
      slug: app.slug || "",
      developer: app.developer || "",
      package_name: app.package_name || "",
      category_id: app.category_id ?? "",
      description: app.description ?? "",
      short_description: app.short_description ?? "",
      features: app.features ?? "",
      editorial_notes: app.editorial_notes ?? "",
      icon_url: app.icon_url ?? "",
      official_url: app.official_url ?? "",
      seo_title: app.seo_title ?? "",
      seo_description: app.seo_description ?? "",
      focus_keyword: app.focus_keyword ?? "",
      status: app.status || "active",
      is_trending: app.is_trending ?? false,
    });

    setShowAddApp(true);
  }

  function cancelAppForm() {
    setShowAddApp(false);
    resetAppForm();
    setErrorMessage("");
  }

  async function uploadAppIcon(file: File) {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        "Please choose a JPG, PNG or WebP image."
      );
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage(
        "App icon must be 2 MB or smaller."
      );
      return;
    }

    setIconUploading(true);
    setErrorMessage("");

    try {
      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase()
          .replace(/[^a-z0-9]/g, "") || "png";

      const safeSlug =
        newApp.slug
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-+|-+$/g, "") ||
        "app";

      const uniqueName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const storagePath =
        `icons/${safeSlug}/${uniqueName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("app-media")
          .upload(storagePath, file, {
            cacheControl: "31536000",
            upsert: false,
            contentType: file.type,
          });

      if (uploadError) {
        throw uploadError;
      }

      const mediaUrl = `/media/${storagePath}`;

      setNewApp((current) => ({
        ...current,
        icon_url: mediaUrl,
      }));
    } catch (error) {
      console.error("App icon upload error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to upload app icon."
      );
    } finally {
      setIconUploading(false);
    }
  }

  async function handleAppIconChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    await uploadAppIcon(file);

    event.target.value = "";
  }
  async function createApp() {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }

    if (
      !newApp.name.trim() ||
      !newApp.slug.trim() ||
      !newApp.developer.trim() ||
      !newApp.package_name.trim()
    ) {
      setErrorMessage(
        "Name, slug, developer and package name are required."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { data: createdApp, error } = await supabase.from("apps").insert({
        name: newApp.name.trim(),
        slug: newApp.slug.trim(),
        developer: newApp.developer.trim(),
        package_name: newApp.package_name.trim(),
          category_id: newApp.category_id || null,
        description: newApp.description.trim() || null,
        short_description: newApp.short_description.trim() || null,
        features: newApp.features.trim() || null,
        editorial_notes: newApp.editorial_notes.trim() || null,
        icon_url: newApp.icon_url.trim() || null,
        official_url: newApp.official_url.trim() || null,
          seo_title: newApp.seo_title.trim() || null,
          seo_description: newApp.seo_description.trim() || null,
          focus_keyword: newApp.focus_keyword.trim() || null,
        status: newApp.status,
          is_trending: newApp.is_trending,
      }).select("id").single();

      if (error) {
        console.error("Create app error:", error);
        setErrorMessage(error.message);
        return;
      }

      if (internalLinks.length > 0) {
        const linksToInsert = internalLinks.map((link) => ({
          source_app_id: createdApp.id,
          target_app_id: link.target_app_id,
          anchor_text: link.anchor_text.trim(),
          placement: link.placement,
        }));

        const { error: internalLinksError } = await supabase
          .from("app_internal_links")
          .insert(linksToInsert);

        if (internalLinksError) {
          console.error("Create internal links error:", internalLinksError);
          setErrorMessage(
            "App was created, but internal links could not be saved: " +
              internalLinksError.message
          );
          return;
        }
      }

      cancelAppForm();
      await loadInternalLinkTargets();

      await loadDashboard();
    } catch (error) {
      console.error("Create app error:", error);
      setErrorMessage("Unable to create application.");
    } finally {
      setLoading(false);
    }
  }

  async function updateApp() {
    if (!supabase || !editingAppId) {
      setErrorMessage("No application selected for editing.");
      return;
    }

    if (
      !newApp.name.trim() ||
      !newApp.slug.trim() ||
      !newApp.developer.trim() ||
      !newApp.package_name.trim()
    ) {
      setErrorMessage(
        "Name, slug, developer and package name are required."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("apps")
        .update({
          name: newApp.name.trim(),
          slug: newApp.slug.trim(),
          developer: newApp.developer.trim(),
          package_name: newApp.package_name.trim(),
          category_id: newApp.category_id || null,
          description: newApp.description.trim() || null,
        short_description: newApp.short_description.trim() || null,
        features: newApp.features.trim() || null,
        editorial_notes: newApp.editorial_notes.trim() || null,
          icon_url: newApp.icon_url.trim() || null,
          official_url: newApp.official_url.trim() || null,
          seo_title: newApp.seo_title.trim() || null,
          seo_description: newApp.seo_description.trim() || null,
          focus_keyword: newApp.focus_keyword.trim() || null,
          status: newApp.status,
          is_trending: newApp.is_trending,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingAppId);

      if (error) {
        console.error("Update app error:", error);
        setErrorMessage(error.message);
        return;
      }

      const { error: deleteInternalLinksError } = await supabase
        .from("app_internal_links")
        .delete()
        .eq("source_app_id", editingAppId);

      if (deleteInternalLinksError) {
        console.error(
          "Delete internal links error:",
          deleteInternalLinksError
        );
        setErrorMessage(
          "App was updated, but internal links could not be synchronized: " +
            deleteInternalLinksError.message
        );
        return;
      }

      if (internalLinks.length > 0) {
        const linksToInsert = internalLinks.map((link) => ({
          source_app_id: editingAppId,
          target_app_id: link.target_app_id,
          anchor_text: link.anchor_text.trim(),
          placement: link.placement,
        }));

        const { error: insertInternalLinksError } = await supabase
          .from("app_internal_links")
          .insert(linksToInsert);

        if (insertInternalLinksError) {
          console.error(
            "Insert internal links error:",
            insertInternalLinksError
          );
          setErrorMessage(
            "App was updated, but internal links could not be saved: " +
              insertInternalLinksError.message
          );
          return;
        }
      }

      cancelAppForm();

      await loadDashboard();
    } catch (error) {
      console.error("Update app error:", error);
      setErrorMessage("Unable to update application.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteApp(app: AppItem) {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${app.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("apps")
        .delete()
        .eq("id", app.id);

      if (error) {
        console.error("Delete app error:", error);

        if (
          error.message.toLowerCase().includes("foreign key") ||
          error.message.toLowerCase().includes("violates")
        ) {
          setErrorMessage(
            "This app cannot be deleted because it has related versions or compatibility records."
          );
        } else {
          setErrorMessage(error.message);
        }

        return;
      }

      if (editingAppId === app.id) {
        cancelAppForm();
      }

      await loadDashboard();
    } catch (error) {
      console.error("Delete app error:", error);
      setErrorMessage("Unable to delete application.");
    } finally {
      setLoading(false);
    }
  }

  const filteredApps = apps;

  function renderDashboard() {
    return (
      <main className="content">
        {errorMessage && (
          <div className="error-box">
            <strong>Supabase connection issue</strong>
            <span>{errorMessage}</span>
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Active Apps</span>
              <div className="stat-icon purple-bg">
                <span className="purple-text">◈</span>
              </div>
            </div>

            <div className="stat-value">
              {loading ? "..." : stats.activeApps.toLocaleString()}
            </div>

            <div className="stat-change">
              <span className="purple-text">Live</span>
              <small>from database</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Compatibility Records</span>
              <div className="stat-icon blue-bg">
                <span className="blue-text">♡</span>
              </div>
            </div>

            <div className="stat-value">
              {loading
                ? "..."
                : stats.compatibilityChecks.toLocaleString()}
            </div>

            <div className="stat-change">
              <span className="blue-text">Live</span>
              <small>from database</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Total Apps</span>
              <div className="stat-icon cyan-bg">
                <span className="cyan-text">▦</span>
              </div>
            </div>

            <div className="stat-value">
              {loading ? "..." : stats.totalApps.toLocaleString()}
            </div>

            <div className="stat-change">
              <span className="cyan-text">Database</span>
              <small>all applications</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Total Versions</span>
              <div className="stat-icon green-bg">
                <span className="green-text">↗</span>
              </div>
            </div>

            <div className="stat-value">
              {loading ? "..." : stats.totalVersions.toLocaleString()}
            </div>

            <div className="stat-change">
              <span className="green-text">Live</span>
              <small>version records</small>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="panel apps-panel">
            <div className="panel-header">
              <div>
                <h2>Apps Overview</h2>
                <p>Recently updated applications</p>
              </div>

              <button
                className="view-all"
                onClick={() => setActiveMenu("Apps")}
              >
                View all →
              </button>
            </div>

            <div className="apps-list">
              {loading ? (
                <div className="loading-box">
                  Loading applications...
                </div>
              ) : apps.length === 0 ? (
                <div className="loading-box">
                  No applications found in database.
                </div>
              ) : (
                apps.slice(0, 6).map((app) => (
                  <div className="app-row" key={app.id}>
                    <div className="app-avatar">
  {app.icon_url ? (
    <img
      src={app.icon_url}
      alt={`${app.name} icon`}
    />
  ) : (
    app.name?.charAt(0).toUpperCase() || "A"
  )}
</div>

                    <div className="app-info">
                      <strong>{app.name}</strong>
                      <span>{app.developer}</span>
                    </div>

                    <div className="app-package">
                      {app.package_name}
                    </div>

                    <div
                      className={`app-status ${
                        app.status === "active"
                          ? "active-status"
                          : "inactive-status"
                      }`}
                    >
                      {app.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel quick-panel">
            <div className="panel-header">
              <div>
                <h2>Quick Actions</h2>
                <p>Frequently used controls</p>
              </div>
            </div>

            <button
              className="quick-action"
              onClick={() => {
                setActiveMenu("Apps");
                startAddApp();
              }}
            >
              <span className="quick-icon purple">+</span>

              <div>
                <strong>Add Application</strong>
                <small>Create a new application</small>
              </div>

              <span>›</span>
            </button>

            <button
              className="quick-action"
              onClick={() => setActiveMenu("Apps")}
            >
              <span className="quick-icon purple">◈</span>

              <div>
                <strong>Manage Apps</strong>
                <small>View and edit applications</small>
              </div>

              <span>›</span>
            </button>

            <button
              className="quick-action"
              onClick={() => setActiveMenu("Compatibility")}
            >
              <span className="quick-icon blue">♡</span>

              <div>
                <strong>Compatibility</strong>
                <small>View compatibility data</small>
              </div>

              <span>›</span>
            </button>

            <button
              className="quick-action"
              onClick={() => setActiveMenu("Analytics")}
            >
              <span className="quick-icon green">↗</span>

              <div>
                <strong>Analytics</strong>
                <small>View website data</small>
              </div>

              <span>›</span>
            </button>

            <button
              className="quick-action"
              onClick={loadDashboard}
            >
              <span className="quick-icon orange">↻</span>

              <div>
                <strong>Refresh Data</strong>
                <small>Reload Supabase data</small>
              </div>

              <span>›</span>
            </button>
          </div>
        </section>

        <section className="panel activity-panel">
          <div className="panel-header">
            <div>
              <h2>Recent Activity</h2>
              <p>Latest records from your database</p>
            </div>

            <button
              className="view-all"
              onClick={loadDashboard}
            >
              Refresh ↻
            </button>
          </div>

          <div className="activity-table">
            <div className="table-header">
              <span>ACTIVITY</span>
              <span>APPLICATION</span>
              <span>TIME</span>
              <span>STATUS</span>
            </div>

            {loading ? (
              <div className="loading-box">
                Loading activity...
              </div>
            ) : activities.length === 0 ? (
              <div className="loading-box">
                No recent activity found.
              </div>
            ) : (
              activities.map((activity) => (
                <div className="table-row" key={activity.id}>
                  <span className="activity-name">
                    <span className="activity-dot" />
                    {activity.action}
                  </span>

                  <span>{activity.user}</span>

                  <span className="muted">{activity.time}</span>

                  <span>
                    <span
                      className={`status status-${activity.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {activity.status}
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    );
  }

  function renderApps() {
    return (
      <main className="content">
        {errorMessage && !selectedAppForVersions && (
          <div className="error-box">
            <strong>Application operation failed</strong>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="section-heading">
          <div>
            <h2>Applications</h2>
            <p>Manage all applications stored in Supabase.</p>
          </div>

          <div className="section-actions">
            <button
              className="secondary-button"
              onClick={loadDashboard}
              disabled={loading}
            >
              ↻ Refresh
            </button>

            <button
              className="primary-button"
              onClick={startAddApp}
            >
              + Add App
            </button>
          </div>
        </div>

        {showAddApp && (
          <div className="panel add-app-panel">
            <div className="panel-header">
              <div>
                <h3>
                  {editingAppId
                    ? "Edit Application"
                    : "Add New Application"}
                </h3>

                <p>
                  {editingAppId
                    ? "Update the application details."
                    : "Enter the application details to add it to Supabase."}
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>App Name *</label>

                <input
                  value={newApp.name}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      name: e.target.value,
                    })
                  }
                  placeholder="WhatsApp"
                />
              </div>

              <div className="form-field">
                <label>Slug *</label>

                <input
                  value={newApp.slug}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      slug: e.target.value,
                    })
                  }
                  placeholder="whatsapp"
                />
              </div>

              <div className="form-field">
                <label>Developer *</label>

                <input
                  value={newApp.developer}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      developer: e.target.value,
                    })
                  }
                  placeholder="WhatsApp LLC"
                />
              </div>

              <div className="form-field">
                <label>Package Name *</label>

                <input
                  value={newApp.package_name}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      package_name: e.target.value,
                    })
                  }
                  placeholder="com.whatsapp"
                />
              </div>
              <div className="form-field">
                <label>Category</label>

                <select
                  value={newApp.category_id}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      category_id: e.target.value,
                    })
                  }
                >
                  <option value="">No category</option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddCategory((current) => !current)
                  }
                  style={{
                    marginTop: "8px",
                    padding: 0,
                    border: 0,
                    background: "transparent",
                    color: "#4f46e5",
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {showAddCategory
                    ? "Cancel New Category"
                    : "+ Add New Category"}
                </button>
              </div>

              {showAddCategory && (
                <div
                  className="form-field"
                  style={{
                    gridColumn: "1 / -1",
                    padding: "16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: "#f9fafb",
                  }}
                >
                  <label>New Category Name *</label>

                  <input
                    value={newCategoryName}
                    onChange={(e) =>
                      setNewCategoryName(e.target.value)
                    }
                    placeholder="Casino & Betting"
                  />

                  <label style={{ marginTop: "12px" }}>
                    Slug
                  </label>

                  <input
                    value={makeCategorySlug(newCategoryName)}
                    readOnly
                    placeholder="casino-betting"
                  />

                  <label style={{ marginTop: "12px" }}>
                    Description
                  </label>

                  <textarea
                    value={newCategoryDescription}
                    onChange={(e) =>
                      setNewCategoryDescription(e.target.value)
                    }
                    rows={3}
                    placeholder="Short description for this category."
                  />

                  <button
                    type="button"
                    className="primary-button"
                    onClick={createCategory}
                    disabled={categoryLoading}
                    style={{ marginTop: "12px" }}
                  >
                    {categoryLoading
                      ? "Creating..."
                      : "Create Category"}
                  </button>
                </div>
              )}


              <div className="form-field">
                <label>Status</label>

                <select
                  value={newApp.status}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="beta">Beta</option>
                  <option value="deprecated">Deprecated</option>
                </select>
              </div>

              <div className="form-field">
                <label>Trending APK</label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    minHeight: "42px",
                    padding: "0 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={newApp.is_trending}
                    onChange={(e) =>
                      setNewApp({
                        ...newApp,
                        is_trending: e.target.checked,
                      })
                    }
                  />

                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    Show in Trending APKs
                  </span>
                </label>
              </div>

              <div className="form-field">
                <label>Official URL</label>

                <input
                  value={newApp.official_url}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      official_url: e.target.value,
                    })
                  }
                  placeholder="https://example.com"
                />
              </div>

                            <div className="form-field full-width">
                <label>App Icon</label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(0, 1fr) minmax(140px, 180px)",
                    gap: "16px",
                    alignItems: "start",
                  }}
                >
                  <div>
                    <label
                      style={{
                        minHeight: "84px",
                        border: "1px dashed #a5b4fc",
                        borderRadius: "12px",
                        background: "#f5f7ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: "14px",
                        cursor: iconUploading
                          ? "not-allowed"
                          : "pointer",
                        color: "#4f46e5",
                        fontWeight: 700,
                        fontSize: "13px",
                        boxSizing: "border-box",
                        opacity: iconUploading ? 0.65 : 1,
                      }}
                    >
                      {iconUploading
                        ? "Uploading icon..."
                        : "Upload from Computer / Gallery"}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleAppIconChange}
                        disabled={iconUploading || loading}
                        style={{ display: "none" }}
                      />
                    </label>

                    <div
                      style={{
                        margin: "12px 0",
                        textAlign: "center",
                        color: "#98a2b3",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      OR
                    </div>

                    <label
                      style={{
                        display: "block",
                        marginBottom: "7px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#344054",
                      }}
                    >
                      Icon URL
                    </label>

                    <input
                      value={newApp.icon_url}
                      onChange={(e) =>
                        setNewApp({
                          ...newApp,
                          icon_url: e.target.value,
                        })
                      }
                      placeholder="https://example.com/icon.png"
                    />

                    {newApp.icon_url.startsWith("/media/") && (
                      <p
                        style={{
                          margin: "7px 0 0",
                          fontSize: "11px",
                          color: "#15803d",
                          fontWeight: 600,
                        }}
                      >
                        Stored on DroidZyra media.
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "7px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#344054",
                      }}
                    >
                      Preview
                    </label>

                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "24px",
                        border: "1px solid #eaecf0",
                        background: "#f2f4f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      {newApp.icon_url ? (
                        <img
                          src={newApp.icon_url}
                          alt={
                            newApp.name
                              ? `${newApp.name} icon preview`
                              : "App icon preview"
                          }
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            color: "#98a2b3",
                            fontSize: "12px",
                            fontWeight: 700,
                            textAlign: "center",
                            padding: "10px",
                          }}
                        >
                          No icon selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

                            <div className="form-field full-width">
                <label>Short Description</label>

                <textarea
                  value={newApp.short_description}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      short_description: e.target.value,
                    })
                  }
                  placeholder="1–2 sentence summary for app cards and quick overview..."
                  rows={3}
                />
              </div>

              <div className="form-field full-width">
                <label>About / Long Description</label>

                <textarea
                  value={newApp.description}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      description: e.target.value,
                    })
                  }
                  placeholder="Detailed original app description..."
                  rows={8}
                />
              </div>

              <div className="form-field full-width">
                <label>Internal Links</label>

                <div
                  style={{
                    border: "1px solid #eaecf0",
                    borderRadius: "14px",
                    padding: "16px",
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  <input
                    type="text"
                    value={newInternalLink.anchor_text}
                    onChange={(e) =>
                      setNewInternalLink({
                        ...newInternalLink,
                        anchor_text: e.target.value,
                      })
                    }
                    placeholder="Anchor text, e.g. BeFunky Photo Editor APK"
                  />

                  <select
                    value={newInternalLink.target_app_id}
                    onChange={(e) =>
                      setNewInternalLink({
                        ...newInternalLink,
                        target_app_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select target app</option>

                    {internalLinkTargets
                      .filter((target) => target.id !== editingAppId)
                      .map((target) => (
                        <option key={target.id} value={target.id}>
                          {target.name}
                        </option>
                      ))}
                  </select>

                  <select
                    value={newInternalLink.placement}
                    onChange={(e) =>
                      setNewInternalLink({
                        ...newInternalLink,
                        placement: e.target.value as
                          | "description"
                          | "editorial_notes",
                      })
                    }
                  >
                    <option value="description">
                      Long Description
                    </option>
                    <option value="editorial_notes">
                      Editorial Notes
                    </option>
                  </select>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={addInternalLink}
                  >
                    + Add Internal Link
                  </button>

                  {internalLinks.length > 0 && (
                    <div style={{ display: "grid", gap: "8px" }}>
                      {internalLinks.map((link, index) => {
                        const target = internalLinkTargets.find(
                          (app) => app.id === link.target_app_id
                        );

                        return (
                          <div
                            key={`${link.target_app_id}-${index}`}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "12px",
                              padding: "10px 12px",
                              border: "1px solid #eaecf0",
                              borderRadius: "10px",
                            }}
                          >
                            <div>
                              <strong>{link.anchor_text}</strong>

                              <div
                                style={{
                                  fontSize: "12px",
                                  opacity: 0.7,
                                  marginTop: "3px",
                                }}
                              >
                                {"->"} {target?.name ?? "Unknown app"}{" "}
                                ({link.placement === "description"
                                  ? "Long Description"
                                  : "Editorial Notes"})
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeInternalLink(index)}
                              style={{
                                border: "1px solid #eaecf0",
                                borderRadius: "8px",
                                padding: "6px 10px",
                                cursor: "pointer",
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-field full-width">
                <label>Key Features</label>

                <textarea
                  value={newApp.features}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      features: e.target.value,
                    })
                  }
                  placeholder={"One feature per line, for example:\nBackground playback\nOffline caching\nAndroid Auto support"}
                  rows={7}
                />
              </div>

              <div className="form-field full-width">
                <label>Editorial Notes</label>

                <textarea
                  value={newApp.editorial_notes}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      editorial_notes: e.target.value,
                    })
                  }
                  placeholder="Original DroidZyra notes: compatibility advice, source verification, limitations, useful context..."
                  rows={6}
                />
              </div>

              <div className="form-field full-width">
                <label>SEO Title</label>
                <input
                  value={newApp.seo_title}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      seo_title: e.target.value,
                    })
                  }
                  placeholder="e.g. WhatsApp APK Latest Version for Android"
                />
              </div>

              <div className="form-field full-width">
                <label>Meta Description</label>
                <textarea
                  value={newApp.seo_description}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      seo_description: e.target.value,
                    })
                  }
                  placeholder="Short SEO description for Google results..."
                  rows={3}
                />
              </div>

              <div className="form-field full-width">
                <label>Focus Keyword</label>
                <input
                  value={newApp.focus_keyword}
                  onChange={(e) =>
                    setNewApp({
                      ...newApp,
                      focus_keyword: e.target.value,
                    })
                  }
                  placeholder="e.g. WhatsApp APK latest version"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                className="secondary-button"
                onClick={cancelAppForm}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={
                  editingAppId ? updateApp : createApp
                }
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingAppId
                    ? "Update Application"
                    : "Save Application"}
              </button>
            </div>
          </div>
        )}

        <div className="panel filters-panel">
          <div className="search-box">
            <span>⌕</span>

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by app name, developer, slug or package..."
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="beta">Beta</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>

        <div className="apps-result-info">
          Showing <strong>{filteredApps.length}</strong> of{" "}
          <strong>{adminTotalApps}</strong> applications
        </div>

        <div
          className="panel"
          style={{
            padding: 0,
            overflow: "hidden",
            borderRadius: "18px",
            border: "1px solid #e8eaf0",
            boxShadow: "0 8px 30px rgba(30, 41, 59, 0.06)",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 22px",
              borderBottom: "1px solid #eef0f4",
              background: "#ffffff",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: 750,
                  color: "#1f2937",
                }}
              >
                Applications
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "11px",
                  color: "#98a0ae",
                }}
              >
                Manage your applications, versions and status
              </p>
            </div>

            <div
              style={{
                padding: "7px 11px",
                borderRadius: "999px",
                background: "#f5f3ff",
                color: "#6366f1",
                fontSize: "10px",
                fontWeight: 750,
              }}
            >
              {filteredApps.length} Apps
            </div>
          </div>

          <div className="apps-table">
            <div
              className="apps-table-header"
              style={{
                background: "#f8f9fc",
                borderBottom: "1px solid #eceef3",
              }}
            >
              <span>APPLICATION</span>
              <span>DEVELOPER</span>
              <span>PACKAGE</span>
              <span>STATUS</span>
              <span>ACTIONS</span>
            </div>

            {loading ? (
              <div className="loading-box">
                Loading applications...
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◈</div>
                <strong>No applications found</strong>
                <span>
                  Try changing your search or add a new application.
                </span>
              </div>
            ) : (
              filteredApps.map((app) => (
                <div
                  className="apps-table-row"
                  key={app.id}
                >
                  <div className="app-cell">
                    <div
                      className="app-avatar"
                      style={{
                        width: "42px",
                        height: "42px",
                        minWidth: "42px",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(135deg, #eef2ff, #e0e7ff)",
                        color: "#4f46e5",
                        fontSize: "15px",
                        fontWeight: 800,
                        border: "1px solid #c7d2fe",
                        boxShadow: "0 3px 8px rgba(79,70,229,.08)",
                      }}
                    >
                      {app.name?.charAt(0).toUpperCase() || "A"}
                    </div>

                    <div>
                      <strong>{app.name}</strong>

                      <small
                        style={{
                          display: "block",
                          marginTop: "4px",
                          color: "#9aa1af",
                          fontSize: "10px",
                        }}
                      >
                        {app.slug}
                      </small>
                    </div>
                  </div>

                  <span
                    style={{
                      color: "#475467",
                      fontWeight: 600,
                    }}
                  >
                    {app.developer}
                  </span>

                  <span
                    className="package-text"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      width: "fit-content",
                      maxWidth: "100%",
                      padding: "7px 10px",
                      borderRadius: "7px",
                      background: "#f8fafc",
                      border: "1px solid #e5e7eb",
                      color: "#667085",
                      fontSize: "10px",
                      fontFamily: "monospace",
                    }}
                  >
                    {app.package_name}
                  </span>

                  <span
                    className={`app-status ${
                      app.status === "active"
                        ? "active-status"
                        : app.status === "beta"
                          ? "beta-status"
                          : "inactive-status"
                    }`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "fit-content",
                      minWidth: "72px",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      fontSize: "9px",
                      fontWeight: 800,
                      textTransform: "capitalize",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        marginRight: "6px",
                        background:
                          app.status === "active"
                            ? "#16a34a"
                            : app.status === "beta"
                              ? "#d97706"
                              : "#dc2626",
                      }}
                    />
                    {app.status}
                  </span>

                  <div
                    className="app-actions"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <button
                      className="version-button"
                      onClick={() => loadVersions(app)}
                      disabled={loading || versionLoading}
                      style={{
                        height: "34px",
                        padding: "0 12px",
                        borderRadius: "9px",
                        border: "1px solid #bae6fd",
                        background: "#ecfeff",
                        color: "#0891b2",
                        fontSize: "10px",
                        fontWeight: 750,
                        boxShadow: "0 2px 5px rgba(8,145,178,.06)",
                      }}
                    >
                      ▣ Versions
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        window.open(`/admin/screenshots/${app.id}`, "_blank", "noopener,noreferrer");
                      }}
                      disabled={loading || versionLoading}
                      style={{
                        height: "34px",
                        padding: "0 12px",
                        borderRadius: "9px",
                        border: "1px solid #ddd6fe",
                        background: "#f5f3ff",
                        color: "#7c3aed",
                        fontSize: "10px",
                        fontWeight: 750,
                        boxShadow: "0 2px 5px rgba(124,58,237,.06)",
                      }}
                    >
                      ▧ Screenshots
                    </button>

                    <button
                      className="edit-button"
                      onClick={() => startEditApp(app)}
                      disabled={loading || versionLoading}
                      style={{
                        height: "34px",
                        padding: "0 12px",
                        borderRadius: "9px",
                        border: "1px solid #c7d2fe",
                        background: "#eef2ff",
                        color: "#4f46e5",
                        fontSize: "10px",
                        fontWeight: 750,
                        boxShadow: "0 2px 5px rgba(79,70,229,.06)",
                      }}
                    >
                      ✎ Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteApp(app)}
                      disabled={loading || versionLoading}
                      style={{
                        height: "34px",
                        padding: "0 12px",
                        borderRadius: "9px",
                        border: "1px solid #fecdd3",
                        background: "#fff1f2",
                        color: "#dc2626",
                        fontSize: "10px",
                        fontWeight: 750,
                        boxShadow: "0 2px 5px rgba(220,38,38,.05)",
                      }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {adminTotalApps > ADMIN_PAGE_SIZE && (
          <div
            style={{
              marginTop: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              className="secondary-button"
              disabled={adminPage <= 1 || loading}
              onClick={() =>
                loadAdminApps(
                  adminPage - 1,
                  searchTerm,
                  statusFilter
                )
              }
            >
              ← Previous
            </button>

            <span
              style={{
                minWidth: "120px",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: 700,
                color: "#667085",
              }}
            >
              Page {adminPage} of{" "}
              {Math.max(
                1,
                Math.ceil(adminTotalApps / ADMIN_PAGE_SIZE)
              )}
            </span>

            <button
              type="button"
              className="secondary-button"
              disabled={
                adminPage >=
                  Math.ceil(adminTotalApps / ADMIN_PAGE_SIZE) ||
                loading
              }
              onClick={() =>
                loadAdminApps(
                  adminPage + 1,
                  searchTerm,
                  statusFilter
                )
              }
            >
              Next →
            </button>
          </div>
        )}

      {selectedAppForVersions && (
        <div className="panel" style={{ marginTop: "24px" }}>
          <div className="section-heading">
            <div>
              <h2>Version Management</h2>
              <p>
                Manage versions for {selectedAppForVersions.name}.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="primary-button"
                onClick={startAddVersion}
                disabled={versionLoading}
              >
                + Add Version
              </button>

              <button
                className="secondary-button"
                onClick={() => {
                  setSelectedAppForVersions(null);
                  setVersions([]);
                  cancelVersionForm();
                }}
                disabled={versionLoading}
              >
                Close
              </button>
            </div>
          </div>

          {errorMessage && (
            <div
              style={{
                margin: "0 0 18px",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: "12px",
                fontWeight: 650,
              }}
            >
              {errorMessage}
            </div>
          )}


          {showVersionForm && (
            <div className="app-form" style={{ marginBottom: "20px" }}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Version Name</label>
                  <input
                    value={newVersion.version_name}
                    onChange={(e) =>
                      setNewVersion({
                        ...newVersion,
                        version_name: e.target.value,
                      })
                    }
                    placeholder="e.g. 10.5.2"
                  />
                </div>

                <div className="form-field">
                  <label>Version Code</label>
                  <input
                    value={newVersion.version_code}
                    onChange={(e) =>
                      setNewVersion({
                        ...newVersion,
                        version_code: e.target.value,
                      })
                    }
                    placeholder="e.g. 123456"
                  />
                </div>

                <div className="form-field">
                  <label>Release Date</label>
                  <input
                    type="date"
                    value={newVersion.release_date}
                    onChange={(e) =>
                      setNewVersion({
                        ...newVersion,
                        release_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Min Android</label>
                  <input
                    value={newVersion.min_android}
                    onChange={(e) =>
                      setNewVersion({
                        ...newVersion,
                        min_android: e.target.value,
                      })
                    }
                    placeholder="e.g. Android 8.0"
                  />
                </div>

                <div className="form-field">
                  <label>Target Android</label>
                  <input
                    value={newVersion.target_android}
                    onChange={(e) =>
                      setNewVersion({
                        ...newVersion,
                        target_android: e.target.value,
                      })
                    }
                    placeholder="e.g. Android 15"
                  />
                </div>

                <div className="form-field">
                  <label>Architecture</label>
                  <input
                    value={newVersion.architecture}
                    onChange={(e) =>
                      setNewVersion({
                        ...newVersion,
                        architecture: e.target.value,
                      })
                    }
                    placeholder="e.g. arm64-v8a"
                  />
                </div>

                <div className="form-field">
                  <label>File Size (bytes)</label>
                  <input
                    type="number"
                    min="0"
                    value={newVersion.file_size}
                    onChange={(e) =>
                      setNewVersion({
                        ...newVersion,
                        file_size: e.target.value,
                      })
                    }
                    placeholder="e.g. 125000000"
                  />
                </div>

                <div className="form-field">
                  <label>SHA256</label>
                  <input
                    value={newVersion.sha256}
                    onChange={(e) =>
                      setNewVersion({
                        ...newVersion,
                        sha256: e.target.value,
                      })
                    }
                    placeholder="Optional SHA256"
                  />
                </div>

                <div className="form-field full-width">
                  <label>Source URL</label>
                  <input
                    value={newVersion.source_url}
                    onChange={(e) =>
                      setNewVersion({
                        ...newVersion,
                        source_url: e.target.value,
                      })
                    }
                    placeholder="https://example.com/download"
                  />
                </div>

                <div className="form-field full-width">
                  <label>Custom Download URL</label>
                  <input
                    value={newVersion.custom_download_url}
                    onChange={(e) =>
                      setNewVersion({
                        ...newVersion,
                        custom_download_url: e.target.value,
                      })
                    }
                    placeholder="https://your-download-link.com/file.apk"
                  />
                  <small className="form-help">
                    Optional. This link will be used for the DroidZyra Download APK button.
                  </small>
                </div>

                <div className="form-field full-width">
                  <label>Verification Status</label>
                  <select
                    value={newVersion.verified ? "verified" : "unverified"}
                    onChange={(e) =>
                      setNewVersion({
                        ...newVersion,
                        verified: e.target.value === "verified",
                      })
                    }
                  >
                    <option value="unverified">Unverified</option>
                    <option value="verified">Verified</option>
                  </select>
                  <small className="form-help">
                    Select Verified only after checking this version and its source.
                  </small>
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="secondary-button"
                  onClick={cancelVersionForm}
                  disabled={versionLoading}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  onClick={
                    editingVersionId ? updateVersion : createVersion
                  }
                  disabled={versionLoading}
                >
                  {versionLoading
                    ? "Saving..."
                    : editingVersionId
                      ? "Update Version"
                      : "Save Version"}
                </button>
              </div>
            </div>
          )}

          {versionLoading && !showVersionForm ? (
            <div className="loading-box">
              Loading versions...
            </div>
          ) : versions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▣</div>
              <strong>No versions found</strong>
              <span>
                Add the first version for {selectedAppForVersions.name}.
              </span>
            </div>
          ) : (
            <div className="apps-table">
              <div className="apps-table-header">
                <span>VERSION</span>
                <span>ANDROID</span>
                <span>ARCHITECTURE</span>
                <span>FILE SIZE</span>
                <span>ACTIONS</span>
              </div>

              {versions.map((version) => (
                <div
                  className="apps-table-row"
                  key={version.id}
                >
                  <div className="app-cell">
                    <div className="app-avatar">V</div>
                    <div>
                      <strong>{version.version_name}</strong>
                      <small>
                        Code {version.version_code} •{" "}
                        {version.release_date}
                      </small>
                    </div>
                  </div>

                  <span>
                    {version.min_android} → {version.target_android}
                  </span>

                  <span className="package-text">
                    {version.architecture}
                  </span>

                  <span>
                    {formatFileSize(version.file_size)}
                  </span>

                  <div className="app-actions">
                    <button
                      className="edit-button"
                      onClick={() => startEditVersion(version)}
                      disabled={versionLoading}
                    >
                      ✎ Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteVersion(version)}
                      disabled={versionLoading}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </main>
    );
  }

  function renderCompatibility() {
    return (
      <main className="content">
        {errorMessage && (
          <div className="error-box">
            <strong>Compatibility data issue</strong>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="section-heading">
          <div>
            <h2>Compatibility</h2>
            <p>
              Compatibility records stored for Android versions and
              applications.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={loadDashboard}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        <div className="stats-grid compatibility-stats">
          <div className="stat-card">
            <span className="stat-title">Total Records</span>

            <div className="stat-value">
              {loading
                ? "..."
                : stats.compatibilityChecks.toLocaleString()}
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-title">Active Apps</span>

            <div className="stat-value">
              {loading
                ? "..."
                : stats.activeApps.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="panel info-panel">
          <div className="info-icon blue-bg blue-text">♡</div>

          <div>
            <h3>Compatibility Finder</h3>

            <p>
              The public Compatibility Finder is connected to your
              compatibility data. Use the public tool to test Android
              compatibility.
            </p>

            <a
              href="/compatibility"
              className="primary-button link-button"
            >
              Open Compatibility Finder →
            </a>
          </div>
        </div>
      </main>
    );
  }

  function renderAnalytics() {
    return (
      <main className="content">
        <div className="section-heading">
          <div>
            <h2>Analytics</h2>
            <p>Database-level statistics for your website.</p>
          </div>

          <button
            className="secondary-button"
            onClick={loadDashboard}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-title">Active Apps</span>

            <div className="stat-value">
              {loading ? "..." : stats.activeApps}
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-title">All Apps</span>

            <div className="stat-value">
              {loading ? "..." : stats.totalApps}
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-title">Versions</span>

            <div className="stat-value">
              {loading ? "..." : stats.totalVersions}
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-title">
              Compatibility Records
            </span>

            <div className="stat-value">
              {loading
                ? "..."
                : stats.compatibilityChecks}
            </div>
          </div>
        </div>

        <div className="analytics-dashboard">
          <div className="analytics-section-header">
            <div>
              <span className="analytics-eyebrow">DATABASE INSIGHTS</span>
              <h3>Application Analytics</h3>
              <p>Live statistics calculated from your Supabase application data.</p>
            </div>
            <span className="analytics-live-badge">● Live Data</span>
          </div>

          <div className="analytics-mini-grid">
            <div className="analytics-mini-card purple">
              <span className="analytics-mini-label">Active Rate</span>
              <strong>
                {stats.totalApps > 0
                  ? `${Math.round((stats.activeApps / stats.totalApps) * 100)}%`
                  : "0%"}
              </strong>
              <small>{stats.activeApps} of {stats.totalApps} apps active</small>
            </div>

            <div className="analytics-mini-card blue">
              <span className="analytics-mini-label">Versions / App</span>
              <strong>
                {stats.totalApps > 0
                  ? (stats.totalVersions / stats.totalApps).toFixed(1)
                  : "0"}
              </strong>
              <small>average version records</small>
            </div>

            <div className="analytics-mini-card green">
              <span className="analytics-mini-label">Beta Apps</span>
              <strong>{apps.filter((app) => app.status === "beta").length}</strong>
              <small>currently in beta status</small>
            </div>

            <div className="analytics-mini-card orange">
              <span className="analytics-mini-label">Deprecated</span>
              <strong>{apps.filter((app) => app.status === "deprecated").length}</strong>
              <small>applications requiring review</small>
            </div>
          </div>

          <div className="analytics-detail-grid">
            <div className="analytics-breakdown-card">
              <div className="analytics-card-heading">
                <div>
                  <h4>Application Status</h4>
                  <p>Current distribution across your catalog</p>
                </div>
                <span>◈</span>
              </div>

              <div className="analytics-progress-item">
                <div>
                  <span>Active</span>
                  <strong>{apps.filter((app) => app.status === "active").length}</strong>
                </div>
                <div className="analytics-progress">
                  <span
                    className="progress-active"
                    style={{
                      width: `${stats.totalApps > 0
                        ? (apps.filter((app) => app.status === "active").length / stats.totalApps) * 100
                        : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="analytics-progress-item">
                <div>
                  <span>Beta</span>
                  <strong>{apps.filter((app) => app.status === "beta").length}</strong>
                </div>
                <div className="analytics-progress">
                  <span
                    className="progress-beta"
                    style={{
                      width: `${stats.totalApps > 0
                        ? (apps.filter((app) => app.status === "beta").length / stats.totalApps) * 100
                        : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="analytics-progress-item">
                <div>
                  <span>Deprecated</span>
                  <strong>{apps.filter((app) => app.status === "deprecated").length}</strong>
                </div>
                <div className="analytics-progress">
                  <span
                    className="progress-deprecated"
                    style={{
                      width: `${stats.totalApps > 0
                        ? (apps.filter((app) => app.status === "deprecated").length / stats.totalApps) * 100
                        : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="analytics-breakdown-card">
              <div className="analytics-card-heading">
                <div>
                  <h4>Database Overview</h4>
                  <p>Records currently managed by DroidZyra</p>
                </div>
                <span>⌁</span>
              </div>

              <div className="analytics-record-list">
                <div><span>Applications</span><strong>{stats.totalApps}</strong></div>
                <div><span>Version Records</span><strong>{stats.totalVersions}</strong></div>
                <div><span>Compatibility Records</span><strong>{stats.compatibilityChecks}</strong></div>
                <div><span>Active Applications</span><strong>{stats.activeApps}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  function renderSettings() {
    return (
      <main className="content">
        <div className="section-heading">
          <div>
            <h2>Settings</h2>
            <p>Basic administration settings.</p>
          </div>
        </div>

        <div className="panel settings-panel">
          <div className="setting-row">
            <div>
              <strong>Database</strong>
              <p>Supabase connection</p>
            </div>

            <span className="connection-badge">
              {supabase ? "Connected" : "Not configured"}
            </span>
          </div>

          <div className="setting-row">
            <div>
              <strong>Environment</strong>
              <p>Application environment</p>
            </div>

            <span className="neutral-badge">
              Next.js
            </span>
          </div>

          <div className="setting-row">
            <div>
              <strong>Admin Dashboard</strong>
              <p>Current dashboard interface</p>
            </div>

            <span className="connection-badge">
              Active
            </span>
          </div>

          <div className="setting-row">
            <div>
              <strong>Application Management</strong>
              <p>Add, edit and delete applications</p>
            </div>

            <span className="connection-badge">
              Enabled
            </span>
          </div>

          <div className="setting-row">
            <div>
              <strong>Admin Session</strong>
              <p>Protected Supabase authentication session</p>
            </div>

            <span className="connection-badge">
              Authenticated
            </span>
          </div>

          <div className="setting-row">
            <div>
              <strong>Traffic Analytics</strong>
              <p>Page views, visitors, devices and country analytics</p>
            </div>

            <span className="neutral-badge">
              Pending Domain
            </span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="admin-wrapper">
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : ""} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <div className="brand">
          <div className="brand-logo">A</div>

          <div>
            <div className="brand-name">
              DroidZyra
            </div>

            <div className="brand-subtitle">
              Control Center
            </div>
          </div>
        </div>

        <div className="menu-section">
          <div className="menu-label">
            MAIN MENU
          </div>

          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`menu-item ${
                activeMenu === item.name
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                const section = item.name.toLowerCase();

                window.open(
                  `/admin?section=${encodeURIComponent(section)}`,
                  "_blank",
                  "noopener,noreferrer"
                );

                setSidebarOpen(false);
              }}
            >
              <span className="menu-icon">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </button>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className="admin-card">
            <div className="admin-avatar">
              A
            </div>

            <div className="admin-info">
              <strong>Administrator</strong>
              <span>Admin account</span>
            </div>

            <button
              className="logout-button"
              title="Logout"
              onClick={async () => {
                if (!supabase) return;

                await supabase.auth.signOut();
                window.location.href =
                  "/admin/login";
              }}
            >
              ↪
            </button>
          </div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => {
              if (window.innerWidth <= 800) {
                setSidebarOpen(true);
              } else {
                setSidebarCollapsed((prev) => !prev);
              }
            }}
          >
            ☰
          </button>

          <div>
            <h1>{activeMenu}</h1>

            <p>
              {activeMenu === "Dashboard"
                ? "Welcome back. Here's what's happening today."
                : `Manage your ${activeMenu.toLowerCase()} from here.`}
            </p>
          </div>

          <div className="topbar-actions">
            <button
              className="notification-button"
              title="Refresh dashboard"
              onClick={loadDashboard}
            >
              ♢
              <span />
            </button>

            <div className="profile">
              <div className="profile-avatar">
                A
              </div>

              <div className="profile-text">
                <strong>Admin</strong>
                <small>Administrator</small>
              </div>
            </div>
          </div>
        </header>

        {activeMenu === "Dashboard" &&
          renderDashboard()}

        {activeMenu === "Apps" &&
          renderApps()}

        {activeMenu === "Compatibility" &&
          renderCompatibility()}

        {activeMenu === "Analytics" &&
          renderAnalytics()}

        {activeMenu === "Settings" &&
          renderSettings()}
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .admin-wrapper {
          min-height: 100vh;
          background: #f6f7fb;
          color: #172033;
          display: flex;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .sidebar {
          width: 255px;
          background: #ffffff;
          border-right: 1px solid #e8eaf0;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 50;
        }

        .brand {
          height: 82px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 22px;
          border-bottom: 1px solid #f0f1f5;
        }

        .brand-logo {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
          );
          color: white;
          font-size: 19px;
          font-weight: 800;
          box-shadow:
            0 7px 18px
            rgba(79, 70, 229, 0.25);
        }

        .brand-name {
          font-size: 16px;
          font-weight: 800;
          color: #182033;
        }

        .brand-subtitle {
          color: #8b93a5;
          font-size: 11px;
          margin-top: 2px;
        }

        .menu-section {
          padding: 25px 14px;
        }

        .menu-label {
          font-size: 10px;
          font-weight: 800;
          color: #a0a6b4;
          letter-spacing: 1.2px;
          padding: 0 12px 10px;
        }

        .menu-item {
          width: 100%;
          border: 0;
          background: transparent;
          color: #6d7587;
          padding: 12px 13px;
          margin-bottom: 4px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: 0.2s;
        }

        .menu-item:hover {
          background: #f5f5ff;
          color: #4f46e5;
        }

        .menu-item.active {
          color: #4f46e5;
          background: #eeefff;
        }

        .menu-icon {
          width: 22px;
          font-size: 18px;
          text-align: center;
        }

        .sidebar-bottom {
          margin-top: auto;
          padding: 15px;
          border-top: 1px solid #f0f1f5;
        }

        .admin-card {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px;
          border-radius: 11px;
          background: #f7f8fb;
        }

        .admin-avatar,
        .profile-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
          );
          color: #fff;
          font-weight: 700;
        }

        .admin-avatar {
          width: 34px;
          height: 34px;
          font-size: 13px;
        }

        .admin-info {
          flex: 1;
          min-width: 0;
        }

        .admin-info strong,
        .admin-info span {
          display: block;
        }

        .admin-info strong {
          font-size: 11px;
        }

        .admin-info span {
          font-size: 9px;
          color: #9098a8;
          margin-top: 2px;
        }

        .logout-button {
          border: 0;
          background: transparent;
          color: #9ca3b2;
          cursor: pointer;
          font-size: 18px;
        }

        .logout-button:hover {
          color: #dc2626;
        }

        .main-area {
          width: calc(100% - 255px);
          margin-left: 255px;
          min-height: 100vh;
        }

        .topbar {
          min-height: 82px;
          background: rgba(
            255,
            255,
            255,
            0.95
          );
          border-bottom: 1px solid #e8eaf0;
          display: flex;
          align-items: center;
          padding: 16px 34px;
          gap: 20px;
          position: sticky;
          top: 0;
          z-index: 30;
          backdrop-filter: blur(10px);
        }

        .topbar h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        .topbar p {
          margin: 5px 0 0;
          color: #8b93a5;
          font-size: 12px;
        }

        .topbar-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .notification-button {
          width: 36px;
          height: 36px;
          border: 1px solid #e8eaf0;
          background: #fff;
          border-radius: 10px;
          color: #5e6678;
          font-size: 18px;
          position: relative;
          cursor: pointer;
        }

        .notification-button:hover {
          background: #f8f8ff;
          color: #4f46e5;
        }

        .notification-button span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ef4444;
          position: absolute;
          right: 7px;
          top: 6px;
          border: 1px solid white;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          font-size: 13px;
        }

        .profile-text strong,
        .profile-text small {
          display: block;
        }

        .profile-text strong {
          font-size: 12px;
        }

        .profile-text small {
          color: #9299a8;
          font-size: 10px;
          margin-top: 2px;
        }

        .content {
          padding: 30px 34px 50px;
          max-width: 1500px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(
            4,
            minmax(0, 1fr)
          );
          gap: 17px;
        }

        .stat-card,
        .panel {
          background: #fff;
          border: 1px solid #e9ebf1;
          border-radius: 15px;
          box-shadow:
            0 3px 15px
            rgba(26, 35, 58, 0.025);
        }

        .stat-card {
          padding: 20px;
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-title {
          color: #737b8d;
          font-size: 12px;
          font-weight: 600;
        }

        .stat-icon {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 17px;
        }

        .stat-value {
          font-size: 27px;
          font-weight: 800;
          margin-top: 14px;
          letter-spacing: -0.7px;
        }

        .stat-change {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .stat-change span {
          font-size: 10px;
          font-weight: 700;
        }

        .stat-change small {
          color: #a0a6b4;
          font-size: 9px;
        }

        .purple-bg {
          background: #f0efff;
        }

        .blue-bg {
          background: #eaf8ff;
        }

        .cyan-bg {
          background: #eafaff;
        }

        .green-bg {
          background: #e9fbf4;
        }

        .purple-text {
          color: #4f46e5;
        }

        .blue-text {
          color: #0891b2;
        }

        .cyan-text {
          color: #0891b2;
        }

        .green-text {
          color: #059669;
        }

        .orange {
          background: #fff5e8;
          color: #d97706;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 2fr)
            minmax(300px, 1fr);
          gap: 18px;
          margin-top: 18px;
        }

        .panel {
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 21px;
          border-bottom: 1px solid #f0f1f5;
        }

        .panel-header h2,
        .panel-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
        }

        .panel-header p {
          margin: 5px 0 0;
          font-size: 10px;
          color: #969dac;
        }

        .apps-panel,
        .quick-panel {
          min-height: 315px;
        }

        .apps-list {
          width: 100%;
        }

        .app-row {
          display: grid;
          grid-template-columns:
            38px
            minmax(130px, 1fr)
            minmax(120px, 1fr)
            auto;
          align-items: center;
          gap: 12px;
          padding: 13px 20px;
          border-top: 1px solid #f0f1f5;
        }

        .app-avatar {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
          );
          color: white;
          font-size: 13px;
          font-weight: 800;
        }

        .app-info strong,
        .app-info span {
          display: block;
        }

        .app-info strong {
          font-size: 11px;
          color: #333c4f;
        }

        .app-info span {
          margin-top: 3px;
          font-size: 9px;
          color: #9aa1af;
        }

        .app-package {
          font-size: 9px;
          color: #929aaa;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .app-status {
          display: inline-flex;
          width: fit-content;
          padding: 5px 8px;
          border-radius: 20px;
          font-size: 8px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .active-status {
          background: #e9fbf3;
          color: #059669;
        }

        .beta-status {
          background: #fff7e6;
          color: #d97706;
        }

        .inactive-status {
          background: #f1f2f5;
          color: #6b7280;
        }

        .quick-action {
          width: calc(100% - 30px);
          margin: 0 15px 10px;
          border: 1px solid #edf0f4;
          background: white;
          border-radius: 10px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 11px;
          cursor: pointer;
          text-align: left;
          transition: 0.2s;
        }

        .quick-action:hover {
          border-color: #dcdcff;
          background: #fafaff;
          transform: translateY(-1px);
        }

        .quick-action > div {
          flex: 1;
        }

        .quick-action strong,
        .quick-action small {
          display: block;
        }

        .quick-action strong {
          font-size: 11px;
        }

        .quick-action small {
          color: #969dac;
          font-size: 9px;
          margin-top: 3px;
        }

        .quick-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          font-size: 16px;
          font-weight: 700;
        }

        .quick-icon.purple {
          background: #f0efff;
          color: #4f46e5;
        }

        .quick-icon.blue {
          background: #eaf8ff;
          color: #0891b2;
        }

        .quick-icon.green {
          background: #e9fbf4;
          color: #059669;
        }

        .quick-icon.orange {
          background: #fff5e8;
          color: #d97706;
        }

        .quick-action > span:last-child {
          color: #a0a7b5;
          font-size: 20px;
        }

        .activity-panel {
          margin-top: 18px;
        }

        .view-all {
          border: 0;
          background: transparent;
          color: #4f46e5;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .activity-table {
          width: 100%;
        }

        .table-header,
        .table-row {
          display: grid;
          grid-template-columns:
            2fr 1fr 1fr 0.8fr;
          align-items: center;
          padding: 13px 21px;
          gap: 15px;
        }

        .table-header {
          background: #fafbfc;
          color: #a0a6b3;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .table-row {
          border-top: 1px solid #f0f1f5;
          color: #626b7d;
          font-size: 10px;
        }

        .activity-name {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #333c4f;
          font-weight: 600;
        }

        .activity-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4f46e5;
          flex-shrink: 0;
        }

        .muted {
          color: #9aa1af;
        }

        .status {
          display: inline-flex;
          padding: 5px 8px;
          border-radius: 20px;
          font-size: 8px;
          font-weight: 700;
          background: #edf2ff;
          color: #4f46e5;
        }

        .status-compatible {
          background: #e9fbf3;
          color: #059669;
        }

        .status-incompatible {
          background: #fff0f0;
          color: #dc2626;
        }

        .status-limited {
          background: #fff7e6;
          color: #d97706;
        }

        .status-updated {
          background: #edf2ff;
          color: #4f46e5;
        }

        .loading-box {
          padding: 35px 20px;
          text-align: center;
          color: #8b93a5;
          font-size: 11px;
        }

        .error-box {
          margin-bottom: 18px;
          padding: 14px 16px;
          border: 1px solid #fecaca;
          background: #fff5f5;
          border-radius: 10px;
          color: #991b1b;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 11px;
        }

        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          gap: 15px;
        }
        .apps-table {
          width: 100%;
          min-width: 0;
          overflow-x: auto;
          overflow-y: hidden;
          border: 1px solid #e6e9f0;
          border-radius: 14px;
          background: #ffffff;
        }

        .apps-table-header,
        .apps-table-row {
          display: grid;
          grid-template-columns:
            minmax(210px, 2fr)
            minmax(150px, 1.15fr)
            minmax(190px, 1.35fr)
            minmax(110px, 0.8fr)
            minmax(300px, 1.8fr);
          align-items: center;
          column-gap: 20px;
          min-width: 980px;
        }

        .apps-table-header {
          min-height: 48px;
          padding: 0 20px;
          background: #f7f8fc;
          border-bottom: 1px solid #e7e9ef;
          color: #8a92a3;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .apps-table-row {
          min-height: 78px;
          padding: 14px 20px;
          border-top: 1px solid #eef0f4;
          background: #ffffff;
          color: #5f687a;
          font-size: 11px;
          transition:
            background 0.18s ease,
            box-shadow 0.18s ease;
        }

        .apps-table-row:hover {
          background: #fbfcff;
        }

        .app-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .app-cell > div:last-child {
          min-width: 0;
        }

        .app-cell strong {
          display: block;
          color: #252b3a;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .app-cell small {
          display: block;
          margin-top: 4px;
          color: #9aa1af;
          font-size: 10px;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .package-text {
          display: block;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #667085;
          font-size: 10px;
        }

        .app-actions {
          display: flex !important;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          width: 100%;
          min-width: 300px;
          white-space: nowrap;
          flex-wrap: nowrap !important;
        }

        .app-actions button,
        .version-button,
        .edit-button,
        .delete-button {
          flex: 0 0 auto !important;
          width: auto !important;
          min-width: 82px !important;
          height: 36px !important;
          min-height: 36px !important;
          padding: 0 13px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 5px;
          border-radius: 9px;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
          cursor: pointer;
          white-space: nowrap;
          box-sizing: border-box;
          transition:
            background 0.18s ease,
            border-color 0.18s ease,
            transform 0.18s ease,
            box-shadow 0.18s ease,
            opacity 0.18s ease;
        }

        .version-button {
          background: #ecfeff !important;
          border: 1px solid #bae6fd !important;
          color: #0891b2 !important;
        }

        .version-button:hover {
          background: #cffafe !important;
          border-color: #67e8f9 !important;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(8, 145, 178, 0.12);
        }

        .edit-button {
          background: #eef2ff !important;
          border: 1px solid #c7d2fe !important;
          color: #4f46e5 !important;
        }

        .edit-button:hover {
          background: #e0e7ff !important;
          border-color: #a5b4fc !important;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(79, 70, 229, 0.12);
        }

        .delete-button {
          background: #fff1f2 !important;
          border: 1px solid #fecdd3 !important;
          color: #dc2626 !important;
        }

        .delete-button:hover {
          background: #ffe4e6 !important;
          border-color: #fda4af !important;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(220, 38, 38, 0.12);
        }

        .version-button:disabled,
        .edit-button:disabled,
        .delete-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .empty-state {
          min-height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 6px;
          color: #929aaa;
          text-align: center;
        }

        @media (max-width: 1200px) {
          .apps-table-header,
          .apps-table-row {
            grid-template-columns:
              minmax(190px, 2fr)
              minmax(135px, 1.1fr)
              minmax(175px, 1.3fr)
              minmax(105px, 0.8fr)
              minmax(285px, 1.7fr);
            column-gap: 16px;
          }
        }

        @media (max-width: 900px) {
          .apps-table {
            overflow-x: auto;
          }

          .apps-table-header {
            display: none;
          }

          .apps-table-row {
            display: grid;
            grid-template-columns: 1fr;
            min-width: 0;
            min-height: 0;
            gap: 12px;
            padding: 16px;
          }

          .app-actions {
            min-width: 0;
            width: 100%;
          }

          .app-actions button {
            flex: 1 1 0 !important;
            min-width: 0 !important;
          }
        }
        }

        .version-button,
        .edit-button,
        .delete-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 34px;
          min-width: 82px;
          border: 1px solid transparent;
          border-radius: 8px;
          padding: 0 12px;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
          cursor: pointer;
          white-space: nowrap;
          transition:
            background 0.18s ease,
            border-color 0.18s ease,
            transform 0.18s ease,
            box-shadow 0.18s ease,
            opacity 0.18s ease;
        }

        .version-button {
          background: #ecfeff;
          border-color: #bae6fd;
          color: #0891b2;
        }

        .version-button:hover {
          background: #cffafe;
          border-color: #67e8f9;
          transform: translateY(-1px);
        }

        .edit-button {
          background: #eef2ff;
          border-color: #c7d2fe;
          color: #4f46e5;
        }

        .edit-button:hover {
          background: #e0e7ff;
          border-color: #a5b4fc;
          transform: translateY(-1px);
        }

        .delete-button {
          background: #fff1f2;
          border-color: #fecdd3;
          color: #dc2626;
        }

        .delete-button:hover {
          background: #ffe4e6;
          border-color: #fda4af;
          transform: translateY(-1px);
        }

        .version-button:disabled,
        .edit-button:disabled,
        .delete-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .empty-state {
          min-height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 6px;
          color: #929aaa;
          text-align: center;
        }

        .empty-state strong {
          color: #4b5563;
          font-size: 12px;
        }

        .empty-state span {
          font-size: 10px;
        }

        .empty-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0efff;
          color: #4f46e5;
          font-size: 20px;
          margin-bottom: 5px;
        }

        .info-panel {
          margin-top: 18px;
          padding: 25px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .info-icon {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .info-panel h3 {
          margin: 0;
          font-size: 14px;
        }

        .info-panel p {
          margin: 7px 0 0;
          color: #8b93a5;
          font-size: 11px;
          line-height: 1.7;
          max-width: 700px;
        }

        .compatibility-stats {
          grid-template-columns: repeat(2, 1fr);
        }

        .settings-panel {
          padding: 0 20px;
        }

        .setting-row {
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid #f0f1f5;
        }

        .setting-row:last-child {
          border-bottom: 0;
        }

        .setting-row strong {
          display: block;
          font-size: 12px;
        }

        .setting-row p {
          margin: 4px 0 0;
          color: #929aaa;
          font-size: 10px;
        }

        .connection-badge,
        .neutral-badge {
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 9px;
          font-weight: 700;
        }

        .connection-badge {
          background: #e9fbf3;
          color: #059669;
        }

        .neutral-badge {
          background: #f1f2f5;
          color: #667085;
        }

        .mobile-menu {
          display: none;
          border: 0;
          background: #f1f2f7;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          font-size: 17px;
          cursor: pointer;
        }

        .mobile-overlay {
          display: none;
        }

        @media (max-width: 1200px) {
          .apps-table-header,
          .apps-table-row {
            grid-template-columns:
              2fr
              1.1fr
              1.3fr
              0.8fr
              150px;
          }
        }

        @media (max-width: 1100px) {
          .stats-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .apps-table-header {
            display: none;
          }

          .apps-table-row {
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 16px;
          }

          .app-actions {
            padding-top: 4px;
          }
        }

        @media (max-width: 800px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }

          .sidebar.sidebar-open {
            transform: translateX(0);
          }

          .mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.35);
            z-index: 40;
          }

          .main-area {
            width: 100%;
            margin-left: 0;
          }

          .mobile-menu {
            display: block;
          }

          .profile-text {
            display: none;
          }

          .topbar {
            padding: 14px 18px;
          }

          .content {
            padding: 20px 15px 40px;
          }

          .app-row {
            grid-template-columns:
              38px
              1fr
              auto;
          }

          .app-package {
            display: none;
          }

          .filters-panel {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-select {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .stats-grid,
          .compatibility-stats {
            grid-template-columns: 1fr;
          }

          .topbar h1 {
            font-size: 18px;
          }

          .topbar p {
            font-size: 10px;
          }

          .notification-button {
            display: none;
          }

          .table-header {
            display: none;
          }

          .table-row {
            grid-template-columns: 1fr;
            gap: 7px;
            padding: 15px;
          }

          .table-row > span:not(.activity-name) {
            padding-left: 16px;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .section-actions {
            width: 100%;
          }

          .section-actions button {
            flex: 1;
          }

          .info-panel {
            flex-direction: column;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-field.full-width {
            grid-column: auto;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .form-actions button {
            width: 100%;
          }

          .app-actions {
            width: 100%;
          }

          .version-button,
.edit-button,
.delete-button {
  flex: 1;
}

          .settings-panel {
            padding: 0 15px;
          }

          .setting-row {
            align-items: flex-start;
            flex-direction: column;
            justify-content: center;
            padding: 15px 0;
          }
        }

        /* =========================================================
           PROFESSIONAL ADMIN UI - SAFE OVERRIDE LAYER
           ========================================================= */

        .admin-wrapper {
          background: #f5f7fb;
          color: #172033;
        }

        .sidebar {
          background: #111827;
          border-right: 1px solid #1f2937;
          box-shadow: 8px 0 30px rgba(15, 23, 42, 0.08);
        }

        .sidebar-logo,
        .logo,
        .brand {
          color: #ffffff;
        }
        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 18px 12px;
        }

        .sidebar-menu button,
        .sidebar-item,
        .menu-item {
          width: 100%;
          min-height: 46px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
          border: 0;
          border-radius: 11px;
          background: transparent;
          color: #98a2b3;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
          text-align: left;
          cursor: pointer;
          transition: background .18s ease, color .18s ease, transform .18s ease, box-shadow .18s ease;
        }

        .sidebar-menu button:hover,
        .sidebar-item:hover,
        .menu-item:hover {
          background: #1f2937;
          color: #ffffff;
          transform: translateX(2px);
        }

        .sidebar-menu button.active,
        .sidebar-item.active,
        .menu-item.active {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: #ffffff;
          box-shadow: 0 8px 20px rgba(79, 70, 229, .24);
        }

        .menu-icon {
          width: 24px;
          min-width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          font-size: 16px;
          line-height: 1;
          color: currentColor;
        }


        .main-content,
        .admin-content,
        .content-area {
          background: #f5f7fb;
        }

        .admin-header {
          background: rgba(255, 255, 255, 0.94);
          border-bottom: 1px solid #e5e7eb;
          backdrop-filter: blur(12px);
        }

        .section-heading {
          margin-bottom: 24px;
        }

        .section-heading h1,
        .section-heading h2 {
          color: #111827;
          letter-spacing: -0.02em;
        }

        .stat-card,
        .panel,
        .apps-panel,
        .analytics-panel,
        .settings-panel,
        .version-management,
        .versions-panel {
          background: #ffffff;
          border: 1px solid #e7eaf0;
          border-radius: 14px;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.045);
        }

        .stat-card {
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            border-color 0.18s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
          border-color: #d9ddf0;
        }

        .apps-panel,
        .versions-panel,
        .version-management {
          overflow: hidden;
        }

        .apps-table,
        .versions-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .apps-table th,
        .versions-table th {
          background: #f8fafc;
          color: #667085;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border-bottom: 1px solid #edf0f4;
          padding: 13px 16px;
          white-space: nowrap;
        }

        .apps-table td,
        .versions-table td {
          color: #344054;
          border-bottom: 1px solid #f0f2f5;
          padding: 15px 16px;
          vertical-align: middle;
        }

        .apps-table tbody tr,
        .versions-table tbody tr {
          transition: background 0.15s ease;
        }

        .apps-table tbody tr:hover,
        .versions-table tbody tr:hover {
          background: #f8faff;
        }

        .app-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .version-button,
        .edit-button,
        .delete-button {
          border-radius: 8px;
          min-height: 36px;
          font-weight: 600;
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            background 0.15s ease;
        }

        .version-button:hover,
        .edit-button:hover,
        .delete-button:hover {
          transform: translateY(-1px);
        }

        .version-button {
          background: #eef2ff;
          color: #4338ca;
          border: 1px solid #c7d2fe;
        }

        .version-button:hover {
          background: #e0e7ff;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.12);
        }

        .edit-button {
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }

        .edit-button:hover {
          background: #dcfce7;
        }

        .delete-button {
          background: #fff1f2;
          color: #be123c;
          border: 1px solid #fecdd3;
        }

        .delete-button:hover {
          background: #ffe4e6;
        }

        .filters-panel {
          background: #ffffff;
          border: 1px solid #e7eaf0;
          border-radius: 12px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.04);
        }

        .filters-panel input,
        .filters-panel select,
        .form-panel input,
        .form-panel select,
        .form-panel textarea {
          border: 1px solid #dfe3ea;
          border-radius: 9px;
          background: #ffffff;
          color: #172033;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }

        .filters-panel input:focus,
        .filters-panel select:focus,
        .form-panel input:focus,
        .form-panel select:focus,
        .form-panel textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .primary-button {
          border: 0;
          border-radius: 9px;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.22);
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
        }

        .primary-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 9px 22px rgba(79, 70, 229, 0.28);
        }

        .status-badge {
          border-radius: 999px;
          font-weight: 700;
          font-size: 11px;
          padding: 5px 9px;
        }

        .success-message {
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          color: #166534;
          border-radius: 10px;
        }

        .error-message {
          border: 1px solid #fecdd3;
          background: #fff1f2;
          color: #be123c;
          border-radius: 10px;
        }

        .version-management {
          margin-top: 24px;
        }

        .version-management-header,
        .versions-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 20px;
          border-bottom: 1px solid #edf0f4;
        }

        .version-management-header h2,
        .versions-panel-header h2 {
          margin: 0;
          color: #172033;
          font-size: 17px;
          font-weight: 750;
        }

        .version-meta {
          color: #667085;
          font-size: 12px;
        }

        @media (max-width: 900px) {
          .sidebar {
            width: 230px;
          }

          .apps-table,
          .versions-table {
            min-width: 760px;
          }

          .apps-panel,
          .versions-panel {
            overflow-x: auto;
          }
        }

        @media (max-width: 640px) {
          .sidebar {
            width: 100%;
            max-width: 290px;
          }

          .section-heading {
            gap: 14px;
          }

          .version-management-header,
          .versions-panel-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .app-actions {
            width: 100%;
          }
        }

      `}
      </style>
    </div>
  );
}

















































