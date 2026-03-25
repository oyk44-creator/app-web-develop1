"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  CHART_TYPES,
  METRIC_GROUPS_KPI,
  MetricGroupKpiKey,
} from "@/lib/constants";

export type ChartMetric =
  // Legacy tesla_data metrics
  | "vehicle_speed"
  | "steering_angle"
  | "accel_pedal"
  | "brake_pedal"
  | "gear"
  | "ap_state"
  | "acc_set_speed"
  | "lateral_torque"
  | "kpi_01_speed_norm"
  | "kpi_02_steer_abs"
  | "kpi_03_accel_load"
  | "kpi_04_brake_intensity"
  | "kpi_05_torque_abs"
  | "kpi_06_autopilot_flag"
  | "kpi_07_cruise_delta"
  | "kpi_08_speed_gradient"
  | "kpi_09_steer_rate"
  | "kpi_10_accel_change"
  | "kpi_11_brake_event"
  | "kpi_12_torque_change"
  | "kpi_13_load_index"
  | "stability_index"
  | "risk_score"
  // New tesla_kpi_data metrics
  | "di_vehicle_speed"
  | "di_accel_pedal_pos"
  | "dir_torque_actual"
  | "dir_torque_command"
  | "dif_torque_actual"
  | "dif_torque_command"
  | "batt_voltage"
  | "batt_current"
  | "pack_power"
  | "drive_power"
  | "regen_power"
  | "bms_max_pack_temp"
  | "bms_min_pack_temp"
  | "brick_temp_max"
  | "brick_temp_min"
  | "brick_voltage_max"
  | "brick_voltage_min"
  | "max_discharge_current"
  | "max_charge_current"
  | "max_voltage"
  | "soc_max"
  | "soc_ave"
  | "soc_ui"
  | "soc_min"
  | "coolant_temp_bat_inlet"
  // Time Series KPI metrics
  | "accel"
  | "jerk"
  | "energy_wh"
  | "discharge_wh"
  | "regen_wh"
  | "delta_s_km"
  | "event_accel"
  | "event_brake"
  | "highspeed_dist"
  | "soc_violation";

export type ChartType = "line" | "bar" | "area";

export interface ChartFiltersState {
  groups: MetricGroupKpiKey[];
  chartType: ChartType;
}

interface ChartFiltersProps {
  filters: ChartFiltersState;
  onFiltersChange: (filters: ChartFiltersState) => void;
}

const GROUP_OPTIONS: {
  value: MetricGroupKpiKey;
  label: string;
  description: string;
}[] = Object.entries(METRIC_GROUPS_KPI).map(([key, group]) => ({
  value: key as MetricGroupKpiKey,
  label: group.label,
  description: group.description,
}));

const CHART_TYPE_OPTIONS: { value: ChartType; label: string }[] = [
  { value: "line", label: "라인 차트" },
  { value: "bar", label: "바 차트" },
  { value: "area", label: "영역 차트" },
];

export function ChartFilters({ filters, onFiltersChange }: ChartFiltersProps) {
  const handleGroupToggle = (groupKey: MetricGroupKpiKey) => {
    const newGroups = filters.groups.includes(groupKey)
      ? filters.groups.filter((g) => g !== groupKey)
      : [...filters.groups, groupKey];

    onFiltersChange({
      ...filters,
      groups: newGroups,
    });
  };

  const handleChartTypeChange = (chartType: ChartType) => {
    onFiltersChange({
      ...filters,
      chartType,
    });
  };

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>차트 필터</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Group Selection */}
        <div>
          <h4 className="mb-3 text-sm font-medium">
            차트 그룹 선택 (관련 항목들이 묶여 표시됩니다)
          </h4>
          <div className="space-y-3">
            {GROUP_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-start space-x-2">
                <Checkbox
                  id={option.value}
                  checked={filters.groups.includes(option.value)}
                  onCheckedChange={() => handleGroupToggle(option.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={option.value}
                    className="cursor-pointer text-sm font-medium"
                  >
                    {option.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Chart Type Selection */}
        <div>
          <Label
            htmlFor="chart-type"
            className="mb-3 block text-sm font-medium"
          >
            차트 타입
          </Label>
          <Select
            value={filters.chartType}
            onValueChange={(value) => handleChartTypeChange(value as ChartType)}
          >
            <SelectTrigger id="chart-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHART_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
