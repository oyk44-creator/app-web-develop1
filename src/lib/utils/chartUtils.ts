import { ChartMetric } from "@/components/charts/ChartFilters";
import { ChartDataPoint } from "@/components/charts/Chart";

/**
 * Generate mock chart data for a specific metric
 */
export function generateMockChartData(
  metric: ChartMetric,
  count: number = 50
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];

  for (let i = 0; i < count; i++) {
    const time_s = i; // time_s * 10 = milliseconds

    let value: number;
    switch (metric) {
      case "vehicle_speed":
        value = 40 + Math.random() * 80; // 40-120 km/h
        break;
      case "steering_angle":
        value = -45 + Math.random() * 90; // -45 to 45 degrees
        break;
      case "accel_pedal":
        value = Math.random() * 100; // 0-100%
        break;
      case "brake_pedal":
        value = Math.random() * 100; // 0-100%
        break;
      case "gear":
        value = Math.floor(Math.random() * 6); // 0-5
        break;
      case "ap_state":
        value = Math.floor(Math.random() * 2); // 0-1
        break;
      case "acc_set_speed":
        value = 60 + Math.random() * 60; // 60-120 km/h
        break;
      case "lateral_torque":
        value = -5 + Math.random() * 10; // -5 to 5 Nm
        break;
      case "kpi_01_speed_norm":
      case "kpi_02_steer_abs":
      case "kpi_03_accel_load":
      case "kpi_04_brake_intensity":
      case "kpi_05_torque_abs":
      case "kpi_06_autopilot_flag":
      case "kpi_07_cruise_delta":
      case "kpi_08_speed_gradient":
      case "kpi_09_steer_rate":
      case "kpi_10_accel_change":
      case "kpi_11_brake_event":
      case "kpi_12_torque_change":
      case "kpi_13_load_index":
        value = Math.random(); // 0-1 normalized values
        break;
      case "stability_index":
        value = Math.random(); // 0-1
        break;
      case "risk_score":
        value = Math.random(); // 0-1
        break;
      default:
        value = 0;
    }

    data.push({
      time_s,
      value,
    });
  }

  return data;
}

/**
 * Generate mock data for all metrics
 */
export function generateAllMockChartData(
  count: number = 50
): Record<ChartMetric, ChartDataPoint[]> {
  const metrics: ChartMetric[] = [
    "vehicle_speed",
    "steering_angle",
    "accel_pedal",
    "brake_pedal",
    "stability_index",
    "risk_score",
  ];

  const data: Record<ChartMetric, ChartDataPoint[]> = {} as Record<
    ChartMetric,
    ChartDataPoint[]
  >;

  metrics.forEach((metric) => {
    data[metric] = generateMockChartData(metric, count);
  });

  return data;
}

/**
 * Filter chart data by time_s range
 */
export function filterChartDataByDateRange(
  data: ChartDataPoint[],
  startDate: string,
  endDate: string
): ChartDataPoint[] {
  // time_s is numeric, so date filtering doesn't apply
  // This function is kept for compatibility but returns all data
  return data;
}

/**
 * Calculate statistics for chart data
 */
export function calculateChartStatistics(data: ChartDataPoint[]) {
  if (data.length === 0) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      count: 0,
    };
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;

  return {
    min,
    max,
    avg,
    count: data.length,
  };
}
