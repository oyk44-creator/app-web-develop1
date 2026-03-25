"use client";
import { ArrowRight, Play, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-20"
      aria-labelledby="hero-heading"
      role="banner"
    >
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98114_1px,transparent_1px),linear-gradient(to_bottom,#10b98114_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="border-fmai-primary/30 bg-fmai-primary/10 px-4 py-2 text-fmai-primary-light hover:bg-fmai-primary/20"
            >
              <Zap className="mr-2 h-4 w-4 animate-pulse" />
              Next-Gen EV Battery Platform
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 text-4xl tracking-tight sm:text-7xl lg:text-8xl"
            id="hero-heading"
          >
            <span className="mb-2 block text-primary">배터리 안전,</span>
            <span className="text-fmai-gradient block">
              데이터로 증명합니다
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-12 max-w-3xl text-lg text-slate-400 sm:text-xl"
          >
            CAN·OBD 실시간 데이터 수집부터 AI 위험 예측까지
            <br />
            전기차 배터리의 모든 순간을 모니터링합니다
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="group bg-gradient-to-r from-fmai-primary to-fmai-accent px-8 py-6 text-white shadow-lg shadow-fmai-primary/40 hover:from-fmai-primary-dark hover:to-fmai-accent-dark"
              aria-label="플랫폼 체험하기 CTA 버튼"
            >
              플랫폼 체험하기
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 bg-slate-700 px-8 py-6 text-white backdrop-blur-xl hover:bg-slate-900 hover:text-white"
              aria-label="데모 영상 재생"
            >
              데모 영상
              <Play className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Floating Stats Cards */}
          <motion.dl
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 grid grid-cols-2 gap-4 md:grid-cols-4"
            aria-label="플랫폼 주요 요약 통계"
          >
            {[
              { value: "50K+", label: "분석된 전기차", delay: 0 },
              { value: "200TB+", label: "CAN·OBD 데이터", delay: 0.1 },
              { value: "99.8%", label: "예측 정확도", delay: 0.2 },
              { value: "24/7", label: "실시간 모니터링", delay: 0.3 },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + stat.delay }}
                className="group relative"
              >
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-fmai-primary/20 to-fmai-secondary/20 opacity-0 blur-xl transition-opacity group-hover:opacity-50"
                  aria-hidden="true"
                />
                <div className="relative rounded-2xl border border-slate-800 p-6 backdrop-blur-xl transition-all hover:border-fmai-primary/50">
                  <dd
                    className="text-fmai-gradient mb-2 text-4xl font-semibold"
                    aria-label={`${stat.label} 값`}
                  >
                    {stat.value}
                  </dd>
                  <dt className="text-sm text-slate-400">{stat.label}</dt>
                </div>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
