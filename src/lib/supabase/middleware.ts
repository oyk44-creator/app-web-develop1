// Supabase 클라이언트 (미들웨어용)
// middleware.ts에서 사용

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 보호된 라우트 정의
  const protectedRoutes = [
    "/dashboard",
    "/data",
    "/charts",
    "/settings",
    "/admin",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 관리자 전용 라우트 정의
  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 인증되지 않은 사용자가 보호된 라우트에 접근 시 루트 페이지로 리다이렉션
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 관리자 라우트 권한 체크
  if (isAdminRoute && user) {
    try {
      // 사용자 이메일 가져오기
      const userEmail = user.email;

      // 환경변수에서 관리자 이메일 목록 가져오기
      const adminEmails =
        process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [];

      // 환경변수에 등록된 관리자 이메일이면 즉시 통과
      if (userEmail && adminEmails.includes(userEmail)) {
        return response;
      }

      // 환경변수에 없으면 데이터베이스 role 체크
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      // 관리자가 아닌 경우 403 페이지로 리다이렉션
      if (error || !profile || profile.role !== "admin") {
        return NextResponse.redirect(new URL("/forbidden", request.url));
      }
    } catch (error) {
      // 에러 발생 시 403 페이지로 리다이렉션
      console.error("Error checking admin role:", error);
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  return response;
}
