import type { Metadata } from "next";
import ColorPalette from "@/components/colors/ColorPalette";

export const metadata: Metadata = {
  title: "FMAI 색상 팔레트 | 퓨처모빌리티AI",
  description: "퓨처모빌리티AI 브랜드 색상 시스템",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ColorsPage() {
  return <ColorPalette />;
}
