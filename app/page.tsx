import { Metadata } from "next";

import SolutionSection from "@/components/section/home/SolutionSection";
import HeroSection from "@/components/section/home/HeroSection";
import MessageSection from "@/components/section/home/MessageSection";
import FeatureSection from "@/components/section/home/FeatureSection";
import { MockProps } from "@/lib/types/home";
import WorkSection from "@/components/section/home/WorkSection";
import VideoSection from "@/components/section/home/VideoSection";

export const metadata: Metadata = {
  title: "퓨처모빌리티AI | OBD·AI 기반 모빌리티 솔루션",
  description:
    "OBD·AI·디지털트윈 기반으로 차량 상태와 리스크를 투명하게 연결하여 모빌리티 안전과 효율을 재정의합니다. 차량 데이터 수집, 정제, 분석, 예측 서비스를 제공합니다.",
  keywords: [
    "차량 데이터",
    "OBD",
    "AI",
    "디지털트윈",
    "모빌리티",
    "차량 분석",
    "데이터 플랫폼",
  ],
  openGraph: {
    title: "퓨처모빌리티AI",
    description:
      "OBD·AI 기반으로 차량의 상태와 리스크를 투명하게 연결하는 모빌리티 솔루션",
    type: "website",
  },
};

const MockData: MockProps = {
  title: "비전(Vision)",
  description: `차량이 스스로 말하는 세상을 만든다.
OBD·AI·디지털트윈 기반으로, 모든 차량의 상태와 리스크를 투명하게 연결해
모빌리티 안전과 효율을 재정의한다.`,
  imageSrc:
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  imageAlt: "placeholder hero",
  buttonPrimary: {
    text: "시작하기",
    href: "https://shadcnblocks.com",
  },
  buttonSecondary: {
    text: "자세히 보기",
    href: "https://shadcnblocks.com",
  },
};

const MockData2: MockProps = {
  title: "미션(Mission)",
  description: `
데이터를 읽어 안전을 예측하고, 기술로 신뢰를 설계한다.
OBD 데이터 수집 → 정제 → 분석 → 예측의 전 과정을 자체 시스템으로 구축해
B2B/B2G 기반의 실질적 데이터 표준을 만들어간다.`,
  imageSrc:
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  imageAlt: "placeholder hero",
  buttonPrimary: {
    text: "시작하기",
    href: "https://shadcnblocks.com",
  },
  buttonSecondary: {
    text: "자세히 보기",
    href: "https://shadcnblocks.com",
  },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 sm:gap-20">
      <div className="w-full">
        <HeroSection />
      </div>
      <VideoSection />
      <MessageSection />
      <FeatureSection item={MockData} />
      <FeatureSection item={MockData2} imageRight={true} />
      <WorkSection />
      <SolutionSection />
    </div>
  );
}
