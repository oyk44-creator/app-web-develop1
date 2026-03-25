"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface KpiSummary {
  total_dist_km: number | null;
  total_energy_wh: number | null;
  total_regen_wh: number | null;
  total_time_s: number | null;
  aggressive_accel_per100: number | null;
  aggressive_brake_per100: number | null;
  high_speed_ratio: number | null;
  stop_go_ratio: number | null;
  accel_rms: number | null;
  coasting_ratio: number | null;
  avg_current: number | null;
  regen_ratio: number | null;
  wh_per_100km: number | null;
  avg_soc: number | null;
  delta_soc: number | null;
  avg_speed: number | null;
  max_speed: number | null;
  idle_per_100km: number | null;
  high_current_ratio: number | null;
  soc_violation_ratio: number | null;
  avg_pack_temp: number | null;
  high_temp_charging_ratio: number | null;
  charging_ratio: number | null;
  max_discharge_current: number | null;
  risk_score: number | null;
}

interface KpiSummaryCardProps {
  kpiSummary: KpiSummary;
  compact?: boolean;
}

export function KpiSummaryCard({
  kpiSummary,
  compact = false,
}: KpiSummaryCardProps) {
  if (compact) {
    return (
      <Card className="rounded-3xl">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">KPI 요약</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">위험 점수:</span>
              <span
                className={`text-lg font-bold ${
                  (kpiSummary.risk_score || 0) >= 50
                    ? "text-red-600"
                    : (kpiSummary.risk_score || 0) >= 30
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {kpiSummary.risk_score?.toFixed(1) || "-"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
            <div className="rounded-lg bg-muted/50 p-2">
              <p className="text-xs text-muted-foreground">총 거리</p>
              <p className="text-sm font-semibold">
                {kpiSummary.total_dist_km?.toFixed(2) || "-"} km
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2">
              <p className="text-xs text-muted-foreground">평균 속도</p>
              <p className="text-sm font-semibold">
                {kpiSummary.avg_speed?.toFixed(1) || "-"} km/h
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2">
              <p className="text-xs text-muted-foreground">최고 속도</p>
              <p className="text-sm font-semibold">
                {kpiSummary.max_speed?.toFixed(1) || "-"} km/h
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2">
              <p className="text-xs text-muted-foreground">에너지 효율</p>
              <p className="text-sm font-semibold">
                {kpiSummary.wh_per_100km?.toFixed(0) || "-"} Wh/100km
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2">
              <p className="text-xs text-muted-foreground">평균 SOC</p>
              <p className="text-sm font-semibold">
                {kpiSummary.avg_soc?.toFixed(1) || "-"}%
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2">
              <p className="text-xs text-muted-foreground">회생 비율</p>
              <p className="text-sm font-semibold">
                {((kpiSummary.regen_ratio || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2">
              <p className="text-xs text-muted-foreground">팩 온도</p>
              <p className="text-sm font-semibold">
                {kpiSummary.avg_pack_temp?.toFixed(1) || "-"}°C
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>KPI 요약</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              종합 위험 점수:
            </span>
            <span
              className={`text-2xl font-bold ${
                (kpiSummary.risk_score || 0) >= 50
                  ? "text-red-600"
                  : (kpiSummary.risk_score || 0) >= 30
                    ? "text-yellow-600"
                    : "text-green-600"
              }`}
            >
              {kpiSummary.risk_score?.toFixed(1) || "-"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {/* 주행량 요약 */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">총 주행거리</p>
            <p className="text-lg font-semibold">
              {kpiSummary.total_dist_km?.toFixed(2) || "-"} km
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">총 주행시간</p>
            <p className="text-lg font-semibold">
              {((kpiSummary.total_time_s || 0) / 60).toFixed(1)} 분
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">평균 속도</p>
            <p className="text-lg font-semibold">
              {kpiSummary.avg_speed?.toFixed(1) || "-"} km/h
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">최고 속도</p>
            <p className="text-lg font-semibold">
              {kpiSummary.max_speed?.toFixed(1) || "-"} km/h
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">에너지 효율</p>
            <p className="text-lg font-semibold">
              {kpiSummary.wh_per_100km?.toFixed(0) || "-"} Wh/100km
            </p>
          </div>

          {/* 안전 지표 */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">급가속 (회/100km)</p>
            <p
              className={`text-lg font-semibold ${(kpiSummary.aggressive_accel_per100 || 0) > 5 ? "text-red-600" : ""}`}
            >
              {kpiSummary.aggressive_accel_per100?.toFixed(1) || "-"}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">급감속 (회/100km)</p>
            <p
              className={`text-lg font-semibold ${(kpiSummary.aggressive_brake_per100 || 0) > 5 ? "text-red-600" : ""}`}
            >
              {kpiSummary.aggressive_brake_per100?.toFixed(1) || "-"}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">가속도 RMS</p>
            <p className="text-lg font-semibold">
              {kpiSummary.accel_rms?.toFixed(3) || "-"} m/s²
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">고속주행 비율</p>
            <p className="text-lg font-semibold">
              {((kpiSummary.high_speed_ratio || 0) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">코스팅 비율</p>
            <p className="text-lg font-semibold">
              {((kpiSummary.coasting_ratio || 0) * 100).toFixed(1)}%
            </p>
          </div>

          {/* 배터리 지표 */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">평균 SOC</p>
            <p className="text-lg font-semibold">
              {kpiSummary.avg_soc?.toFixed(1) || "-"}%
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">SOC 변화량</p>
            <p className="text-lg font-semibold">
              {kpiSummary.delta_soc?.toFixed(1) || "-"}%
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">회생 비율</p>
            <p className="text-lg font-semibold">
              {((kpiSummary.regen_ratio || 0) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">평균 팩 온도</p>
            <p className="text-lg font-semibold">
              {kpiSummary.avg_pack_temp?.toFixed(1) || "-"}°C
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">SOC 위반 비율</p>
            <p
              className={`text-lg font-semibold ${(kpiSummary.soc_violation_ratio || 0) > 0.1 ? "text-yellow-600" : ""}`}
            >
              {((kpiSummary.soc_violation_ratio || 0) * 100).toFixed(1)}%
            </p>
          </div>

          {/* 추가 지표 */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">정차/출발 비율</p>
            <p className="text-lg font-semibold">
              {((kpiSummary.stop_go_ratio || 0) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">평균 전류</p>
            <p className="text-lg font-semibold">
              {kpiSummary.avg_current?.toFixed(1) || "-"} A
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">공회전 (초/100km)</p>
            <p className="text-lg font-semibold">
              {kpiSummary.idle_per_100km?.toFixed(1) || "-"}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">고전류 주행 비율</p>
            <p
              className={`text-lg font-semibold ${(kpiSummary.high_current_ratio || 0) > 0.2 ? "text-yellow-600" : ""}`}
            >
              {((kpiSummary.high_current_ratio || 0) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">최대 방전 전류</p>
            <p className="text-lg font-semibold">
              {kpiSummary.max_discharge_current?.toFixed(1) || "-"} A
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
