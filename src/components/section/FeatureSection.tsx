"use client";
import {
  Battery,
  BarChart3,
  AlertTriangle,
  Shield,
  Zap,
  ChartAreaIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";

import { motion } from "framer-motion";

const features = [
  {
    icon: Battery,
    title: "배터리 상태 모니터링",
    description:
      "SOC, SOH, 온도, 전압, 전류 등 배터리 핵심 지표를 실시간으로 모니터링하고 이상 징후를 즉시 감지합니다.",
    gradient: "from-fmai-primary to-fmai-accent",
    stats: "실시간",
  },
  {
    icon: AlertTriangle,
    title: "위험도 분석 및 예측",
    description:
      "AI 기반 알고리즘으로 배터리 화재 위험도를 사전 예측하고 위험 등급별 경고 알림을 제공합니다.",
    gradient: "from-red-500 to-orange-500",
    stats: "99.8%",
  },
  {
    icon: BarChart3,
    title: "웹 기반 대시보드",
    description:
      "실시간 데이터를 직관적으로 시각화하여 배터리 상태를 한눈에 파악하고 빠른 의사결정을 지원합니다.",
    gradient: "from-fmai-info to-fmai-secondary",
    stats: "실시간",
  },
  {
    icon: ChartAreaIcon,
    title: "CAN·OBD 데이터 수집 및 차트화",
    description:
      "차량 CAN 버스와 OBD-II 포트에서 실시간 데이터를 수집하고 차트 형식으로 변환합니다.",
    gradient: "from-fmai-purple to-fmai-pink",
    stats: "200TB+",
  },
  {
    icon: Shield,
    title: "안전 운행 보장",
    description:
      "배터리 이상 상황을 사전 감지하여 운전자에게 알림을 전송하고 안전한 운행을 보장합니다.",
    gradient: "from-fmai-amber to-fmai-orange",
    stats: "24/7",
  },
  {
    icon: Zap,
    title: "빅데이터 기반 최적화",
    description:
      "수집된 빅데이터를 분석하여 배터리 수명을 최적화하고 효율적인 충전 패턴을 제안합니다.",
    gradient: "from-fmai-indigo to-fmai-purple",
    stats: "AI",
  },
];

export function FeaturesSection() {
  return (
    <section
      className="relative overflow-hidden py-32"
      aria-labelledby="features-heading"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-fmai-primary/10 blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-fmai-secondary/10 blur-[128px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <Badge
            variant="outline"
            className="mb-6 border-fmai-primary/30 bg-fmai-primary/10 px-4 py-2 text-fmai-primary-light"
          >
            Platform Features
          </Badge>
          <h2
            className="mb-6 text-3xl tracking-tight text-primary lg:text-6xl"
            id="features-heading"
          >
            전기차 안전을 위한
            <br />
            <span className="text-fmai-gradient">핵심 기능</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-400">
            CAN·OBD 데이터 수집부터 AI 분석까지, 전기차 배터리 관리의 모든 것
          </p>
        </motion.div>

        <ul
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="플랫폼 핵심 기능 목록"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 blur transition duration-500 group-hover:opacity-30`}
                  aria-hidden="true"
                />
                <div className="relative flex h-full flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-8 backdrop-blur-xl transition-all hover:border-slate-700">
                  <div className="relative" aria-hidden="true">
                    <div
                      className={`absolute inset-2 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-50 blur-xl`}
                    />
                    <div
                      className={`relative h-16 w-16 bg-gradient-to-br ${feature.gradient} flex items-center justify-center rounded-2xl`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="absolute -right-2 -top-2 border-slate-700 bg-slate-900 text-fmai-primary-light hover:bg-slate-800"
                    >
                      {feature.stats}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">
                    {feature.description}
                  </p>
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded text-sm text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-fmai-primary group-hover:text-fmai-primary-light"
                    aria-label={`${feature.title} 기능 자세히 보기`}
                  >
                    <span>자세히 보기</span>
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
