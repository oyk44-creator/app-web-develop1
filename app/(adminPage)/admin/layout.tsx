import { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자 페이지 | 퓨처모빌리티AI",
  description:
    "시스템 관리자 전용 페이지입니다. 사용자 관리, 데이터 관리, 시스템 설정 기능을 제공합니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
