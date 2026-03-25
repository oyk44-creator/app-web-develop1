/**
 * PWA 오프라인 폴백 페이지 (Server Component)
 * - next-pwa 문서에서 offline fallback 용도로 라우트 사용
 * - 메타데이터 export 필요하므로 서버 컴포넌트 유지
 * - 인터랙티브(online 상태 표시, 새로고침 버튼 등)는 분리된 Client 컴포넌트에서 처리
 */

import OfflineContent from "@/components/content/OfflineContent";

export const metadata = {
  title: "오프라인 상태 | 퓨처모빌리티AI",
  description: "네트워크 연결이 끊겼습니다. 다시 연결 후 새로고침하세요.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return <OfflineContent />;
}
