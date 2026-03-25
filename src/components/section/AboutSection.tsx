"use client";
import { Badge } from "../ui/badge";
import { Cable, Activity, Brain, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    icon: Cable,
    title: "CAN·OBD 데이터 수집",
    description:
      "실제 차량에서 발생하는 CAN 버스와 OBD-II 데이터를 실시간으로 수집하고 처리합니다.",
    color: "from-fmai-info to-fmai-secondary",
  },
  {
    icon: Activity,
    title: "배터리 상태 모니터링",
    description:
      "SOC, SOH, 온도, 전압 등 핵심 배터리 지표를 실시간 추적하고 이상 징후를 감지합니다.",
    color: "from-fmai-primary to-fmai-accent",
  },
  {
    icon: Brain,
    title: "AI 위험도 분석",
    description:
      "머신러닝 모델로 배터리 화재 위험도를 예측하고 사전 경고 알림을 제공합니다.",
    color: "from-fmai-purple to-fmai-pink",
  },
];

export function AboutSection() {
  return (
    <section
      className="relative overflow-hidden py-32"
      aria-labelledby="about-heading"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left - Bento Grid */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Large Card */}
              <div className="group relative col-span-2">
                <div className="absolute inset-0 rounded-3xl opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                <div className="relative flex flex-col gap-2 overflow-hidden rounded-3xl border p-8 backdrop-blur-xl transition-all">
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-fmai-primary/20 to-transparent blur-3xl" />
                  <Image
                    src="/images/screenshot/dashboard.png"
                    alt="실시간 대시보드 미리보기"
                    width={800}
                    height={600}
                    className="h-auto w-full rounded-lg object-cover"
                  />
                  <p className="text-xl font-semibold text-primary">
                    실시간 대시보드
                  </p>
                  <p className="text-slate-400">
                    모든 데이터를 한눈에 볼 수 있어요.
                  </p>
                </div>
              </div>

              {/* Small Cards */}
              <div className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-fmai-info/20 to-fmai-purple/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                <div className="relative h-full rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl transition-all hover:border-fmai-info/50">
                  <div className="mb-3 text-5xl">⚡</div>
                  <p className="mb-2 font-semibold text-white">초고속 처리</p>
                  <p className="text-sm text-slate-400">ms 단위 응답</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-fmai-primary/20 to-fmai-accent/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                <div className="relative h-full rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl transition-all hover:border-fmai-primary/50">
                  <div className="mb-3 text-5xl">🔋</div>
                  <p className="mb-2 font-semibold text-white">배터리 최적화</p>
                  <p className="text-sm text-slate-400">AI 기반 관리</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge
              variant="outline"
              className="mb-6 border-fmai-primary/30 bg-fmai-primary/10 px-4 py-2 text-fmai-primary-light"
            >
              Mobility BigData MVP
            </Badge>
            <h2
              className="mb-6 text-3xl tracking-tight text-primary lg:text-6xl"
              id="about-heading"
            >
              전기차의 미래를
              <br />
              <span className="text-fmai-gradient">지금 경험하세요</span>
            </h2>
            <p className="mb-12 leading-relaxed text-slate-400 sm:text-lg">
              실시간 CAN·OBD 데이터 수집부터 AI 분석까지, 전기차 배터리의 안전과
              수명을 최적화하는 통합 플랫폼을 제공합니다.
            </p>

            <ul
              className="space-y-6"
              role="list"
              aria-label="회사 주요 기능 소개 목록"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 transition-opacity group-hover:opacity-10`}
                      aria-hidden="true"
                    />
                    <div className="relative flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl transition-all hover:border-slate-700">
                      <div
                        className={`h-12 w-12 flex-shrink-0 bg-gradient-to-br ${feature.color} flex items-center justify-center rounded-xl`}
                        aria-hidden="true"
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-white">
                          {feature.title}
                          <ArrowUpRight
                            className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                            aria-hidden="true"
                          />
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
