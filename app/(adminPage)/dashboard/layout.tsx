import { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드 | 퓨처모빌리티AI",
  description:
    "차량 데이터 현황을 한눈에 확인하세요. SOC, SOH, 배터리 온도 등 주요 지표와 최근 데이터를 실시간으로 모니터링할 수 있습니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
