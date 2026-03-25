import { Metadata } from "next";

export const metadata: Metadata = {
  title: "차트 뷰 | 퓨처모빌리티AI",
  description:
    "차량 데이터를 다양한 차트로 시각화하여 분석하세요. SOC, SOH, 배터리 온도 등의 측정 항목을 시계열로 확인할 수 있습니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
