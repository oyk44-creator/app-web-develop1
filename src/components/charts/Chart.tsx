"use client";

import { useRef } from "react";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { ChartType, ChartMetric } from "./ChartFilters";
import { CHART_COLORS, METRIC_METADATA } from "@/lib/constants";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

export interface ChartDataPoint {
  time_s: number;
  value: number;
}

interface ChartProps {
  groupLabel: string;
  groupDescription: string;
  metrics: ChartMetric[];
  data: Record<ChartMetric, ChartDataPoint[]>;
  chartType: ChartType;
}

export function Chart({
  groupLabel,
  groupDescription,
  metrics,
  data,
  chartType,
}: ChartProps) {
  const chartRef = useRef<any>(null);

  // 모든 메트릭의 time_s를 합쳐서 고유한 레이블 생성
  const allTimestamps = new Set<number>();
  metrics.forEach((metric) => {
    data[metric]?.forEach((point) => allTimestamps.add(point.time_s));
  });
  const labels = Array.from(allTimestamps)
    .sort((a, b) => a - b)
    .map((t) => (t * 10).toFixed(0));

  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: groupLabel,
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: function (context: any) {
            const metricKey = metrics[context.datasetIndex];
            const metadata = METRIC_METADATA[metricKey];
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2);
              if (metadata.unit) {
                label += " " + metadata.unit;
              }
            }
            return label;
          },
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x" as const,
        },
        pan: {
          enabled: true,
          mode: "x" as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "값",
        },
      },
      x: {
        title: {
          display: true,
          text: "시간 (ms)",
        },
        ticks: {
          maxTicksLimit: 10,
          autoSkip: true,
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  // RGB 색상 보간 함수
  const interpolateColor = (
    color1: string,
    color2: string,
    factor: number
  ): string => {
    // factor: 0 = color1, 1 = color2
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);

    const r1 = (c1 >> 16) & 0xff;
    const g1 = (c1 >> 8) & 0xff;
    const b1 = c1 & 0xff;

    const r2 = (c2 >> 16) & 0xff;
    const g2 = (c2 >> 8) & 0xff;
    const b2 = c2 & 0xff;

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  // 값에 따른 색상 계산 함수 (부드러운 그라데이션)
  const getColorByValue = (
    metric: ChartMetric,
    value: number | null
  ): string => {
    if (value === null) return CHART_COLORS[metric];

    const green = "#22c55e";
    const orange = "#f97316";
    const red = "#ef4444";

    if (metric === "stability_index") {
      // 안정성 지수: 1.0~0.9 초록, 0.85~0.55 그라데이션(초록→주황), 0.5~0.45 그라데이션(주황→빨강), 0.45~ 빨강
      if (value >= 0.9) return green;
      if (value >= 0.85 && value < 0.9) {
        // 0.85~0.9: 초록에서 주황으로 전환
        const factor = (0.9 - value) / 0.05;
        return interpolateColor(green, orange, factor);
      }
      if (value >= 0.55 && value < 0.85) return orange;
      if (value >= 0.45 && value < 0.55) {
        // 0.45~0.55: 주황에서 빨강으로 전환
        const factor = (0.55 - value) / 0.1;
        return interpolateColor(orange, red, factor);
      }
      return red;
    } else if (metric === "risk_score") {
      // 위험 점수: 0~0.15 초록, 0.15~0.25 그라데이션(초록→주황), 0.25~0.45 주황, 0.45~0.55 그라데이션(주황→빨강), 0.55~ 빨강
      if (value <= 0.15) return green;
      if (value > 0.15 && value <= 0.25) {
        // 0.15~0.25: 초록에서 주황으로 전환
        const factor = (value - 0.15) / 0.1;
        return interpolateColor(green, orange, factor);
      }
      if (value > 0.25 && value <= 0.45) return orange;
      if (value > 0.45 && value <= 0.55) {
        // 0.45~0.55: 주황에서 빨강으로 전환
        const factor = (value - 0.45) / 0.1;
        return interpolateColor(orange, red, factor);
      }
      return red;
    }

    return CHART_COLORS[metric];
  };

  // 각 메트릭별로 dataset 생성
  const datasets = metrics.map((metric) => {
    const metadata = METRIC_METADATA[metric];
    const metricData = data[metric] || [];

    // time_s를 키로 하는 Map 생성
    const dataMap = new Map(
      metricData.map((point) => [point.time_s, point.value])
    );

    // labels에 맞춰서 데이터 정렬 (없는 값은 null)
    const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);
    const values = sortedTimestamps.map((t) => dataMap.get(t) ?? null);

    // 안전 지표는 값에 따라 색상 변경
    const isSafetyMetric =
      metric === "stability_index" || metric === "risk_score";

    if (isSafetyMetric) {
      // segment를 사용하여 값에 따라 색상 변경
      return {
        label: metadata.label,
        data: values,
        borderColor: (context: any) => {
          if (!context.parsed) return CHART_COLORS[metric];
          return getColorByValue(metric, context.parsed.y);
        },
        backgroundColor: (context: any) => {
          if (!context.parsed) return CHART_COLORS[metric];
          const color = getColorByValue(metric, context.parsed.y);
          return chartType === "area" ? `${color}40` : color;
        },
        pointBackgroundColor: values.map((v) => getColorByValue(metric, v)),
        pointBorderColor: values.map((v) => getColorByValue(metric, v)),
        segment: {
          borderColor: (context: any) => {
            const value = context.p1.parsed.y;
            return getColorByValue(metric, value);
          },
          backgroundColor: (context: any) => {
            const value = context.p1.parsed.y;
            const color = getColorByValue(metric, value);
            return chartType === "area" ? `${color}40` : color;
          },
        },
        borderWidth: 1.5,
        tension: 0.4,
        fill: chartType === "area",
        pointRadius: chartType === "line" || chartType === "area" ? 3 : 0,
        pointHoverRadius: 5,
        spanGaps: true,
      };
    }

    return {
      label: metadata.label,
      data: values,
      borderColor: CHART_COLORS[metric],
      backgroundColor:
        chartType === "area"
          ? `${CHART_COLORS[metric]}40`
          : CHART_COLORS[metric],
      borderWidth: 1.5,
      tension: 0.4,
      fill: chartType === "area",
      pointRadius: chartType === "line" || chartType === "area" ? 2 : 0,
      pointHoverRadius: 4,
      spanGaps: true, // null 값을 건너뛰고 연결
    };
  });

  const chartData = {
    labels,
    datasets,
  };

  const handleDownload = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement("a");
      link.href = url;
      link.download = `${groupLabel}_chart_${new Date().toISOString()}.png`;
      link.click();
    }
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <Card className="rounded-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{groupLabel}</p>
          <p className="text-xs text-muted-foreground">{groupDescription}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleResetZoom}>
            줌 리셋
          </Button>
          <Button size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            다운로드
          </Button>
        </div>
      </div>
      <div className="h-[400px]">
        {chartType === "bar" ? (
          <Bar
            ref={chartRef}
            data={chartData}
            options={baseChartOptions as ChartOptions<"bar">}
          />
        ) : (
          <Line
            ref={chartRef}
            data={chartData}
            options={baseChartOptions as ChartOptions<"line">}
          />
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        💡 마우스 휠로 줌인/줌아웃, 드래그로 이동할 수 있습니다.
      </p>
    </Card>
  );
}
