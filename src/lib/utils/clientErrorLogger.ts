// 클라이언트 에러 로깅 유틸리티
// 브라우저에서 발생하는 JavaScript 에러를 서버로 전송

"use client";

export interface ClientErrorInput {
  errorType: string; // client_error, render_error, network_error 등
  errorMessage: string;
  context: string; // component_name, page_name 등
  additionalInfo?: Record<string, unknown>;
}

/**
 * 클라이언트에서 발생한 에러를 서버로 전송하여 DB에 기록
 */
export async function logClientError(input: ClientErrorInput): Promise<void> {
  try {
    await fetch("/api/errors/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        url: typeof window !== "undefined" ? window.location.href : undefined,
      }),
    });
  } catch (err) {
    // 에러 로깅 실패는 조용히 처리
    console.error("Failed to log client error:", err);
  }
}

/**
 * 전역 에러 핸들러 설정
 * 브라우저에서 발생하는 처리되지 않은 에러를 자동으로 기록
 */
export function setupGlobalErrorHandler(): void {
  if (typeof window === "undefined") return;

  // 처리되지 않은 에러 캐치
  window.addEventListener("error", (event) => {
    logClientError({
      errorType: "unhandled_error",
      errorMessage: event.message || "Unknown error",
      context: "global_error_handler",
      additionalInfo: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  // 처리되지 않은 Promise rejection 캐치
  window.addEventListener("unhandledrejection", (event) => {
    const message =
      event.reason instanceof Error
        ? event.reason.message
        : String(event.reason);

    logClientError({
      errorType: "unhandled_promise_rejection",
      errorMessage: message,
      context: "global_error_handler",
    });
  });
}

/**
 * React Error Boundary에서 사용할 에러 로깅 함수
 */
export function logReactError(
  error: Error,
  errorInfo?: { componentStack?: string }
): void {
  logClientError({
    errorType: "react_error",
    errorMessage: error.message,
    context: "error_boundary",
    additionalInfo: {
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
    },
  });
}
