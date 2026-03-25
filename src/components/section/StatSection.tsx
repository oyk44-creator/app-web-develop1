"use client";
import { Battery, Car, Database, AlertCircle, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

const stats = [
  {
    icon: Battery,
    value: "50K+",
    label: "모니터링 배터리",
    color: "from-fmai-primary to-fmai-accent",
  },
  {
    icon: Car,
    value: "50,000+",
    label: "분석된 전기차",
    color: "from-fmai-info to-fmai-secondary",
  },
  {
    icon: Users,
    value: "5,000+",
    label: "활성 사용자",
    color: "from-fmai-purple to-fmai-pink",
  },
  {
    icon: Database,
    value: "200TB+",
    label: "CAN·OBD 데이터",
    color: "from-fmai-purple to-fmai-pink",
  },
  {
    icon: AlertCircle,
    value: "99.8%",
    label: "위험 예측 정확도",
    color: "from-fmai-orange to-fmai-red",
  },
];

export function StatsSection() {
  return (
    <section
      className="relative overflow-hidden py-32"
      aria-labelledby="stats-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fmai-primary-dark/20 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2
            className="mb-6 text-3xl tracking-tight text-primary lg:text-6xl"
            id="stats-heading"
          >
            실시간으로 증명하는
            <br />
            <span className="text-fmai-gradient">플랫폼 성능</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-400">
            전기차 배터리 안전을 책임지는 빅데이터 플랫폼의 실시간 지표
          </p>
        </motion.div>

        {/* Stats Grid */}
        <dl
          className="mb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          aria-label="플랫폼 성능 통계 목록"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-3xl opacity-0 blur transition duration-500 group-hover:opacity-40`}
                  aria-hidden="true"
                />
                <div className="relative rounded-3xl border border-slate-800 bg-slate-950/80 p-8 text-center backdrop-blur-xl transition-all hover:border-slate-700">
                  <div
                    className={`inline-flex h-16 w-16 bg-gradient-to-br ${stat.color} mb-6 items-center justify-center rounded-2xl`}
                    aria-hidden="true"
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <dd
                    className={`bg-gradient-to-r text-5xl ${stat.color} mb-2 bg-clip-text font-semibold text-transparent`}
                    aria-label={`${stat.label} 값`}
                  >
                    {stat.value}
                  </dd>
                  <dt className="text-slate-400">{stat.label}</dt>
                </div>
              </motion.div>
            );
          })}
        </dl>

        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-fmai-primary/30 bg-gradient-to-r from-fmai-primary-dark/90 via-slate-950/90 to-fmai-secondary-dark/90 p-2 text-center backdrop-blur-xl sm:p-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98112_1px,transparent_1px),linear-gradient(to_bottom,#10b98112_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="relative z-10">
            <Badge
              variant="outline"
              className="mb-6 border-fmai-primary/30 bg-fmai-primary/20 px-4 py-2 text-fmai-primary-light"
            >
              무료 체험 시작
            </Badge>
            <h3 className="mb-4 text-3xl tracking-tight text-white lg:text-5xl">
              배터리 안전의 새로운 기준을
              <br />
              <span className="text-fmai-gradient">지금 경험하세요</span>
            </h3>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
              AI 기반 배터리 모니터링 시스템을 직접 확인해보세요
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-fmai-primary to-fmai-accent px-10 py-6 text-white shadow-lg shadow-fmai-primary/50 hover:from-fmai-primary-dark hover:to-fmai-accent-dark"
            >
              무료 상담 신청하기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
