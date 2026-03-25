import type { Metadata } from "next";
import { ContactSection } from "@/components/section/contact/ContactSection";

export const metadata: Metadata = {
  title: "문의 | 퓨처모빌리티AI",
  description:
    "차량 데이터 플랫폼 문의 페이지입니다. 상담, 이메일, 위치 정보를 확인하고 문의를 보내실 수 있습니다.",
  openGraph: {
    title: "문의 | 퓨처모빌리티AI",
    description:
      "차량 데이터 플랫폼 문의 페이지에서 상담, 이메일, 위치 정보를 확인하세요.",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactSection />;
}
