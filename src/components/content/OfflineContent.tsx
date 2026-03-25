"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * OfflineContent (Client Component)
 * - 오프라인 상태 표시 및 새로고침, 홈 이동 버튼 제공
 * 1차적으로 임시로 PWA 구현한 상태이며, 추후 Flutter로 앱 만들 예정입니다.
 */
export default function OfflineContent() {
  const [online, setOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : false
  );

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="space-y-2">
        <h1>오프라인 상태입니다</h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          현재 네트워크 연결을 확인할 수 없습니다. 연결을 복구한 뒤 아래 버튼을
          눌러 다시 시도하세요.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => window.location.reload()} variant="default">
          새로고침
        </Button>
        <Button onClick={() => (window.location.href = "/")} variant="outline">
          홈으로 이동
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        연결 상태:{" "}
        {online ? (
          <span className="text-green-600">온라인 감지됨 - 새로고침 가능</span>
        ) : (
          <span className="text-red-600">오프라인</span>
        )}
      </p>
    </div>
  );
}
