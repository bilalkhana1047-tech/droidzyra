"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
};

type AppInfo = {
  id: string;
  name: string;
  slug: string;
  developer: string;
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
};

const emptyForm: VersionForm = {
  version_name: "",
  version_code: "",
  release_date: "",
  min_android: "",
  target_android: "",
  architecture: "",
  file_size: "",
  sha256: "",
  source_url: "",
};

function formatFileSize(bytes: number) {
  if (!bytes || bytes <= 0) return "—";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${
    units[unitIndex]
  }`;
}

export default function AdminVersionsPage() {
  const params = useParams();
  const router = useRouter();

  const appId = String(params?.appId || "");

  const [app, setApp] = useState<AppInfo | null>(null);
  const [versions, setVersions] = useState<VersionItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingVersionId, setEditingVersionId] = useState<string | null>(
    null
  );

  const [form, setForm] = useState<VersionForm>({
    ...emptyForm,
  });

  async function loadData() {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      setLoading(false);
      return;
    }

    if (!appId) {
      setErrorMessage("Application ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const [appResult, versionsResult] = await Promise.all([
        supabase
          .from("apps")
          .select("id, name, slug, developer")
          .eq("id", appId)
          .single(),

        supabase
          .from("versions")
          .select(
            "id, app_id, version_name, version_code, release_date, min_android, target_android, architecture, file_size, sha256, source_url"
          )
          .eq("app_id", appId)
          .order("release_date", { ascending: false }),
      ]);

      if (appResult.error) {
        console.error("App loading error:", appResult.error);
        setErrorMessage(appResult.error.message);
        setApp(null);
      } else {
        setApp(appResult.data as AppInfo);
      }

      if (versionsResult.error) {
        console.error("Versions loading error:", versionsResult.error);
        setErrorMessage(versionsResult.error.message);
        setVersions([]);
      } else {
        setVersions((versionsResult.data ?? []) as VersionItem[]);
      }
    } catch (error) {
      console.error("Version management loading error:", error);
      setErrorMessage("Unable to load version data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [appId]);

  function resetForm() {
    setForm({
      ...emptyForm,
    });

    setEditingVersionId(null);
  }

  function startAddVersion() {
    resetForm();
    setErrorMessage("");
    setSuccessMessage("");
    setShowForm(true);
  }

  function startEditVersion(version: VersionItem) {
    setEditingVersionId(version.id);

    setErrorMessage("");
    setSuccessMessage("");

    setForm({
      version_name: version.version_name || "",
      version_code: version.version_code || "",
      release_date: version.release_date || "",
      min_android: version.min_android || "",
      target_android: version.target_android || "",
      architecture: version.architecture || "",
      file_size:
        version.file_size !== null && version.file_size !== undefined
          ? String(version.file_size)
          : "",
      sha256: version.sha256 || "",
      source_url: version.source_url || "",
    });

    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    resetForm();
    setErrorMessage("");
  }

  async function saveVersion() {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }

    if (!appId) {
      setErrorMessage("Application ID is missing.");
      return;
    }

    if (
      !form.version_name.trim() ||
      !form.version_code.trim() ||
      !form.release_date ||
      !form.min_android.trim() ||
      !form.target_android.trim() ||
      !form.architecture.trim() ||
      !form.file_size.trim()
    ) {
      setErrorMessage(
        "Please fill all required fields before saving the version."
      );
      return;
    }

    const fileSize = Number(form.file_size);

    if (!Number.isFinite(fileSize) || fileSize < 0) {
      setErrorMessage("File size must be a valid number in bytes.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const versionData = {
        app_id: appId,
        version_name: form.version_name.trim(),
        version_code: form.version_code.trim(),
        release_date: form.release_date,
        min_android: form.min_android.trim(),
        target_android: form.target_android.trim(),
        architecture: form.architecture.trim(),
        file_size: Math.round(fileSize),
        sha256: form.sha256.trim() || null,
        source_url: form.source_url.trim() || null,
      };

      if (editingVersionId) {
        const { error } = await supabase
          .from("versions")
          .update(versionData)
          .eq("id", editingVersionId)
          .eq("app_id", appId);

        if (error) {
          console.error("Update version error:", error);
          setErrorMessage(error.message);
          return;
        }

        setSuccessMessage("Version updated successfully.");
      } else {
        const { error } = await supabase
          .from("versions")
          .insert(versionData);

        if (error) {
          console.error("Create version error:", error);
          setErrorMessage(error.message);
          return;
        }

        setSuccessMessage("Version added successfully.");
      }

      setShowForm(false);
      resetForm();

      await loadData();
    } catch (error) {
      console.error("Save version error:", error);
      setErrorMessage("Unable to save version.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteVersion(version: VersionItem) {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete version "${version.version_name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error } = await supabase
        .from("versions")
        .delete()
        .eq("id", version.id)
        .eq("app_id", appId);

      if (error) {
        console.error("Delete version error:", error);
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage("Version deleted successfully.");

      if (editingVersionId === version.id) {
        cancelForm();
      }

      await loadData();
    } catch (error) {
      console.error("Delete version error:", error);
      setErrorMessage("Unable to delete version.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="versions-page">
      <header className="topbar">
        <div>
          <button
            className="back-button"
            onClick={() => router.push("/admin")}
          >
            ← Back to Apps
          </button>

          <h1>Version Management</h1>

          <p>
            {app
              ? `${app.name} by ${app.developer}`
              : "Manage application versions"}
          </p>
        </div>

        <div className="topbar-actions">
          <button
            className="secondary-button"
            onClick={loadData}
            disabled={loading || saving}
          >
            ↻ Refresh
          </button>

          <button
            className="primary-button"
            onClick={startAddVersion}
            disabled={loading || saving}
          >
            + Add Version
          </button>
        </div>
      </header>

      <main className="content">
        {errorMessage && (
          <div className="message error-message">
            <strong>Error</strong>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="message success-message">
            <strong>Success</strong>
            <span>{successMessage}</span>
          </div>
        )}

        {showForm && (
          <section className="panel form-panel">
            <div className="panel-header">
              <div>
                <h2>
                  {editingVersionId
                    ? "Edit Version"
                    : "Add New Version"}
                </h2>

                <p>
                  {editingVersionId
                    ? "Update the selected version details."
                    : "Add a new version to this application."}
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>
                  Version Name <span>*</span>
                </label>

                <input
                  value={form.version_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      version_name: e.target.value,
                    })
                  }
                  placeholder="1.2.5"
                />
              </div>

              <div className="form-field">
                <label>
                  Version Code <span>*</span>
                </label>

                <input
                  value={form.version_code}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      version_code: e.target.value,
                    })
                  }
                  placeholder="125"
                />
              </div>

              <div className="form-field">
                <label>
                  Release Date <span>*</span>
                </label>

                <input
                  type="date"
                  value={form.release_date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      release_date: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-field">
                <label>
                  Minimum Android <span>*</span>
                </label>

                <input
                  value={form.min_android}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      min_android: e.target.value,
                    })
                  }
                  placeholder="Android 8.0"
                />
              </div>

              <div className="form-field">
                <label>
                  Target Android <span>*</span>
                </label>

                <input
                  value={form.target_android}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      target_android: e.target.value,
                    })
                  }
                  placeholder="Android 15"
                />
              </div>

              <div className="form-field">
                <label>
                  Architecture <span>*</span>
                </label>

                <input
                  value={form.architecture}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      architecture: e.target.value,
                    })
                  }
                  placeholder="arm64-v8a"
                />
              </div>

              <div className="form-field">
                <label>
                  File Size (bytes) <span>*</span>
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.file_size}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      file_size: e.target.value,
                    })
                  }
                  placeholder="85000000"
                />

                <small>
                  Enter the APK size in bytes.
                </small>
              </div>

              <div className="form-field">
                <label>SHA-256</label>

                <input
                  value={form.sha256}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sha256: e.target.value,
                    })
                  }
                  placeholder="SHA-256 checksum"
                />
              </div>

              <div className="form-field full-width">
                <label>APK / Download URL</label>

                <input
                  type="url"
                  value={form.source_url}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      source_url: e.target.value,
                    })
                  }
                  placeholder="https://example.com/app.apk"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                className="secondary-button"
                onClick={cancelForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={saveVersion}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingVersionId
                    ? "Update Version"
                    : "Save Version"}
              </button>
            </div>
          </section>
        )}

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Versions</h2>
              <p>
                {versions.length} version
                {versions.length !== 1 ? "s" : ""} stored for this
                application.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="loading-box">
              Loading versions...
            </div>
          ) : versions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">↗</div>
              <strong>No versions found</strong>
              <span>
                Add the first version for this application.
              </span>

              <button
                className="primary-button"
                onClick={startAddVersion}
              >
                + Add Version
              </button>
            </div>
          ) : (
            <div className="versions-table-wrapper">
              <div className="versions-table">
                <div className="table-header">
                  <span>VERSION</span>
                  <span>RELEASE DATE</span>
                  <span>ANDROID</span>
                  <span>ARCHITECTURE</span>
                  <span>SIZE</span>
                  <span>ACTIONS</span>
                </div>

                {versions.map((version) => (
                  <div className="table-row" key={version.id}>
                    <div className="version-info">
                      <strong>{version.version_name}</strong>
                      <small>Code: {version.version_code}</small>
                    </div>

                    <span>
                      {version.release_date
                        ? new Date(
                            `${version.release_date}T00:00:00`
                          ).toLocaleDateString()
                        : "—"}
                    </span>

                    <span>
                      <small>
                        Min: {version.min_android}
                      </small>
                      <small>
                        Target: {version.target_android}
                      </small>
                    </span>

                    <span>{version.architecture}</span>

                    <span>{formatFileSize(version.file_size)}</span>

                    <div className="actions">
                      {version.source_url && (
                        <a
                          href={version.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="download-button"
                        >
                          ↗ APK
                        </a>
                      )}

                      <button
                        className="edit-button"
                        onClick={() => startEditVersion(version)}
                        disabled={saving}
                      >
                        ✎ Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => deleteVersion(version)}
                        disabled={saving}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .versions-page {
          min-height: 100vh;
          background: #f6f7fb;
          color: #172033;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .topbar {
          min-height: 100px;
          padding: 24px 32px;
          background: #ffffff;
          border-bottom: 1px solid #e8eaf0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .topbar h1 {
          margin: 10px 0 4px;
          font-size: 26px;
          line-height: 1.2;
        }

        .topbar p {
          margin: 0;
          color: #8a92a3;
          font-size: 13px;
        }

        .back-button {
          border: 0;
          background: transparent;
          color: #4f46e5;
          padding: 0;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .content {
          padding: 30px 32px 50px;
          max-width: 1500px;
          margin: 0 auto;
        }

        .panel {
          background: #ffffff;
          border: 1px solid #e8eaf0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(24, 32, 52, 0.04);
        }

        .form-panel {
          margin-bottom: 24px;
          padding: 24px;
        }

        .panel-header {
          padding: 22px 24px;
          border-bottom: 1px solid #f0f1f5;
        }

        .form-panel .panel-header {
          padding: 0 0 20px;
          margin-bottom: 20px;
        }

        .panel-header h2 {
          margin: 0;
          font-size: 18px;
        }

        .panel-header p {
          margin: 5px 0 0;
          color: #8b93a4;
          font-size: 12px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-field.full-width {
          grid-column: 1 / -1;
        }

        .form-field label {
          color: #3f4758;
          font-size: 11px;
          font-weight: 800;
        }

        .form-field label span {
          color: #dc2626;
        }

        .form-field input {
          width: 100%;
          border: 1px solid #dfe2e9;
          border-radius: 8px;
          padding: 11px 12px;
          outline: none;
          font-size: 12px;
          color: #20283a;
          background: #ffffff;
        }

        .form-field input:focus {
          border-color: #818cf8;
          box-shadow: 0 0 0 3px #eef2ff;
        }

        .form-field small {
          color: #969dab;
          font-size: 10px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 22px;
          padding-top: 20px;
          border-top: 1px solid #f0f1f5;
        }

        .primary-button,
        .secondary-button,
        .edit-button,
        .delete-button,
        .download-button {
          border: 0;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          transition: 0.2s ease;
        }

        .primary-button {
          background: #4f46e5;
          color: #ffffff;
        }

        .primary-button:hover {
          background: #4338ca;
        }

        .secondary-button {
          background: #f1f3f7;
          color: #4a5365;
        }

        .secondary-button:hover {
          background: #e7eaf0;
        }

        .edit-button {
          background: #eef2ff;
          color: #4f46e5;
        }

        .edit-button:hover {
          background: #e0e7ff;
        }

        .delete-button {
          background: #fff0f0;
          color: #dc2626;
        }

        .delete-button:hover {
          background: #fee2e2;
        }

        .download-button {
          background: #ecfdf5;
          color: #059669;
        }

        .download-button:hover {
          background: #d1fae5;
        }

        .primary-button:disabled,
        .secondary-button:disabled,
        .edit-button:disabled,
        .delete-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .message {
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin-bottom: 20px;
          padding: 13px 15px;
          border-radius: 9px;
          font-size: 12px;
        }

        .message strong {
          font-size: 11px;
        }

        .error-message {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #be123c;
        }

        .success-message {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #047857;
        }

        .loading-box {
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8d95a5;
          font-size: 13px;
        }

        .empty-state {
          min-height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 8px;
          color: #8d95a5;
          text-align: center;
          padding: 30px;
        }

        .empty-state strong {
          color: #424b5d;
          font-size: 14px;
        }

        .empty-state span {
          font-size: 12px;
          margin-bottom: 8px;
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 5px;
        }

        .versions-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .versions-table {
          min-width: 950px;
        }

        .table-header,
        .table-row {
          display: grid;
          grid-template-columns:
            minmax(140px, 1.3fr)
            minmax(110px, 1fr)
            minmax(130px, 1.2fr)
            minmax(110px, 1fr)
            minmax(80px, 0.7fr)
            minmax(270px, 2fr);
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
        }

        .table-header {
          background: #fafbfc;
          color: #9aa1af;
          font-size: 9px;
          font-weight: 800;
        }

        .table-row {
          border-top: 1px solid #f0f1f5;
          color: #626b7d;
          font-size: 11px;
          min-height: 76px;
        }

        .version-info strong,
        .version-info small {
          display: block;
        }

        .version-info strong {
          color: #333c4f;
          font-size: 12px;
        }

        .version-info small {
          margin-top: 4px;
          color: #9aa1af;
          font-size: 10px;
        }

        .table-row > span {
          min-width: 0;
        }

        .table-row > span small {
          display: block;
          margin: 2px 0;
          color: #727b8d;
        }

        .actions {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          gap: 6px;
        }

        @media (max-width: 850px) {
          .topbar {
            padding: 20px;
            align-items: flex-start;
            flex-direction: column;
          }

          .topbar-actions {
            width: 100%;
          }

          .topbar-actions button {
            flex: 1;
          }

          .content {
            padding: 20px 15px 40px;
          }

          .form-panel {
            padding: 18px;
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
        }
      `}</style>
    </div>
  );
}

