// 차량 데이터 수집 및 분석 플랫폼 - TypeScript 타입 정의

// ============================================================================
// 사용자 관련 타입
// ============================================================================

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
}

// ============================================================================
// 차량 데이터 타입
// ============================================================================

export interface VehicleData {
  id: string;
  user_id: string;
  file_name: string;
  upload_date: string;
  data_source: "file" | "manual";

  // 측정값
  vehicle_speed?: number; // km/h
  voltage?: number; // V
  current?: number; // A
  soc?: number; // %
  soh?: number; // %
  battery_temp?: number; // °C
  cell_temp_diff?: number; // °C

  // 메타데이터
  timestamp: string; // ISO 8601
  raw_data?: Record<string, any>; // 원본 데이터

  // 시스템 필드
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// ============================================================================
// 파일 업로드 타입
// ============================================================================

export interface FileUpload {
  file: File;
  type: "csv" | "excel" | "dat" | "mat";
  status: "pending" | "uploading" | "processing" | "success" | "error";
  progress: number;
  error?: string;
}

export interface FileUploadHistory {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  status: "pending" | "processing" | "success" | "error";
  error_message?: string;
  processed_rows?: number;
  total_rows?: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 차트 관련 타입
// ============================================================================

export interface ChartDataPoint {
  timestamp: string;
  value: number;
}

export type ChartMetric =
  | "vehicle_speed"
  | "voltage"
  | "current"
  | "soc"
  | "soh"
  | "battery_temp"
  | "cell_temp_diff";

export interface ChartConfig {
  type: "line" | "bar" | "area";
  metric: ChartMetric;
  color: string;
  visible: boolean;
}

export interface ChartFilter {
  metrics: ChartMetric[];
  dateRange?: {
    start: string;
    end: string;
  };
  chartType: "line" | "bar" | "area";
}

// ============================================================================
// API 응답 타입
// ============================================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

// ============================================================================
// 페이지네이션 타입
// ============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// ============================================================================
// 검색 및 필터 타입
// ============================================================================

export interface SearchParams {
  keyword?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  dataSource?: "file" | "manual";
}

export interface FilterOptions {
  dateRange?: {
    start: string;
    end: string;
  };
  dataSource?: ("file" | "manual")[];
  metrics?: ChartMetric[];
}

// ============================================================================
// 대시보드 통계 타입
// ============================================================================

export interface DashboardStats {
  totalData: number;
  avgSoc: number;
  avgSoh: number;
  avgBatteryTemp: number;
}

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

// ============================================================================
// 위험 지수 타입
// ============================================================================

export type RiskLevel = "safe" | "warning" | "danger";

export interface RiskAssessment {
  level: RiskLevel;
  score: number; // 0-100
  factors: {
    soc?: RiskLevel;
    soh?: RiskLevel;
    battery_temp?: RiskLevel;
  };
  message: string;
}

// ============================================================================
// 설정 타입
// ============================================================================

export interface UserSettings {
  chartColors: Record<ChartMetric, string>;
  itemsPerPage: number;
  theme?: "light" | "dark";
  language?: "ko" | "en";
}

// ============================================================================
// 폼 데이터 타입
// ============================================================================

export interface ManualDataInput {
  vehicle_speed?: number;
  voltage?: number;
  current?: number;
  soc?: number;
  soh?: number;
  battery_temp?: number;
  cell_temp_diff?: number;
  timestamp: string;
}

export interface LoginFormData {
  email: string;
}

// ============================================================================
// 관리자 타입
// ============================================================================

export interface AdminStats {
  totalUsers: number;
  totalData: number;
  storageUsedMB: number;
  storageAvailableMB: number;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ============================================================================
// 데이터 검증 타입
// ============================================================================

export interface ValidationRule {
  min?: number;
  max?: number;
  required?: boolean;
  pattern?: RegExp;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// Python API 연동 타입 (향후 사용)
// ============================================================================

export interface ProcessDataRequest {
  data: Partial<VehicleData>[];
  options?: {
    normalize?: boolean;
    fill_missing?: boolean;
  };
}

export interface ProcessDataResponse {
  processed_data: VehicleData[];
  summary: {
    total_rows: number;
    processed_rows: number;
    errors: number;
  };
}
