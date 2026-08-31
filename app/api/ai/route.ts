import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";


type AppRow = {
  id: string;
  name: string;
  developer: string | null;
  package_name: string | null;
  description: string | null;
  status: string;
};

type VersionRow = {
  id: string;
  app_id: string;
  version_name: string;
  version_code: string | null;
  release_date: string | null;
  min_android: string | null;
  target_android: string | null;
  architecture: string | null;
  file_size: number | null;
  sha256: string | null;
  source_url: string | null;
};

type CompatibilityRow = {
  app_id: string;
  android_version: string;
  version_id: string;
  status: string;
  notes: string | null;
};

function extractAndroidVersion(text: string): string | null {
  const match = text.match(
    /android\s*(?:version\s*)?(\d+(?:\.\d+)?)/i
  );

  return match?.[1] ?? null;
}

function extractRam(text: string): number | null {
  const match = text.match(
    /(\d+(?:\.\d+)?)\s*(?:gb|g)\s*(?:ram|memory)/i
  );

  return match ? Number(match[1]) : null;
}

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "Gemini API key is not configured.",
        },
        { status: 500 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        {
          error: "Supabase is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const message =
      typeof body?.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          error: "Please enter a question.",
        },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        {
          error: "Question is too long.",
        },
        { status: 400 }
      );
    }

    /*
     * RATE LIMIT
     * Maximum 10 AI requests per IP every 10 minutes.
     */

    if (!supabaseAdmin) {
      console.error("DroidZyra AI rate limiter is not configured.");

      return NextResponse.json(
        {
          error: "DroidZyra AI is temporarily unavailable.",
        },
        { status: 500 }
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");

    const clientIp =
      request.headers.get("x-nf-client-connection-ip")?.trim() ||
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      "unknown";

    const windowStart = new Date(
      Date.now() - 10 * 60 * 1000
    ).toISOString();

    const { count: recentRequestCount, error: rateCountError } =
      await supabaseAdmin
        .from("ai_rate_limits")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("ip_address", clientIp)
        .gte("created_at", windowStart);

    if (rateCountError) {
      console.error(
        "DroidZyra AI rate limit count error:",
        rateCountError
      );

      return NextResponse.json(
        {
          error: "DroidZyra AI is temporarily unavailable.",
        },
        { status: 500 }
      );
    }

    if ((recentRequestCount ?? 0) >= 10) {
      return NextResponse.json(
        {
          error:
            "You have reached the DroidZyra AI request limit. Please try again in a few minutes.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "600",
          },
        }
      );
    }

    const { error: rateInsertError } = await supabaseAdmin
      .from("ai_rate_limits")
      .insert({
        ip_address: clientIp,
      });

    if (rateInsertError) {
      console.error(
        "DroidZyra AI rate limit insert error:",
        rateInsertError
      );

      return NextResponse.json(
        {
          error: "DroidZyra AI is temporarily unavailable.",
        },
        { status: 500 }
      );
    }
    const androidVersion = extractAndroidVersion(message);
    const ramGb = extractRam(message);

    /*
     * STEP 1
     * Load active DroidZyra apps.
     */

    const { data: apps, error: appsError } = await supabase
      .from("apps")
      .select(
        "id, name, developer, package_name, description, status"
      )
      .eq("status", "active")
      .order("updated_at", {
        ascending: false,
      })
      .limit(50);

    if (appsError) {
      console.error(
        "DroidZyra AI apps query error:",
        appsError
      );

      return NextResponse.json(
        {
          error: "Unable to read DroidZyra app data.",
        },
        { status: 500 }
      );
    }

    const appRows = (apps ?? []) as AppRow[];

    if (appRows.length === 0) {
      return NextResponse.json({
        answer:
          "DroidZyra does not have enough app data yet to make a factual recommendation.",
        sources: [],
      });
    }

    const appIds = appRows.map((app) => app.id);

    /*
     * STEP 2
     * Load versions and compatibility records.
     *
     * IMPORTANT:
     * Do not request a 'verified' column because it does not exist
     * in the current DroidZyra versions table.
     */

    const [versionsResult, compatibilityResult] =
      await Promise.all([
        supabase
          .from("versions")
          .select(
            `
            id,
            app_id,
            version_name,
            version_code,
            release_date,
            min_android,
            target_android,
            architecture,
            file_size,
            sha256,
            source_url
            `
          )
          .in("app_id", appIds)
          .order("release_date", {
            ascending: false,
          })
          .limit(200),

        supabase
          .from("compatibility")
          .select(
            `
            app_id,
            android_version,
            version_id,
            status,
            notes
            `
          )
          .in("app_id", appIds)
          .limit(200),
      ]);

    if (versionsResult.error) {
      console.error(
        "DroidZyra AI versions query error:",
        versionsResult.error
      );

      return NextResponse.json(
        {
          error: "Unable to read DroidZyra version data.",
        },
        { status: 500 }
      );
    }

    if (compatibilityResult.error) {
      console.error(
        "DroidZyra AI compatibility query error:",
        compatibilityResult.error
      );

      return NextResponse.json(
        {
          error:
            "Unable to read DroidZyra compatibility data.",
        },
        { status: 500 }
      );
    }

    const versions =
      (versionsResult.data ?? []) as VersionRow[];

    const compatibility =
      (compatibilityResult.data ??
        []) as CompatibilityRow[];

    /*
     * STEP 3
     * Filter compatibility for the Android version
     * mentioned by the user.
     */

    const relevantCompatibility = androidVersion
      ? compatibility.filter(
          (record) =>
            record.android_version === androidVersion
        )
      : compatibility;

    /*
     * STEP 4
     * Find versions connected to the relevant compatibility records.
     */

    const relevantVersionIds = new Set(
      relevantCompatibility.map(
        (record) => record.version_id
      )
    );

    let relevantVersions = versions;

    if (
      androidVersion &&
      relevantVersionIds.size > 0
    ) {
      relevantVersions = versions.filter((version) =>
        relevantVersionIds.has(version.id)
      );
    }

    /*
     * STEP 5
     * Build app lookup map.
     */

    const appMap = new Map(
      appRows.map((app) => [app.id, app])
    );

    /*
     * STEP 6
     * Create factual database context.
     */

    const databaseContext = {
      user_request: message,

      detected_device_information: {
        android_version: androidVersion,
        ram_gb: ramGb,
      },

      apps: appRows.map((app) => ({
        name: app.name,
        developer: app.developer,
        package_name: app.package_name,
        description: app.description,
      })),

      versions: relevantVersions
        .slice(0, 150)
        .map((version) => ({
          app_name:
            appMap.get(version.app_id)?.name ?? null,

          version_name: version.version_name,
          version_code: version.version_code,
          release_date: version.release_date,
          min_android: version.min_android,
          target_android: version.target_android,
          architecture: version.architecture,
          file_size: version.file_size,

          has_sha256:
            Boolean(version.sha256),

          has_source_url:
            Boolean(version.source_url),
        })),

      compatibility: relevantCompatibility
        .slice(0, 150)
        .map((record) => ({
          app_name:
            appMap.get(record.app_id)?.name ?? null,

          android_version:
            record.android_version,

          status: record.status,

          notes: record.notes,
        })),
    };

    /*
     * STEP 7
     * Gemini integration.
     */

    /*
     * STEP 7
     * Ask Gemini to reason ONLY over DroidZyra data.
     */

    const systemInstructions = `
You are DroidZyra AI.

You are an Android app compatibility and version assistant.

Your job is to answer the user's question using ONLY the DroidZyra database context provided below.

STRICT FACTUAL RULES:

1. Never invent apps, versions, compatibility, Android requirements, release dates, architecture, file sizes, source links or technical specifications.

2. The DroidZyra database is the source of truth.

3. Compatibility records are the primary source for compatibility claims.

4. Version records are the primary source for version information.

5. If the user provides an Android version, use the compatibility records for that Android version.

6. If there is no compatibility record for the requested Android version, clearly say that DroidZyra currently has no compatibility data for that Android version.

7. If multiple compatible versions exist, prefer the newest available release date.

8. The user's RAM can be considered as contextual information, but NEVER claim that a specific RAM amount is required unless the database explicitly contains such information.

9. Do not say an app will definitely run smoothly. Android compatibility alone does not guarantee performance.

10. Do not invent download links.

11. If a source URL exists in the database, you may tell the user that a source is available. Do not create or modify URLs.

12. Do not expose internal database IDs.

13. Keep the answer concise and useful.

14. When recommending a version, explain the reason using actual database information.

15. If the available data is insufficient, honestly say that more DroidZyra data is needed.

16. Never use outside knowledge to fill missing DroidZyra database information.

17. If the user asks something unrelated to the database, politely explain that DroidZyra AI focuses on Android app discovery, versions and compatibility.

Return a natural, user-friendly answer.
    `.trim();

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: systemInstructions,
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
User question:

${message}

DroidZyra database context:

${JSON.stringify(databaseContext)}
                  `.trim(),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 700,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const geminiError = await geminiResponse.text();

      console.error(
        "DroidZyra Gemini API error:",
        geminiResponse.status,
        geminiError
      );

      return NextResponse.json(
        {
          error: "DroidZyra AI is temporarily unavailable.",
        },
        { status: 502 }
      );
    }

    const geminiData = await geminiResponse.json();

    const answer =
      geminiData?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? "")
        .join("")
        .trim() ||
      "I could not generate an answer from the available DroidZyra data.";
    return NextResponse.json({
      answer,

      detected: {
        androidVersion,
        ramGb,
      },

      dataSummary: {
        apps: appRows.length,
        versions: relevantVersions.length,
        compatibility:
          relevantCompatibility.length,
      },
    });
  } catch (error) {
    console.error(
      "DroidZyra AI error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "DroidZyra AI is temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}









