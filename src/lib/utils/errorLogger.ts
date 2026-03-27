// 서버 에러 로깅 유틸리티
// API 라우트에서 발생하는 에러를 DB에 기록

import { createClient } from "@/lib/supabase/server";

export interface ErrorLogInput {
  errorType: string; // validation_error, database_error, upload_error 등
  errorCode?: string; // 시스템 에러 코드
  errorMessage: string;
  context: string; // file_upload, data_processing, api_call 등
  resourceType?: string; // file_upload, vehicle_data 등
  resourceId?: string;
  requestPath?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId?: string;
}

/**
 * 서버에서 발생한 에러를 DB에 기록
 * @param input 에러 정보
 * @returns 성공 여부
 */
export async function logError(input: ErrorLogInput): Promise<boolean> {
  try {
    const supabase = await createClient();

    const errorLog = {
      user_id: input.userId || null,
      error_type: input.errorType,
      error_code: input.errorCode || null,
      error_message: input.errorMessage,
      context: input.context,
      resource_type: input.resourceType || null,
      resource_id: input.resourceId || null,
      request_path: input.requestPath || null,
      ip_address: input.ipAddress || null,
      user_agent: input.userAgent || null,
      environment: process.env.NODE_ENV || "production",
    };

    const { error } = await supabase.from("error_logs").insert(errorLog);

    if (error) {
      console.error("Failed to log error to DB:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error in logError function:", err);
    return false;
  }
}

/**
 * NextRequest에서 IP 주소 추출
 */
export function getIpAddress(request: Request): string | null {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}

/**
 * NextRequest에서 User Agent 추출
 */
export function getUserAgent(request: Request): string | null {
  return request.headers.get("user-agent") || null;
}

/**
 * API 라우트에서 에러 로깅을 쉽게 할 수 있는 래퍼 함수
 */
export async function logApiError(
  error: Error | unknown,
  request: Request,
  context: string,
  options?: {
    userId?: string;
    resourceType?: string;
    resourceId?: string;
    errorType?: string;
    errorCode?: string;
  }
): Promise<boolean> {
  const errorMessage =
    error instanceof Error ? error.message : "Unknown error occurred";

  return logError({
    errorType: options?.errorType || "api_error",
    errorCode: options?.errorCode,
    errorMessage,
    context,
    resourceType: options?.resourceType,
    resourceId: options?.resourceId,
    requestPath: new URL(request.url).pathname,
    ipAddress: getIpAddress(request),
    userAgent: getUserAgent(request),
    userId: options?.userId,
  });
}
