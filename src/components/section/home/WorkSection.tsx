"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface WorkItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

const WorkList: WorkItem[] = [
  {
    id: 1,
    title: "데이터 입력",
    description:
      "파일을 업로드 하거나 혹은 수기로 차량 데이터를 입력 해주세요.",
    image: "/images/screenshot/upload.png",
  },
  {
    id: 2,
    title: "대시보드",
    description: "업로드 한 차량 데이터 현황을 한눈에 확인할 수 있어요.",
    image: "/images/screenshot/dashboard.png",
  },
  {
    id: 3,
    title: "차트",
    description:
      "원하는 측정 항목별 데이터를 필터링해 시각화하여 분석할 수 있어요.",
    image: "/images/screenshot/chart.png",
  },
  {
    id: 4,
    title: "데이터 목록",
    description:
      "내가 업로드한 데이터들의 목록을 한눈에 볼 수 있으며 삭제 및 다운로드가 가능해요.",
    image: "/images/screenshot/list.png",
  },
];

export default function StickySteps() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();
  const textColor =
    "bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent";
  return (
    <section ref={wrapRef}>
      <div className="container mx-auto h-full">
        <div className="grid h-full grid-cols-1 gap-10 md:grid-cols-2">
          {/* 좌측: sticky 이미지 (데스크탑 전용) */}
          <div className="relative hidden md:block">
            <div className="sticky top-24 md:top-32">
              <div className="flex aspect-[5/4] w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-50">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={WorkList[active]?.id}
                    src={WorkList[active]?.image}
                    alt={`step-${WorkList[active]?.title}`}
                    className="h-auto w-[80%]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 우측: 단계 목록 */}
          <div className="relative">
            <div className="relative flex flex-col gap-10">
              <h2 className={`text-center ${textColor}`}>작동 방식</h2>
              <ol className="flex flex-col gap-6">
                {WorkList.map((item, i) => {
                  const isActive = i === active;
                  return (
                    <li
                      key={item.id}
                      className="flex flex-col gap-2"
                      aria-current={isActive ? "step" : undefined}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActive(i);
                        }}
                        className="w-full text-left"
                      >
                        <div className="flex items-start gap-2 sm:gap-6">
                          <p
                            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors sm:h-12 sm:w-12 ${
                              isMobile
                                ? "bg-emerald-500 text-white"
                                : isActive
                                  ? "bg-emerald-500 text-white"
                                  : "bg-gray-100 text-blue-900/40"
                            }`}
                          >
                            {item.id}
                          </p>
                          <div className="flex-1">
                            <h4
                              className={`text-2xl font-semibold transition-colors ${
                                isMobile
                                  ? `${textColor}`
                                  : isActive
                                    ? `${textColor}`
                                    : "text-primary"
                              }`}
                            >
                              {item.title}
                            </h4>
                            <p
                              className={`px-2 transition-colors ${
                                isMobile
                                  ? `${textColor}`
                                  : isActive
                                    ? `${textColor}`
                                    : "text-primary"
                              }`}
                            >
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* 모바일 전용 이미지 */}
                      <div className="relative mt-4 flex justify-center md:hidden">
                        <div className="flex aspect-[5/4] w-2/3 items-center justify-center overflow-hidden rounded-2xl bg-gray-50">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={WorkList[active]?.id}
                              src={WorkList[active]?.image}
                              alt={`step-${WorkList[active]?.title}`}
                              className="h-auto w-[80%]"
                            />
                          </AnimatePresence>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* 인디케이터 (데스크탑) */}
              <div className="mt-6 hidden gap-2 md:flex">
                {WorkList.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-8 rounded-full transition-all ${
                      i === active ? `bg-emerald-500` : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
