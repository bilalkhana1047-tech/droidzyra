"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type App = {
  id: string;
  name: string;
  developer?: string | null;
  package_name?: string | null;
  icon_url?: string | null;
};

type CompatibilityRecord = {
  id: string;
  android_version: string;
  status: string;
  notes?: string | null;
  version?: {
    id: string;
    version_name: string;
    version_code?: string | null;
    min_android?: string | null;
    target_android?: string | null;
    release_date?: string | null;
    file_size?: string | null;
    architecture?: string | null;
  } | null;
};

const androidVersions = [
  "16",
  "15",
  "14",
  "13",
  "12",
  "11",
  "10",
  "9",
  "8",
  "7",
  "6",
];

export default function CompatibilityPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [androidVersion, setAndroidVersion] = useState("15");
  const [search, setSearch] = useState("");

  const [result, setResult] = useState<CompatibilityRecord | null>(null);
  const [loadingApps, setLoadingApps] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApps() {
      setLoadingApps(true);
      setError("");

      if (!supabase) {
        setError("Database is not configured yet.");
        setLoadingApps(false);
        return;
      }

      const { data, error } = await supabase
        .from("apps")
        .select("id, name, developer, package_name, icon_url")
        .eq("status", "active")
        .order("name");

      if (error) {
        console.error(error);
        setError("Unable to load apps. Please try again.");
      } else {
        setApps((data as App[]) || []);
      }

      setLoadingApps(false);
    }

    loadApps();
  }, []);

  const filteredApps = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return apps;

    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(value) ||
        app.developer?.toLowerCase().includes(value) ||
        app.package_name?.toLowerCase().includes(value)
    );
  }, [apps, search]);

  async function checkCompatibility() {
    if (!selectedApp) {
      setError("Please select an app first.");
      setResult(null);
      return;
    }

    setChecking(true);
    setError("");
    setResult(null);

    if (!supabase) {
      setError("Database is not configured yet.");
      setChecking(false);
      return;
    }

    try {
      // 1. First prefer a manually verified compatibility record.
      const { data: manualRecord, error: manualError } = await supabase
        .from("compatibility")
        .select(
          `
          *,
          version:versions(
            id,
            version_name,
            version_code,
            min_android,
            target_android,
            release_date,
            file_size,
            architecture
          )
        `
        )
        .eq("app_id", selectedApp)
        .eq("android_version", androidVersion)
        .maybeSingle();

      if (manualError) {
        console.error("Manual compatibility lookup failed:", manualError);
      }

      if (manualRecord) {
        setResult(manualRecord as CompatibilityRecord);
        setChecking(false);
        return;
      }

      // 2. No manual record: load all available versions for this app.
      const { data: versions, error: versionsError } = await supabase
        .from("versions")
        .select(
          `
          id,
          version_name,
          version_code,
          min_android,
          target_android,
          release_date,
          file_size,
          architecture
        `
        )
        .eq("app_id", selectedApp)
        .order("release_date", { ascending: false });

      if (versionsError) {
        console.error(versionsError);
        setError("Unable to check compatibility right now.");
        setChecking(false);
        return;
      }

      if (!versions || versions.length === 0) {
        setError(
          "No version information is available for this app yet."
        );
        setChecking(false);
        return;
      }

      const selectedAndroid = Number.parseFloat(androidVersion);

      const parseAndroid = (value?: string | null) => {
        if (!value) return null;

        const match = String(value).match(/\d+(?:\.\d+)?/);
        if (!match) return null;

        const parsed = Number.parseFloat(match[0]);
        return Number.isFinite(parsed) ? parsed : null;
      };

      // A version is installable when the selected Android version
      // is equal to or newer than that version's minimum Android.
      const compatibleVersions = versions.filter((version) => {
        const minAndroid = parseAndroid(version.min_android);

        if (minAndroid === null) {
          return false;
        }

        return selectedAndroid >= minAndroid;
      });

      if (compatibleVersions.length > 0) {
        // versions are already sorted newest first
        const recommended = compatibleVersions[0];

        const minAndroid = parseAndroid(recommended.min_android);
        const targetAndroid = parseAndroid(recommended.target_android);

        let notes =
          `Version ${recommended.version_name} is the newest available version in our database whose minimum Android requirement is satisfied by Android ${androidVersion}.`;

        if (
          targetAndroid !== null &&
          selectedAndroid > targetAndroid
        ) {
          notes +=
            ` This version targets Android ${recommended.target_android}, which is older than your Android ${androidVersion}. It should meet the recorded minimum requirement, but some behavior may depend on the app developer and device.`;
        } else if (
          minAndroid !== null &&
          selectedAndroid === minAndroid
        ) {
          notes +=
            ` Your device meets the minimum Android requirement exactly.`;
        }

        const generatedResult: CompatibilityRecord = {
          id: `auto-${selectedApp}-${androidVersion}`,
          android_version: androidVersion,
          status: "compatible",
          notes,
          version: recommended,
        };

        setResult(generatedResult);
        setChecking(false);
        return;
      }

      // 3. Versions exist, but none support this old Android version.
      const versionsWithMinimum = versions
        .map((version) => ({
          version,
          min: parseAndroid(version.min_android),
        }))
        .filter(
          (
            item
          ): item is {
            version: (typeof versions)[number];
            min: number;
          } => item.min !== null
        )
        .sort((a, b) => a.min - b.min);

      if (versionsWithMinimum.length > 0) {
        const closest = versionsWithMinimum[0];

        const generatedResult: CompatibilityRecord = {
          id: `auto-${selectedApp}-${androidVersion}`,
          android_version: androidVersion,
          status: "incompatible",
          notes:
            `The available versions in our database require a newer Android version. ` +
            `The lowest recorded requirement is Android ${closest.version.min_android} ` +
            `for version ${closest.version.version_name}.`,
          version: closest.version,
        };

        setResult(generatedResult);
        setChecking(false);
        return;
      }

      // 4. Versions exist but minimum Android data is missing.
      setError(
        "Version data exists for this app, but minimum Android requirements have not been added yet."
      );
    } catch (err) {
      console.error(err);
      setError("Unable to check compatibility right now.");
    } finally {
      setChecking(false);
    }
  }
  const selectedAppData = apps.find((app) => app.id === selectedApp);

  const status = result?.status?.toLowerCase() || "";

  const isCompatible =
    status === "compatible" ||
    status === "fully compatible" ||
    status === "supported";

  const isWarning =
    status === "partial" ||
    status === "partially compatible" ||
    status === "warning";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            Android Compatibility Checker
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Compatibility Finder
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Check whether an app is compatible with your Android version and
            find the recommended version.
          </p>
        </div>

        {/* Checker Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* App */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Select App
              </label>

              <input
                type="text"
                placeholder="Search app..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />

              <select
                value={selectedApp}
                onChange={(e) => {
                  setSelectedApp(e.target.value);
                  setResult(null);
                  setError("");
                }}
                disabled={loadingApps}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="">
                  {loadingApps ? "Loading apps..." : "Choose an app"}
                </option>

                {filteredApps.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name}
                    {app.developer ? ` — ${app.developer}` : ""}
                  </option>
                ))}
              </select>

              {!loadingApps && apps.length === 0 && !error && (
                <p className="mt-2 text-sm text-slate-500">
                  No active apps found.
                </p>
              )}
            </div>

            {/* Android */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Android Version
              </label>

              <select
                value={androidVersion}
                onChange={(e) => {
                  setAndroidVersion(e.target.value);
                  setResult(null);
                  setError("");
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                {androidVersions.map((version) => (
                  <option key={version} value={version}>
                    Android {version}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-slate-500">
                Select the Android version installed on your device.
              </p>
            </div>
          </div>

          {/* Selected App */}
          {selectedAppData && (
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="font-semibold">{selectedAppData.name}</p>

              {selectedAppData.developer && (
                <p className="mt-1 text-sm text-slate-400">
                  {selectedAppData.developer}
                </p>
              )}

              {selectedAppData.package_name && (
                <p className="mt-1 text-xs text-slate-500">
                  {selectedAppData.package_name}
                </p>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            onClick={checkCompatibility}
            disabled={checking || !selectedApp}
            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checking ? "Checking compatibility..." : "Check Compatibility"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div
              className={`border-b px-6 py-5 ${
                isCompatible
                  ? "border-emerald-500/20 bg-emerald-500/10"
                  : isWarning
                    ? "border-yellow-500/20 bg-yellow-500/10"
                    : "border-red-500/20 bg-red-500/10"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Compatibility Result</p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {isCompatible
                      ? "✓ Compatible"
                      : isWarning
                        ? "⚠ Partially Compatible"
                        : "✕ Not Compatible"}
                  </h2>
                </div>

                <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium capitalize">
                  {result.status}
                </span>
              </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Android"
                value={`Android ${result.android_version}`}
              />

              <InfoItem
                label="Recommended Version"
                value={result.version?.version_name || "Not available"}
              />

              <InfoItem
                label="Version Code"
                value={result.version?.version_code || "—"}
              />

              <InfoItem
                label="Minimum Android"
                value={
                  result.version?.min_android
                    ? `Android ${result.version.min_android}`
                    : "—"
                }
              />

              <InfoItem
                label="Target Android"
                value={
                  result.version?.target_android
                    ? `Android ${result.version.target_android}`
                    : "—"
                }
              />

              <InfoItem
                label="Architecture"
                value={result.version?.architecture || "—"}
              />
            </div>

            {result.notes && (
              <div className="border-t border-slate-800 px-6 py-5">
                <p className="mb-2 text-sm font-medium text-slate-300">
                  Additional Information
                </p>

                <p className="text-sm leading-6 text-slate-400">
                  {result.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words font-medium text-white">{value}</p>
    </div>
  );
}
