"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ChartFilters,
  ChartFiltersState,
  ChartMetric,
} from "@/components/charts/ChartFilters";
import { KpiSummaryCard, KpiSummary } from "@/components/data/KpiSummaryCard";
import { METRIC_GROUPS_KPI, MetricGroupKpiKey } from "@/lib/constants";
import { motion } from "framer-motion";

// Dynamically import Chart to avoid SSR issues with Chart.js
const Chart = dynamic(
  () => import("@/components/charts/Chart").then((mod) => mod.Chart),
  { ssr: false }
);

interface FileUpload {
  id: string;
  file_name: string;
  created_at: string;
}

export default function ChartsPage() {
  // Initialize filters with default groups
  const [filters, setFilters] = useState<ChartFiltersState>({
    groups: ["risk", "speed_pedal"] as MetricGroupKpiKey[], // Default selection
    chartType: "line",
  });

  const [chartData, setChartData] = useState<Record<ChartMetric, any[]>>(
    {} as Record<ChartMetric, any[]>
  );
  const [kpiSummary, setKpiSummary] = useState<KpiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataPointCount, setDataPointCount] = useState(0);

  // File selection
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [selectedUploadId, setSelectedUploadId] = useState<string>("");
  const [loadingUploads, setLoadingUploads] = useState(true);

  // Fetch upload list
  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const response = await fetch("/api/data/uploads?limit=100");
        if (!response.ok) {
          throw new Error("Failed to fetch uploads");
        }
        const result = await response.json();
        const uploadList = result.data || [];
        setUploads(uploadList);

        // 첫 번째 파일을 자동 선택
        if (uploadList.length > 0 && !selectedUploadId) {
          setSelectedUploadId(uploadList[0].id);
        }
      } catch (error) {
        console.error("Error fetching uploads:", error);
      } finally {
        setLoadingUploads(false);
      }
    };

    fetchUploads();
  }, []);

  // Fetch chart data based on selected upload
  useEffect(() => {
    const fetchChartData = async () => {
      // 파일이 선택되지 않았으면 데이터 가져오지 않음
      if (!selectedUploadId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: "1000",
          uploadId: selectedUploadId,
        });

        const response = await fetch(`/api/charts/data?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const result = await response.json();
        console.log("Chart data response:", result);
        console.log("Data point count:", result.count);
        console.log("Chart data keys:", Object.keys(result.data || {}));
        setChartData(result.data);
        setDataPointCount(result.count);

        // KPI 요약 데이터 가져오기
        const summaryResponse = await fetch(
          `/api/data/kpi-summary?uploadId=${selectedUploadId}`
        );
        if (summaryResponse.ok) {
          const summaryResult = await summaryResponse.json();
          setKpiSummary(summaryResult.data);
        } else {
          setKpiSummary(null);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        toast.error("차트 데이터를 불러오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedUploadId]);

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 tracking-tight">차트 뷰</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            측정 항목별 데이터를 시각화하여 분석하세요
          </p>
        </div>

        {/* File Selection and Info */}
        <div className="mb-4 space-y-4">
          {/* File Selection */}
          <Card className="rounded-3xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="file-select"
                  className="min-w-fit text-sm font-medium"
                >
                  데이터 파일:
                </Label>
                <Select
                  value={selectedUploadId}
                  onValueChange={setSelectedUploadId}
                  disabled={loadingUploads}
                >
                  <SelectTrigger id="file-select" className="max-w-md">
                    <SelectValue placeholder="파일을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {uploads.map((upload) => (
                      <SelectItem key={upload.id} value={upload.id}>
                        {upload.file_name} (
                        {new Date(upload.created_at).toLocaleDateString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Info Alert */}
          <Alert className="rounded-2xl">
            <AlertDescription className="text-sm">
              <strong>데이터 포인트:</strong> {dataPointCount}개 |{" "}
              <strong>선택된 그룹:</strong> {filters.groups.length}개
            </AlertDescription>
          </Alert>

          {/* KPI Summary */}
          {kpiSummary && <KpiSummaryCard kpiSummary={kpiSummary} />}
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Filters Sidebar */}
          <div className="w-full flex-shrink-0 md:w-[300px]">
            <ChartFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Charts Area */}
          <div className="min-w-0 flex-1">
            {loading ? (
              <Card className="rounded-3xl">
                <CardContent className="p-12 text-center">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    차트 데이터를 불러오는 중...
                  </p>
                </CardContent>
              </Card>
            ) : filters.groups.length === 0 ? (
              <Card className="rounded-3xl">
                <CardContent className="p-8 text-center">
                  <h3 className="mb-2 text-lg font-semibold text-muted-foreground">
                    차트 그룹을 선택해주세요
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    왼쪽 필터에서 최소 1개 이상의 차트 그룹을 선택하면 차트가
                    표시됩니다.
                  </p>
                </CardContent>
              </Card>
            ) : dataPointCount === 0 ? (
              <Card className="rounded-3xl">
                <CardContent className="p-8 text-center">
                  <h3 className="mb-2 text-lg font-semibold text-muted-foreground">
                    데이터가 없습니다
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    선택한 기간에 데이터가 없습니다. 먼저 Tesla 데이터를
                    업로드해주세요.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filters.groups.map((groupKey) => {
                  const group = METRIC_GROUPS_KPI[groupKey];
                  return (
                    <Chart
                      key={groupKey}
                      groupLabel={group.label}
                      groupDescription={group.description}
                      metrics={[...group.metrics] as ChartMetric[]}
                      data={chartData}
                      chartType={filters.chartType}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <Card className="mt-4 rounded-3xl bg-muted/50">
          <CardContent className="p-4">
            <p className="mb-2 text-sm font-semibold">💡 사용 팁</p>
            <ul className="list-disc space-y-1 pl-5">
              <li className="text-sm">
                관련 있는 메트릭들이 그룹으로 묶여 하나의 차트에 표시됩니다.
              </li>
              <li className="text-sm">
                속도 분석, 조향 분석, 가속/브레이크 분석 등 다양한 주행 패턴을
                분석할 수 있습니다.
              </li>
              <li className="text-sm">
                각 차트의 &quot;다운로드&quot; 버튼을 클릭하여 PNG 이미지로
                저장할 수 있습니다.
              </li>
              <li className="text-sm">
                마우스 휠로 줌인/줌아웃, 드래그로 차트를 이동할 수 있습니다.
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
