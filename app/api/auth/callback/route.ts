/**
 * @openapi
 * /api/auth/callback:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: OAuth callback
 *     description: Handle OAuth authentication callback from Supabase
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: false
 *         description: Supabase authentication code
 *       - in: query
 *         name: redirect
 *         schema:
 *           type: string
 *         required: false
 *         description: 로그인 후 리다이렉트 경로
 *     responses:
 *       302:
 *         description: 처리 후 리다이렉트
 */
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect = requestUrl.searchParams.get("redirect");

  // Render 등의 프록시 환경에서 올바른 origin을 가져오기 위해
  // X-Forwarded-Host 또는 환경 변수를 우선 사용
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;

  // 요청 정보 추출
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;
  const userAgent = request.headers.get("user-agent") || null;

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const authMethod =
        (data.user as any)?.app_metadata?.provider ||
        (Array.isArray((data.user as any)?.identities) &&
          (data.user as any).identities[0]?.provider) ||
        "magic_link";
      // 로그인 성공 - 감사 로그 기록
      try {
        await supabase.from("audit_logs").insert({
          user_id: data.user.id,
          action: "LOGIN",
          resource_type: "user_auth",
          details: {
            email: data.user.email,
            auth_method: authMethod,
            login_time: new Date().toISOString(),
          },
          ip_address: ipAddress,
          user_agent: userAgent,
        });

        // 사용자 프로필의 last_login_at 업데이트
        await supabase
          .from("user_profiles")
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", data.user.id);
      } catch (logError) {
        // 로그 기록 실패해도 로그인은 계속 진행
        console.error("Failed to log login event:", logError);
      }

      // 성공: redirect 파라미터가 있으면 해당 페이지로, 없으면 대시보드로 리다이렉션
      const redirectTo = redirect || "/dashboard";
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }

    // 로그인 실패 - 감사 로그 기록
    if (error) {
      try {
        const supabaseForLog = await createClient();
        await supabaseForLog.from("audit_logs").insert({
          user_id: null,
          action: "LOGIN_FAILED",
          resource_type: "user_auth",
          details: {
            error_message: error.message,
            error_code: error.code,
            failure_time: new Date().toISOString(),
          },
          ip_address: ipAddress,
          user_agent: userAgent,
        });
      } catch (logError) {
        console.error("Failed to log login failure:", logError);
      }
    }
  }

  // 실패: 에러 메시지와 함께 로그인 페이지로 리다이렉션
  return NextResponse.redirect(`${origin}?error=auth_callback_error`);
}
