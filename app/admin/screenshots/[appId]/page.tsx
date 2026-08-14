"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import type { Screenshot } from "@/lib/types";

type AppInfo = {
  id: string;
  name: string;
  slug: string;
};

type ScreenshotForm = {
  image_url: string;
  alt_text: string;
  sort_order: string;
};

const emptyForm: ScreenshotForm = {
  image_url: "",
  alt_text: "",
  sort_order: "0",
};

export default function AdminScreenshotsPage({
  params,
}: {
  params: { appId: string };
}) {
  const [app, setApp] = useState<AppInfo | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [form, setForm] = useState<ScreenshotForm>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const nextOrder = useMemo(() => {
    if (screenshots.length === 0) return 0;

    return (
      Math.max(
        ...screenshots.map((item) => Number(item.sort_order) || 0)
      ) + 1
    );
  }, [screenshots]);

  async function loadData() {
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [appResult, screenshotsResult] = await Promise.all([
        supabase
          .from("apps")
          .select("id, name, slug")
          .eq("id", params.appId)
          .maybeSingle(),

        supabase
          .from("screenshots")
          .select("id, app_id, image_url, alt_text, sort_order")
          .eq("app_id", params.appId)
          .order("sort_order", { ascending: true }),
      ]);

      if (appResult.error) {
        throw appResult.error;
      }

      if (!appResult.data) {
        setError("Application not found.");
        setApp(null);
        return;
      }

      if (screenshotsResult.error) {
        throw screenshotsResult.error;
      }

      setApp(appResult.data as AppInfo);
      setScreenshots(
        (screenshotsResult.data as Screenshot[]) ?? []
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load screenshots."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [params.appId]);

  function startAdd() {
    setEditingId(null);

    setForm({
      image_url: "",
      alt_text: "",
      sort_order: String(nextOrder),
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function startEdit(item: Screenshot) {
    setEditingId(item.id);

    setForm({
      image_url: item.image_url,
      alt_text: item.alt_text ?? "",
      sort_order: String(item.sort_order ?? 0),
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function cancelForm() {
    setEditingId(null);
    setShowForm(false);
    setForm(emptyForm);
    setError("");
  }
  async function saveScreenshot(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!supabase || !app) return;

    const imageUrl = form.image_url.trim();

    if (!imageUrl) {
      setError("Screenshot URL is required.");
      return;
    }

    try {
      new URL(imageUrl);
    } catch {
      setError("Please enter a valid screenshot URL.");
      return;
    }

    const sortOrder = Number(form.sort_order);

    if (!Number.isFinite(sortOrder) || sortOrder < 0) {
      setError("Sort order must be 0 or greater.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const values = {
      app_id: app.id,
      image_url: imageUrl,
      alt_text: form.alt_text.trim() || null,
      sort_order: Math.floor(sortOrder),
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("screenshots")
          .update(values)
          .eq("id", editingId)
          .eq("app_id", app.id);

        if (error) throw error;

        setSuccess("Screenshot updated successfully.");
      } else {
        const { error } = await supabase
          .from("screenshots")
          .insert(values);

        if (error) throw error;

        setSuccess("Screenshot added successfully.");
      }

      setEditingId(null);
      setShowForm(false);
      setForm(emptyForm);

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save screenshot."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteScreenshot(item: Screenshot) {
    if (!supabase || !app) return;

    const confirmed = window.confirm(
      "Delete this screenshot?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const { error } = await supabase
        .from("screenshots")
        .delete()
        .eq("id", item.id)
        .eq("app_id", app.id);

      if (error) throw error;

      setSuccess("Screenshot deleted.");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete screenshot."
      );
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f8fc",
        padding: "32px 20px 60px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/admin"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            marginBottom: "24px",
            color: "#667085",
            fontSize: "13px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} />
          Back to Admin
        </Link>

        <section
          style={{
            background: "#fff",
            border: "1px solid #eaecf0",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(15,23,42,.05)",
          }}
        >
          <div
            style={{
              padding: "24px",
              borderBottom: "1px solid #eaecf0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                }}
              >
                <ImageIcon size={21} color="#4f46e5" />

                <h1
                  style={{
                    margin: 0,
                    fontSize: "22px",
                    color: "#101828",
                  }}
                >
                  Screenshot Manager
                </h1>
              </div>

              <p
                style={{
                  margin: "7px 0 0",
                  color: "#667085",
                  fontSize: "13px",
                }}
              >
                {app
                  ? `Manage screenshots for ${app.name}.`
                  : "Manage application screenshots."}
              </p>
            </div>

            <button
              type="button"
              onClick={startAdd}
              disabled={loading || !app}
              style={{
                height: "40px",
                padding: "0 16px",
                border: 0,
                borderRadius: "10px",
                background: "#4f46e5",
                color: "#fff",
                fontWeight: 750,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Plus size={16} />
              Add Screenshot
            </button>
          </div>

          {error && (
            <div
              style={{
                margin: "20px 24px 0",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#be123c",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                margin: "20px 24px 0",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#ecfdf3",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                fontSize: "13px",
              }}
            >
              {success}
            </div>
          )}

          {showForm && (
            <form
              onSubmit={saveScreenshot}
              style={{
                margin: "24px",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid #e0e7ff",
                background: "#fafaff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "18px",
                }}
              >
                <strong style={{ color: "#101828" }}>
                  {editingId ? "Edit Screenshot" : "Add Screenshot"}
                </strong>

                <button
                  type="button"
                  onClick={cancelForm}
                  style={{
                    border: 0,
                    background: "transparent",
                    cursor: "pointer",
                    color: "#667085",
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(0, 2fr) minmax(160px, 1fr)",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "7px",
                      fontSize: "12px",
                      fontWeight: 750,
                      color: "#344054",
                    }}
                  >
                    Image URL *
                  </label>

                  <input
                    value={form.image_url}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        image_url: e.target.value,
                      })
                    }
                    placeholder="https://example.com/screenshot-1.jpg"
                    style={{
                      width: "100%",
                      height: "42px",
                      borderRadius: "9px",
                      border: "1px solid #d0d5dd",
                      padding: "0 12px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "7px",
                      fontSize: "12px",
                      fontWeight: 750,
                      color: "#344054",
                    }}
                  >
                    Sort Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sort_order: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      height: "42px",
                      borderRadius: "9px",
                      border: "1px solid #d0d5dd",
                      padding: "0 12px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "12px",
                    fontWeight: 750,
                    color: "#344054",
                  }}
                >
                  Alt Text
                </label>

                <input
                  value={form.alt_text}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      alt_text: e.target.value,
                    })
                  }
                  placeholder={
                    app
                      ? `${app.name} Android app screenshot`
                      : "Android app screenshot"
                  }
                  style={{
                    width: "100%",
                    height: "42px",
                    borderRadius: "9px",
                    border: "1px solid #d0d5dd",
                    padding: "0 12px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {form.image_url.trim() && (
                <div style={{ marginTop: "18px" }}>
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: "12px",
                      fontWeight: 750,
                      color: "#344054",
                    }}
                  >
                    Preview
                  </p>

                  <img
                    src={form.image_url}
                    alt="Screenshot preview"
                    style={{
                      width: "150px",
                      height: "260px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      border: "1px solid #eaecf0",
                      background: "#f2f4f7",
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    height: "40px",
                    padding: "0 16px",
                    borderRadius: "9px",
                    border: 0,
                    background: "#4f46e5",
                    color: "#fff",
                    fontWeight: 750,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                  }}
                >
                  <Save size={15} />
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Screenshot"
                      : "Save Screenshot"}
                </button>

                <button
                  type="button"
                  onClick={cancelForm}
                  style={{
                    height: "40px",
                    padding: "0 16px",
                    borderRadius: "9px",
                    border: "1px solid #d0d5dd",
                    background: "#fff",
                    color: "#475467",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div style={{ padding: "24px" }}>
            {loading ? (
              <p style={{ color: "#667085" }}>
                Loading screenshots...
              </p>
            ) : screenshots.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "50px 20px",
                  border: "1px dashed #d0d5dd",
                  borderRadius: "16px",
                }}
              >
                <ImageIcon size={30} color="#98a2b3" />

                <h3
                  style={{
                    margin: "12px 0 5px",
                    color: "#344054",
                  }}
                >
                  No screenshots yet
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#98a2b3",
                    fontSize: "13px",
                  }}
                >
                  Add as many screenshots as you need.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(210px, 1fr))",
                  gap: "18px",
                }}
              >
                {screenshots.map((item) => (
                  <article
                    key={item.id}
                    style={{
                      border: "1px solid #eaecf0",
                      borderRadius: "16px",
                      overflow: "hidden",
                      background: "#fff",
                    }}
                  >
                    <div
                      style={{
                        height: "290px",
                        background: "#f2f4f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={item.image_url}
                        alt={
                          item.alt_text ??
                          `${app?.name ?? "App"} screenshot`
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    <div style={{ padding: "14px" }}>
                      <p
                        style={{
                          margin: 0,
                          color: "#344054",
                          fontSize: "12px",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.alt_text || "No alt text"}
                      </p>

                      <small
                        style={{
                          display: "block",
                          marginTop: "6px",
                          color: "#98a2b3",
                        }}
                      >
                        Order: {item.sort_order}
                      </small>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginTop: "14px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          style={{
                            flex: 1,
                            height: "34px",
                            borderRadius: "8px",
                            border: "1px solid #c7d2fe",
                            background: "#eef2ff",
                            color: "#4f46e5",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                          }}
                        >
                          <Pencil size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteScreenshot(item)}
                          style={{
                            flex: 1,
                            height: "34px",
                            borderRadius: "8px",
                            border: "1px solid #fecdd3",
                            background: "#fff1f2",
                            color: "#dc2626",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                          }}
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}