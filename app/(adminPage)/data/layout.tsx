import { Metadata } from "next";

export const metadata: Metadata = {
  title: "데이터 관리 | 퓨처모빌리티AI",
  description:
    "차량 데이터를 업로드하고 관리하세요. 파일 업로드, 수기 입력, 데이터 조회 및 분석 기능을 제공합니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
