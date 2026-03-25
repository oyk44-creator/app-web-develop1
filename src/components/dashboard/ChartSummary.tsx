"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartSummaryProps {
  vehicleSpeedData: number[];
  riskScoreData: number[];
  labels: string[];
}

export function ChartSummary({
  vehicleSpeedData,
  riskScoreData,
  labels,
}: ChartSummaryProps) {
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "차량 속도 (km/h)",
        data: vehicleSpeedData,
        borderColor: CHART_COLORS.vehicle_speed,
        backgroundColor: CHART_COLORS.vehicle_speed + "20",
        borderWidth: 1.5,
        tension: 0.4,
      },
      {
        label: "위험 점수",
        data: riskScoreData,
        borderColor: CHART_COLORS.risk_score,
        backgroundColor: CHART_COLORS.risk_score + "20",
        borderWidth: 1.5,
        tension: 0.4,
      },
    ],
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">주행 데이터 요약</h3>
          <Link href="/charts">
            <Button variant="ghost" size="sm">
              자세히 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="h-[300px]">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
