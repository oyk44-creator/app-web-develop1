"use client";

import { Card } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { CHART_COLORS } from "@/lib/constants";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  vehicle_speed: number[];
  steering_angle: number[];
  risk_score: number[];
}

interface ChartPreviewProps {
  data: ChartData;
}

export function ChartPreview({ data }: ChartPreviewProps) {
  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const vehicleSpeedChartData = {
    labels: data.labels,
    datasets: [
      {
        label: "차량 속도 (km/h)",
        data: data.vehicle_speed,
        borderColor: CHART_COLORS.vehicle_speed,
        backgroundColor: `${CHART_COLORS.vehicle_speed}20`,
        borderWidth: 1.5,
        tension: 0.4,
      },
    ],
  };

  const steeringAngleChartData = {
    labels: data.labels,
    datasets: [
      {
        label: "조향각 (도)",
        data: data.steering_angle,
        borderColor: CHART_COLORS.steering_angle,
        backgroundColor: `${CHART_COLORS.steering_angle}20`,
        borderWidth: 1.5,
        tension: 0.4,
      },
    ],
  };

  const riskScoreChartData = {
    labels: data.labels,
    datasets: [
      {
        label: "위험 점수",
        data: data.risk_score,
        borderColor: CHART_COLORS.risk_score,
        backgroundColor: `${CHART_COLORS.risk_score}20`,
        borderWidth: 1.5,
        tension: 0.4,
      },
    ],
  };

  return (
    <Card className="p-6">
      <h3 className="mb-1 text-lg font-semibold">차트 미리보기</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        주요 지표의 최근 추세를 확인하세요
      </p>

      <div className="flex flex-col gap-8">
        {/* Vehicle Speed Chart */}
        <div>
          <h4 className="mb-2 text-sm font-medium">차량 속도</h4>
          <div className="h-[200px]">
            <Line data={vehicleSpeedChartData} options={chartOptions} />
          </div>
        </div>

        {/* Steering Angle Chart */}
        <div>
          <h4 className="mb-2 text-sm font-medium">조향각</h4>
          <div className="h-[200px]">
            <Line data={steeringAngleChartData} options={chartOptions} />
          </div>
        </div>

        {/* Risk Score Chart */}
        <div>
          <h4 className="mb-2 text-sm font-medium">위험 점수</h4>
          <div className="h-[200px]">
            <Line data={riskScoreChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </Card>
  );
}
