/*
# DroidZyra — Initial Schema

1. Purpose
   DroidZyra is a global Android app discovery, version history, compatibility
   and authorized-download information platform. This migration creates the
   core data model: categories, apps, versions, compatibility, changelogs and
   screenshots.

2. New Tables
   - `categories` — app categories (Social, Communication, Music, ...).
   - `apps` — catalog of Android apps with developer, package, official URL.
   - `versions` — release versions per app with min/target Android, architecture,
     file size, SHA-256, source URL + type, verification flag.
   - `compatibility` — structured compatibility records mapping an Android version
     to a specific app version with a status and notes. Drives the Compatibility
     Finder (purely database-driven).
   - `changelogs` — release notes per version.
   - `screenshots` — app screenshots with alt text and sort order.

3. Security (RLS)
   Public directory: readable by anon, authenticated. Writes restricted to
   authenticated (admin workflow). No end-user sign-in / user_id ownership.
*/

-- categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_categories" ON categories;
CREATE POLICY "read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_categories_authenticated" ON categories;
CREATE POLICY "insert_categories_authenticated" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_categories_authenticated" ON categories;
CREATE POLICY "update_categories_authenticated" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_categories_authenticated" ON categories;
CREATE POLICY "delete_categories_authenticated" ON categories FOR DELETE
  TO authenticated USING (true);

-- apps
CREATE TABLE IF NOT EXISTS apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  developer text NOT NULL,
  package_name text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  icon_url text,
  official_url text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_apps" ON apps;
CREATE POLICY "read_apps" ON apps FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_apps_authenticated" ON apps;
CREATE POLICY "insert_apps_authenticated" ON apps FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_apps_authenticated" ON apps;
CREATE POLICY "update_apps_authenticated" ON apps FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_apps_authenticated" ON apps;
CREATE POLICY "delete_apps_authenticated" ON apps FOR DELETE
  TO authenticated USING (true);

-- versions
CREATE TABLE IF NOT EXISTS versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  version_name text NOT NULL,
  version_code text NOT NULL,
  release_date date NOT NULL,
  min_android text NOT NULL,
  target_android text NOT NULL,
  architecture text NOT NULL DEFAULT 'universal',
  file_size bigint NOT NULL DEFAULT 0,
  sha256 text,
  source_url text,
  source_type text NOT NULL DEFAULT 'official',
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_versions" ON versions;
CREATE POLICY "read_versions" ON versions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_versions_authenticated" ON versions;
CREATE POLICY "insert_versions_authenticated" ON versions FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_versions_authenticated" ON versions;
CREATE POLICY "update_versions_authenticated" ON versions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_versions_authenticated" ON versions;
CREATE POLICY "delete_versions_authenticated" ON versions FOR DELETE
  TO authenticated USING (true);

-- compatibility
CREATE TABLE IF NOT EXISTS compatibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  android_version text NOT NULL,
  version_id uuid NOT NULL REFERENCES versions(id) ON DELETE CASCADE,
  status text NOT NULL,
  notes text
);

ALTER TABLE compatibility ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_compatibility" ON compatibility;
CREATE POLICY "read_compatibility" ON compatibility FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_compatibility_authenticated" ON compatibility;
CREATE POLICY "insert_compatibility_authenticated" ON compatibility FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_compatibility_authenticated" ON compatibility;
CREATE POLICY "update_compatibility_authenticated" ON compatibility FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_compatibility_authenticated" ON compatibility;
CREATE POLICY "delete_compatibility_authenticated" ON compatibility FOR DELETE
  TO authenticated USING (true);

-- changelogs
CREATE TABLE IF NOT EXISTS changelogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id uuid NOT NULL REFERENCES versions(id) ON DELETE CASCADE,
  content text NOT NULL,
  source_url text,
  published_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE changelogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_changelogs" ON changelogs;
CREATE POLICY "read_changelogs" ON changelogs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_changelogs_authenticated" ON changelogs;
CREATE POLICY "insert_changelogs_authenticated" ON changelogs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_changelogs_authenticated" ON changelogs;
CREATE POLICY "update_changelogs_authenticated" ON changelogs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_changelogs_authenticated" ON changelogs;
CREATE POLICY "delete_changelogs_authenticated" ON changelogs FOR DELETE
  TO authenticated USING (true);

-- screenshots
CREATE TABLE IF NOT EXISTS screenshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE screenshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_screenshots" ON screenshots;
CREATE POLICY "read_screenshots" ON screenshots FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_screenshots_authenticated" ON screenshots;
CREATE POLICY "insert_screenshots_authenticated" ON screenshots FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_screenshots_authenticated" ON screenshots;
CREATE POLICY "update_screenshots_authenticated" ON screenshots FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_screenshots_authenticated" ON screenshots;
CREATE POLICY "delete_screenshots_authenticated" ON screenshots FOR DELETE
  TO authenticated USING (true);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_key ON categories (slug);
CREATE UNIQUE INDEX IF NOT EXISTS apps_slug_key ON apps (slug);
CREATE INDEX IF NOT EXISTS apps_category_id_idx ON apps (category_id);
CREATE INDEX IF NOT EXISTS apps_status_idx ON apps (status);
CREATE INDEX IF NOT EXISTS versions_app_id_idx ON versions (app_id);
CREATE INDEX IF NOT EXISTS versions_app_id_release_date_idx ON versions (app_id, release_date DESC);
CREATE INDEX IF NOT EXISTS compatibility_app_id_idx ON compatibility (app_id);
CREATE INDEX IF NOT EXISTS compatibility_app_android_idx ON compatibility (app_id, android_version);
CREATE INDEX IF NOT EXISTS changelogs_version_id_idx ON changelogs (version_id);
CREATE INDEX IF NOT EXISTS screenshots_app_id_idx ON screenshots (app_id);
