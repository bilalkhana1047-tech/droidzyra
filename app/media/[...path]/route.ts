import { NextResponse } from "next/server";

const BUCKET = "app-media";

function getStorageUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");

  if (!base) return null;

  const encodedPath = path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${base}/storage/v1/object/public/${BUCKET}/${encodedPath}`;
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { path: string[] };
  }
) {
  const pathParts = params.path ?? [];

  if (
    pathParts.length < 2 ||
    pathParts.some(
      (part) =>
        !part ||
        part === "." ||
        part === ".."
    )
  ) {
    return new NextResponse("Invalid media path", {
      status: 400,
    });
  }

  const storagePath = pathParts.join("/");
  const storageUrl = getStorageUrl(storagePath);

  if (!storageUrl) {
    return new NextResponse(
      "Media storage is not configured",
      {
        status: 500,
      }
    );
  }

  try {
    const upstream = await fetch(storageUrl, {
      cache: "force-cache",
    });

    if (!upstream.ok || !upstream.body) {
      return new NextResponse("Media not found", {
        status: upstream.status === 404 ? 404 : 502,
      });
    }

    const headers = new Headers();

    headers.set(
      "Content-Type",
      upstream.headers.get("content-type") ||
        "application/octet-stream"
    );

    headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    const contentLength =
      upstream.headers.get("content-length");

    if (contentLength) {
      headers.set(
        "Content-Length",
        contentLength
      );
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Media proxy error:", error);

    return new NextResponse(
      "Unable to load media",
      {
        status: 502,
      }
    );
  }
}
