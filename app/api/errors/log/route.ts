/**
 * @openapi
 * /api/errors/log:
 *   post:
 *     tags:
 *       - Errors
 *     summary: Log error
 *     description: Log an application error from client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error_type:
 *                 type: string
 *               error_message:
 *                 type: string
 *               context:
 *                 type: string
 *               error_code:
 *                 type: string
 *             required:
 *               - error_type
 *               - error_message
 *               - context
 *     responses:
 *       200:
 *         description: Error logged successfully
 *       400:
 *         description: Bad request
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // 현재 사용자 확인 (로그인하지 않은 경우 null)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 요청 정보 추출
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const userAgent = request.headers.get("user-agent") || null;

    const errorLog = {
      user_id: user?.id || null,
      error_type: body.errorType || "client_error",
      error_message: body.errorMessage || "Unknown client error",
      context: body.context || "client",
      request_path: body.url || null,
      ip_address: ipAddress,
      user_agent: userAgent,
      environment: "client",
    };

    const { error } = await supabase.from("error_logs").insert(errorLog);

    if (error) {
      console.error("Failed to insert client error log:", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in client error logging API:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
