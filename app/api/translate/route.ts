import { NextRequest, NextResponse } from "next/server";

const GOOGLE_TRANSLATE_URL =
  "https://translation.googleapis.com/language/translate/v2";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Translate API key is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const texts = Array.isArray(body.texts)
      ? body.texts
      : typeof body.text === "string"
      ? [body.text]
      : [];

    const target = body.target;

    if (!texts.length || !target) {
      return NextResponse.json(
        { error: "texts and target are required." },
        { status: 400 }
      );
    }

    if (texts.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 text items per request." },
        { status: 400 }
      );
    }

    if (target === "en") {
      return NextResponse.json({
        translations: texts,
      });
    }

    const response = await fetch(
      `${GOOGLE_TRANSLATE_URL}?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: texts,
          target,
          format: "text",
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Google Translation API error:", data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "Translation request failed.",
        },
        { status: response.status }
      );
    }

    const translations =
      data?.data?.translations?.map(
        (item: { translatedText?: string }) =>
          item.translatedText ?? ""
      ) ?? [];

    return NextResponse.json({ translations });
  } catch (error) {
    console.error("Translation route error:", error);

    return NextResponse.json(
      { error: "Unable to translate content." },
      { status: 500 }
    );
  }
}
