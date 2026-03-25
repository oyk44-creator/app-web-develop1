"use client";

import {
  Gauge,
  BatteryCharging,
  Thermometer,
  Zap,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RISK_THRESHOLDS, METRIC_METADATA } from "@/lib/constants";

export interface DataDetail {
  id: string;
  file_name: string;
  upload_date: string;
  data_source: "file" | "manual";
  vehicle_speed: number;
  voltage: number;
  current: number;
  soc: number;
  soh: number;
  battery_temp: number;
  cell_temp_diff?: number;
  timestamp: string;
}

interface DataDetailCardProps {
  data: DataDetail;
}

// Risk level calculation based on RISK_THRESHOLDS
function getRiskLevel(
  metric: "SOC" | "SOH" | "BATTERY_TEMP",
  value: number
): "safe" | "warning" | "danger" {
  const thresholds = RISK_THRESHOLDS[metric];

  if (metric === "SOC" || metric === "SOH") {
    const { safe, warning, danger } = thresholds as {
      safe: { min: number; max: number };
      warning: { min: number; max: number };
      danger: { min: number; max: number };
    };

    if (value >= safe.min && value <= safe.max) return "safe";
    if (value >= warning.min && value <= warning.max) return "warning";
    return "danger";
  }

  if (metric === "BATTERY_TEMP") {
    const temp = thresholds as {
      safe: { min: number; max: number };
      warning: readonly { min: number; max: number }[];
      danger: readonly { min: number; max: number }[];
    };

    if (value >= temp.safe.min && value <= temp.safe.max) return "safe";

    for (const range of temp.danger) {
      if (value >= range.min && value <= range.max) return "danger";
    }

    for (const range of temp.warning) {
      if (value >= range.min && value <= range.max) return "warning";
    }

    return "danger";
  }

  return "safe";
}

function getRiskVariant(
  level: "safe" | "warning" | "danger"
): "default" | "secondary" | "destructive" {
  switch (level) {
    case "safe":
      return "default";
    case "warning":
      return "secondary";
    case "danger":
      return "destructive";
  }
}

function getRiskColorClass(level: "safe" | "warning" | "danger"): string {
  switch (level) {
    case "safe":
      return "text-green-600";
    case "warning":
      return "text-yellow-600";
    case "danger":
      return "text-red-600";
  }
}

function getRiskLabel(level: "safe" | "warning" | "danger"): string {
  switch (level) {
    case "safe":
      return "안전";
    case "warning":
      return "주의";
    case "danger":
      return "위험";
  }
}

export function DataDetailCard({ data }: DataDetailCardProps) {
  const socRisk = getRiskLevel("SOC", data.soc);
  const sohRisk = getRiskLevel("SOH", data.soh);
  const batteryTempRisk = getRiskLevel("BATTERY_TEMP", data.battery_temp);

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="mb-3 text-2xl font-bold">{data.file_name}</h2>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={data.data_source === "file" ? "default" : "secondary"}
            >
              {data.data_source === "file" ? "파일 업로드" : "수기 입력"}
            </Badge>
            <Badge variant="outline">
              업로드: {new Date(data.upload_date).toLocaleString("ko-KR")}
            </Badge>
            <Badge variant="outline">
              측정: {new Date(data.timestamp).toLocaleString("ko-KR")}
            </Badge>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Risk Indicators */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold">위험 지수</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant={getRiskVariant(socRisk)}>
              <BatteryCharging className="mr-1 h-3 w-3" />
              SOC: {getRiskLabel(socRisk)}
            </Badge>
            <Badge variant={getRiskVariant(sohRisk)}>
              <Activity className="mr-1 h-3 w-3" />
              SOH: {getRiskLabel(sohRisk)}
            </Badge>
            <Badge variant={getRiskVariant(batteryTempRisk)}>
              <Thermometer className="mr-1 h-3 w-3" />
              배터리 온도: {getRiskLabel(batteryTempRisk)}
            </Badge>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Measurements */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">측정 데이터</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {/* Vehicle Speed */}
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">차속</span>
                </div>
                <p className="text-3xl font-bold">
                  {data.vehicle_speed.toFixed(1)}
                </p>
                <span className="text-xs text-muted-foreground">km/h</span>
              </CardContent>
            </Card>

            {/* Voltage */}
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-muted-foreground">
                    배터리 전압
                  </span>
                </div>
                <p className="text-3xl font-bold">{data.voltage.toFixed(1)}</p>
                <span className="text-xs text-muted-foreground">V</span>
              </CardContent>
            </Card>

            {/* Current */}
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm text-muted-foreground">전류</span>
                </div>
                <p className="text-3xl font-bold">{data.current.toFixed(1)}</p>
                <span className="text-xs text-muted-foreground">A</span>
              </CardContent>
            </Card>

            {/* SOC */}
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <BatteryCharging
                    className={`h-5 w-5 ${getRiskColorClass(socRisk)}`}
                  />
                  <span className="text-sm text-muted-foreground">
                    SOC (State of Charge)
                  </span>
                </div>
                <p className="text-3xl font-bold">{data.soc.toFixed(1)}</p>
                <span className="text-xs text-muted-foreground">%</span>
              </CardContent>
            </Card>

            {/* SOH */}
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Activity
                    className={`h-5 w-5 ${getRiskColorClass(sohRisk)}`}
                  />
                  <span className="text-sm text-muted-foreground">
                    SOH (State of Health)
                  </span>
                </div>
                <p className="text-3xl font-bold">{data.soh.toFixed(1)}</p>
                <span className="text-xs text-muted-foreground">%</span>
              </CardContent>
            </Card>

            {/* Battery Temperature */}
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Thermometer
                    className={`h-5 w-5 ${getRiskColorClass(batteryTempRisk)}`}
                  />
                  <span className="text-sm text-muted-foreground">
                    배터리 온도
                  </span>
                </div>
                <p className="text-3xl font-bold">
                  {data.battery_temp.toFixed(1)}
                </p>
                <span className="text-xs text-muted-foreground">°C</span>
              </CardContent>
            </Card>

            {/* Cell Temperature Difference (if available) */}
            {data.cell_temp_diff !== undefined && (
              <Card>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-muted-foreground">
                      셀 온도 편차
                    </span>
                  </div>
                  <p className="text-3xl font-bold">
                    {data.cell_temp_diff.toFixed(1)}
                  </p>
                  <span className="text-xs text-muted-foreground">°C</span>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
