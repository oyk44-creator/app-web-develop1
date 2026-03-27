// 사용자 타입
export interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
}

// Tesla KPI 데이터 행 타입 정의
export interface TeslaKpiDataRow {
  id: number;
  upload_id: string;
  user_id: string;
  timestamps: number;
  di_vehicle_speed: number | null;
  di_accel_pedal_pos: number | null;
  dir_torque_actual: number | null;
  dir_torque_command: number | null;
  dif_torque_actual: number | null;
  dif_torque_command: number | null;
  batt_voltage: number | null;
  batt_current: number | null;
  pack_power: number | null;
  drive_power: number | null;
  regen_power: number | null;
  bms_max_pack_temp: number | null;
  bms_min_pack_temp: number | null;
  brick_temp_max: number | null;
  brick_temp_min: number | null;
  brick_voltage_max: number | null;
  brick_voltage_min: number | null;
  brick_voltage_max_num: number | null;
  brick_voltage_min_num: number | null;
  max_discharge_current: number | null;
  max_charge_current: number | null;
  max_voltage: number | null;
  soc_max: number | null;
  soc_ave: number | null;
  soc_ui: number | null;
  soc_min: number | null;
  coolant_temp_bat_inlet: number | null;
  created_at: string;
}

// 차트 데이터 포인트 타입
export interface ChartDataPoint {
  time_s: number;
  value: number;
}

// 차트 데이터 타입
export interface ChartData {
  [key: string]: ChartDataPoint[];
}

// 파일 업로드 타입
export interface FileUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  vehicle_type: string;
  upload_status: "pending" | "processing" | "completed" | "failed";
  storage_path?: string;
  processed_records?: number;
  total_records?: number;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

// 최근 데이터 요약 타입
export interface RecentDataSummary {
  id: string;
  file_name: string;
  upload_date: string;
  data_source: "file" | "manual";
  key_metrics: {
    soc?: number;
    soh?: number;
    battery_temp?: number;
  };
}
