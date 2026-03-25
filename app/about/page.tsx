import { AboutSection } from "@/components/section/AboutSection";
import { FeaturesSection } from "@/components/section/FeatureSection";
import { HeroSection } from "@/components/section/HeroSection";
import { StatsSection } from "@/components/section/StatSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "회사소개 | 차량 데이터 분석 플랫폼",
  description:
    "차량 데이터 분석 플랫폼 회사 소개를 통해 회사에 대해 알아보고 이용하세요.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <StatsSection />
    </div>
  );
}
