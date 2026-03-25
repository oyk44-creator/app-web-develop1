import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * @openapi
 * /api/admin/error-logs:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get error logs (Admin)
 *     description: Retrieve error logs with pagination (admin only)
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 관리자 권한 확인
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const errorType = searchParams.get("errorType");
    const context = searchParams.get("context");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // 에러 로그 조회 쿼리 구성
    let query = supabase
      .from("error_logs")
      .select(
        `
        id,
        user_id,
        error_type,
        error_code,
        error_message,
        context,
        resource_type,
        resource_id,
        request_path,
        ip_address,
        user_agent,
        environment,
        created_at,
        user_profiles (
          email,
          full_name
        )
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // 필터 적용
    if (errorType) {
      query = query.eq("error_type", errorType);
    }
    if (context) {
      query = query.eq("context", context);
    }

    const { data: errorLogs, error: logsError, count } = await query;

    if (logsError) {
      console.error("Error fetching error logs:", logsError);
      return NextResponse.json(
        { error: "Failed to fetch error logs" },
        { status: 500 }
      );
    }

    // 데이터 변환
    const transformedLogs = errorLogs?.map((log: any) => ({
      id: log.id,
      user_id: log.user_id,
      user_email: log.user_profiles?.email || null,
      user_name: log.user_profiles?.full_name || null,
      error_type: log.error_type,
      error_code: log.error_code,
      error_message: log.error_message,
      context: log.context,
      resource_type: log.resource_type,
      resource_id: log.resource_id,
      request_path: log.request_path,
      ip_address: log.ip_address,
      user_agent: log.user_agent,
      environment: log.environment,
      created_at: log.created_at,
    }));

    return NextResponse.json({
      logs: transformedLogs,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error in admin error logs API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
