import { NextResponse } from "next/server";
import { searchApps } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ apps: [] });
  }

  try {
    const apps = await searchApps(query, 6);

    return NextResponse.json({ apps });
  } catch (error) {
    console.error("Search API error:", error);

    return NextResponse.json(
      { apps: [] },
      { status: 500 }
    );
  }
}
