"use client";

import { useState, useEffect } from "react";
import {
  Database,
  Upload,
  TrendingUp,
  AlertTriangle,
  FileText,
  Zap,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamically import Chart to avoid SSR issues
const Chart = dynamic(
  () => import("@/components/charts/Chart").then((mod) => mod.Chart),
  { ssr: false }
);

interface FileUpload {
  id: string;
  file_name: string;
  created_at: string;
  file_size: number;
}

interface DashboardStats {
  totalFiles: number;
  totalDataPoints: number;
  avgSOC: number;
  avgPackTemp: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalFiles: 0,
    totalDataPoints: 0,
    avgSOC: 0,
    avgPackTemp: 0,
  });
  const [recentUploads, setRecentUploads] = useState<FileUpload[]>([]);
  const [chartData, setChartData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch uploads
        const uploadsResponse = await fetch("/api/data/uploads?limit=5");
        if (uploadsResponse.ok) {
          const uploadsResult = await uploadsResponse.json();
          setRecentUploads(uploadsResult.data || []);
          setStats((prev) => ({
            ...prev,
            totalFiles: uploadsResult.pagination?.total || 0,
          }));
        }

        // Fetch chart data for summary
        const chartResponse = await fetch("/api/charts/data?limit=1000");
        if (chartResponse.ok) {
          const chartResult = await chartResponse.json();
          setChartData(chartResult.data || {});
          setStats((prev) => ({
            ...prev,
            totalDataPoints: chartResult.count || 0,
          }));

          // Calculate averages - 배터리/에너지 KPI
          const socData =
            chartResult.data?.soc_ave || chartResult.data?.soc_ui || [];
          const tempData = chartResult.data?.bms_max_pack_temp || [];

          if (socData.length > 0) {
            const avgSOC =
              socData.reduce(
                (sum: number, point: any) => sum + (point.value || 0),
                0
              ) / socData.length;
            setStats((prev) => ({ ...prev, avgSOC }));
          }

          if (tempData.length > 0) {
            const avgTemp =
              tempData.reduce(
                (sum: number, point: any) => sum + (point.value || 0),
                0
              ) / tempData.length;
            setStats((prev) => ({ ...prev, avgPackTemp: avgTemp }));
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("대시보드 데이터를 불러오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mb-12 text-center">
        <h1 className="mb-4 tracking-tight">대시보드</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-400">
          Tesla 주행 데이터 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4"
      >
        <StatsCard
          title="총 파일 수"
          value={stats.totalFiles}
          unit="개"
          icon={Database}
          iconColor="bg-blue-500"
          gradient="from-blue-500 to-cyan-500"
          delay={0}
        />
        <StatsCard
          title="총 데이터 포인트"
          value={stats.totalDataPoints.toLocaleString()}
          unit="개"
          icon={FileText}
          iconColor="bg-green-500"
          gradient="from-emerald-500 to-teal-500"
          delay={0.1}
        />
        <StatsCard
          title="평균 SOC"
          value={stats.avgSOC.toFixed(1)}
          unit="%"
          icon={Zap}
          iconColor="bg-purple-500"
          gradient="from-purple-500 to-pink-500"
          delay={0.2}
        />
        <StatsCard
          title="평균 팩 온도"
          value={stats.avgPackTemp.toFixed(1)}
          unit="°C"
          icon={AlertTriangle}
          iconColor="bg-orange-500"
          gradient="from-orange-500 to-red-500"
          delay={0.3}
        />
      </motion.div>

      {/* 빠른 액션 */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-6 text-2xl font-semibold tracking-tight text-primary lg:text-3xl"
      >
        빠른 액션
      </motion.h2>
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            icon: Upload,
            title: "파일 업로드",
            description: "새로운 Tesla 데이터 파일을 업로드하세요",
            href: "/data/upload",
            buttonText: "업로드 페이지로 이동",
            gradient: "from-emerald-500 to-teal-500",
            delay: 0.4,
          },
          {
            icon: Database,
            title: "데이터 관리",
            description: "업로드된 데이터를 확인하고 관리하세요",
            href: "/data/list",
            buttonText: "데이터 목록 보기",
            gradient: "from-blue-500 to-cyan-500",
            delay: 0.5,
          },
          {
            icon: TrendingUp,
            title: "차트 분석",
            description: "주행 데이터를 차트로 시각화하고 분석하세요",
            href: "/charts",
            buttonText: "차트 보기",
            gradient: "from-purple-500 to-pink-500",
            delay: 0.6,
          },
        ].map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: action.delay }}
              className="group relative"
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${action.gradient} rounded-3xl opacity-0 blur transition duration-500 group-hover:opacity-30`}
              />
              <Card className="relative h-full rounded-3xl border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all hover:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div
                      className={`bg-gradient-to-br ${action.gradient} rounded-xl p-2.5`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm leading-relaxed text-slate-400">
                    {action.description}
                  </p>
                  <Link href={action.href}>
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400">
                      {action.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 차트 요약 */}
      {!loading && chartData.soc_ave && chartData.bms_max_pack_temp && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-12"
        >
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-primary lg:text-3xl">
            <span className="text-fmai-gradient">배터리 상태 요약</span>
          </h2>
          <Chart
            groupLabel="배터리 상태"
            groupDescription="SOC 및 팩 온도 추이"
            metrics={["soc_ave", "bms_max_pack_temp"]}
            data={chartData}
            chartType="line"
          />
        </motion.div>
      )}

      {/* 최근 업로드 파일 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="group relative"
      >
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 blur-xl transition-opacity group-hover:opacity-50" />
        <Card className="relative rounded-3xl border-slate-800 bg-slate-950/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <FileText className="h-6 w-6" />
              최근 업로드 파일
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-slate-400">로딩 중...</p>
            ) : recentUploads.length === 0 ? (
              <p className="text-sm text-slate-400">
                업로드된 파일이 없습니다. 새 파일을 업로드해보세요.
              </p>
            ) : (
              <div className="space-y-3">
                {recentUploads.map((upload, index) => (
                  <motion.div
                    key={upload.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                    className="group/item relative"
                  >
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 opacity-0 blur transition-opacity group-hover/item:opacity-100" />
                    <div className="relative flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-slate-700">
                      <div>
                        <p className="font-medium text-white">
                          {upload.file_name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(upload.created_at).toLocaleString("ko-KR")}{" "}
                          • {(upload.file_size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Link href={`/data/${upload.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400"
                        >
                          보기
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {recentUploads.length > 0 && (
              <div className="mt-6">
                <Link href="/data/list">
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 bg-slate-800/50 text-white backdrop-blur-xl hover:bg-slate-800 hover:text-white"
                  >
                    전체 목록 보기
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
