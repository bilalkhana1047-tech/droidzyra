import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

  const adminEmail =
    process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";

  if (!supabaseUrl || !supabaseAnonKey || !adminEmail) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "config");

    if (!isLoginPage) {
      return NextResponse.redirect(loginUrl);
    }

    const configResponse = NextResponse.next();
    configResponse.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive"
    );

    return configResponse;
  }

  let response = NextResponse.next({
    request,
  });

  response.headers.set(
    "X-Robots-Tag",
    "noindex, nofollow, noarchive"
  );

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({
            request,
          });

          response.headers.set(
            "X-Robots-Tag",
            "noindex, nofollow, noarchive"
          );

          cookiesToSet.forEach(
            ({ name, value, options }) =>
              response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthorizedAdmin =
    !!user &&
    user.email?.toLowerCase() === adminEmail;

  if (
    isAdminRoute &&
    !isLoginPage &&
    !isAuthorizedAdmin
  ) {
    const loginUrl = new URL(
      "/admin/login",
      request.url
    );

    if (user && !isAuthorizedAdmin) {
      loginUrl.searchParams.set(
        "error",
        "unauthorized"
      );
    }

    const redirectResponse =
      NextResponse.redirect(loginUrl);

    redirectResponse.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive"
    );

    return redirectResponse;
  }

  if (isLoginPage && isAuthorizedAdmin) {
    const redirectResponse = NextResponse.redirect(
      new URL("/admin", request.url)
    );

    redirectResponse.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive"
    );

    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
