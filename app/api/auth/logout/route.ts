import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout
 *     description: Sign out the current user and record audit log
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Not authenticated
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 현재 사용자 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 요청 정보 추출
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const userAgent = request.headers.get("user-agent") || null;

    // 로그아웃 감사 로그 기록
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "LOGOUT",
      resource_type: "user_auth",
      details: {
        email: user.email,
        logout_time: new Date().toISOString(),
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout logging error:", error);
    // 로그 기록 실패해도 로그아웃은 진행되어야 하므로 성공 응답
    return NextResponse.json({ success: true });
  }
}
