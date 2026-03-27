// 차량 데이터 수집 및 분석 플랫폼 - 상수 정의

// ============================================================================
// 파일 업로드 설정
// ============================================================================

export const FILE_CONFIG = {
  MAX_SIZE_MB: 50,
  MAX_SIZE_BYTES: 50 * 1024 * 1024,
  MAX_FILES_PER_UPLOAD: 10,
  ALLOWED_TYPES: {
    csv: [".csv"],
    excel: [".xlsx", ".xls"],
    dat: [".dat"],
    mat: [".mat"],
  },
  MIME_TYPES: {
    csv: ["text/csv", "application/csv"],
    excel: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ],
    dat: ["application/octet-stream"],
    mat: ["application/octet-stream"],
  },
} as const;

// ============================================================================
// 데이터 검증 범위
// ============================================================================

export const DATA_RANGES = {
  SOC: { min: 0, max: 100, unit: "%" },
  SOH: { min: 0, max: 100, unit: "%" },
  BATTERY_TEMP: { min: -40, max: 80, unit: "°C" },
  VOLTAGE: { min: 0, max: 1000, unit: "V" },
  CURRENT: { min: -500, max: 500, unit: "A" },
  VEHICLE_SPEED: { min: 0, max: 300, unit: "km/h" },
  CELL_TEMP_DIFF: { min: 0, max: 50, unit: "°C" },
} as const;

// ============================================================================
// 컬럼명 매핑 (정규화)
// ============================================================================

export const COLUMN_MAPPING = {
  vehicle_speed: ["차속", "Vehicle Speed", "speed", "velocity", "속도"],
  voltage: ["배터리 전압", "Voltage", "volt", "V", "전압"],
  current: ["전류", "Current", "I", "A"],
  soc: ["SOC", "State of Charge", "soc", "충전상태", "충전량"],
  soh: ["SOH", "State of Health", "soh", "건강상태", "수명"],
  battery_temp: [
    "배터리 온도",
    "Battery Temp",
    "Battery Temperature",
    "battery_temperature",
    "temp",
    "온도",
  ],
  cell_temp_diff: [
    "셀 온도 편차",
    "Cell Temp Diff",
    "Cell Temperature Difference",
    "cell_temp_difference",
    "셀온도편차",
  ],
  timestamp: ["시간", "Time", "Timestamp", "DateTime", "타임스탬프"],
} as const;

// ============================================================================
// 페이지네이션
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  LIMIT_OPTIONS: [10, 20, 50, 100],
} as const;

// ============================================================================
// 차트 색상
// ============================================================================

export const CHART_COLORS = {
  vehicle_speed: "#3b82f6", // blue
  steering_angle: "#10b981", // green
  accel_pedal: "#f59e0b", // amber
  brake_pedal: "#ef4444", // red
  gear: "#6366f1", // indigo
  ap_state: "#8b5cf6", // violet
  acc_set_speed: "#06b6d4", // cyan
  lateral_torque: "#14b8a6", // teal
  kpi_01_speed_norm: "#0ea5e9", // sky (changed from blue)
  kpi_02_steer_abs: "#84cc16", // lime (changed from green)
  kpi_03_accel_load: "#22c55e", // green-500
  kpi_04_brake_intensity: "#f97316", // orange
  kpi_05_torque_abs: "#fb923c", // orange-400
  kpi_06_autopilot_flag: "#ef4444", // red
  kpi_07_cruise_delta: "#ec4899", // pink
  kpi_08_speed_gradient: "#d946ef", // fuchsia
  kpi_09_steer_rate: "#a855f7", // purple
  kpi_10_accel_change: "#8b5cf6", // violet
  kpi_11_brake_event: "#6366f1", // indigo
  kpi_12_torque_change: "#0891b2", // cyan-600
  kpi_13_load_index: "#06b6d4", // cyan
  stability_index: "#14b8a6", // teal
  risk_score: "#ef4444", // red
  // Battery KPI Colors
  di_vehicle_speed: "#3b82f6", // blue
  di_accel_pedal_pos: "#f59e0b", // amber
  dir_torque_actual: "#10b981", // green
  dir_torque_command: "#84cc16", // lime
  dif_torque_actual: "#22c55e", // green-500
  dif_torque_command: "#14b8a6", // teal
  batt_voltage: "#f97316", // orange
  batt_current: "#ef4444", // red
  pack_power: "#8b5cf6", // violet
  drive_power: "#6366f1", // indigo
  regen_power: "#06b6d4", // cyan
  bms_max_pack_temp: "#ef4444", // red
  bms_min_pack_temp: "#3b82f6", // blue
  brick_temp_max: "#f97316", // orange
  brick_temp_min: "#0ea5e9", // sky
  brick_voltage_max: "#a855f7", // purple
  brick_voltage_min: "#d946ef", // fuchsia
  soc_max: "#22c55e", // green-500
  soc_ave: "#10b981", // green
  soc_ui: "#84cc16", // lime
  soc_min: "#f59e0b", // amber
  coolant_temp_bat_inlet: "#0891b2", // cyan-600
  max_discharge_current: "#ef4444", // red
  max_charge_current: "#22c55e", // green-500
  max_voltage: "#f97316", // orange
  // Time Series KPI Colors
  accel: "#22c55e", // green-500
  jerk: "#84cc16", // lime
  energy_wh: "#f59e0b", // amber
  discharge_wh: "#ef4444", // red
  regen_wh: "#06b6d4", // cyan
  delta_s_km: "#3b82f6", // blue
  // Event Colors
  event_accel: "#f97316", // orange
  event_brake: "#ef4444", // red
  highspeed_dist: "#8b5cf6", // violet
  soc_violation: "#dc2626", // red-600
  // Risk Score
  risk_score_kpi: "#ef4444", // red (for KPI data)
} as const;

export const CHART_TYPES = ["line", "bar", "area"] as const;

// ============================================================================
// 차트 메트릭 그룹 (관련 항목들을 묶어서 표시)
// ============================================================================

export const METRIC_GROUPS = {
  safety: {
    label: "종합 안전 지표",
    metrics: ["stability_index", "risk_score"] as const,
    description: "안정성 지수, 위험 점수",
  },
  speed_analysis: {
    label: "속도 분석",
    metrics: [
      "vehicle_speed",
      "kpi_01_speed_norm",
      "kpi_08_speed_gradient",
    ] as const,
    description: "차량 속도, 정규화 속도, 속도 변화율",
  },
  cruise_control: {
    label: "크루즈 컨트롤",
    metrics: ["vehicle_speed", "acc_set_speed", "kpi_07_cruise_delta"] as const,
    description: "실제 속도, ACC 설정 속도, 속도 차이",
  },
  steering_analysis: {
    label: "조향 분석",
    metrics: [
      "steering_angle",
      "kpi_02_steer_abs",
      "kpi_09_steer_rate",
    ] as const,
    description: "조향각, 조향 절대값, 조향 변화율",
  },
  steering_torque: {
    label: "조향 토크",
    metrics: ["steering_angle", "lateral_torque", "kpi_05_torque_abs"] as const,
    description: "조향각, 횡방향 토크, 토크 절대값",
  },
  acceleration: {
    label: "가속 분석",
    metrics: [
      "accel_pedal",
      "kpi_03_accel_load",
      "kpi_10_accel_change",
    ] as const,
    description: "가속 페달, 가속 부하, 가속 변화량",
  },
  braking: {
    label: "브레이크 분석",
    metrics: [
      "brake_pedal",
      "kpi_04_brake_intensity",
      "kpi_11_brake_event",
    ] as const,
    description: "브레이크 페달, 제동 강도, 브레이크 이벤트",
  },
  torque: {
    label: "토크 분석",
    metrics: [
      "lateral_torque",
      "kpi_05_torque_abs",
      "kpi_12_torque_change",
    ] as const,
    description: "횡방향 토크, 토크 절대값, 토크 변화량",
  },
  autopilot: {
    label: "오토파일럿",
    metrics: ["ap_state", "kpi_06_autopilot_flag"] as const,
    description: "오토파일럿 상태, 플래그",
  },
  gear: {
    label: "기어",
    metrics: ["gear"] as const,
    description: "기어 위치",
  },
  load: {
    label: "시스템 부하",
    metrics: ["kpi_13_load_index"] as const,
    description: "시스템 부하 지수",
  },
} as const;

export type MetricGroupKey = keyof typeof METRIC_GROUPS;

// ============================================================================
// 배터리/에너지 KPI 메트릭 그룹
// ============================================================================

export const METRIC_GROUPS_KPI = {
  risk: {
    label: "실시간 위험 점수",
    metrics: ["risk_score"] as const,
    description: "각 시점별 위험도 (0-100)",
  },
  speed_pedal: {
    label: "속도/페달",
    metrics: ["di_vehicle_speed", "di_accel_pedal_pos"] as const,
    description: "차량 속도, 가속 페달 위치",
  },
  accel_jerk: {
    label: "가속도/저크",
    metrics: ["accel", "jerk"] as const,
    description: "가속도 (m/s²), 저크 (m/s³)",
  },
  torque: {
    label: "모터 토크",
    metrics: ["dir_torque_actual", "dif_torque_actual"] as const,
    description: "후방/전방 모터 토크",
  },
  battery_power: {
    label: "배터리 전압/전류",
    metrics: ["batt_voltage", "batt_current"] as const,
    description: "배터리 전압, 전류",
  },
  power_analysis: {
    label: "전력/에너지",
    metrics: ["pack_power", "energy_wh"] as const,
    description: "팩 전력 (W), 에너지 (Wh)",
  },
  energy_detail: {
    label: "방전/회생 에너지",
    metrics: ["discharge_wh", "regen_wh"] as const,
    description: "방전 에너지, 회생 에너지 (Wh)",
  },
  pack_temp: {
    label: "팩 온도",
    metrics: ["bms_max_pack_temp", "bms_min_pack_temp"] as const,
    description: "BMS 최대/최소 팩 온도",
  },
  soc: {
    label: "SOC",
    metrics: ["soc_ave", "soc_ui"] as const,
    description: "평균/UI SOC",
  },
  events: {
    label: "이벤트",
    metrics: ["event_accel", "event_brake"] as const,
    description: "급가속/급감속 이벤트",
  },
  distance: {
    label: "주행 거리",
    metrics: ["delta_s_km", "highspeed_dist"] as const,
    description: "구간 거리, 고속 주행 거리 (km)",
  },
} as const;

export type MetricGroupKpiKey = keyof typeof METRIC_GROUPS_KPI;

// ============================================================================
// 위험 지수 임계값
// ============================================================================

export const RISK_THRESHOLDS = {
  SOC: {
    safe: { min: 50, max: 100 },
    warning: { min: 20, max: 50 },
    danger: { min: 0, max: 20 },
  },
  SOH: {
    safe: { min: 85, max: 100 },
    warning: { min: 70, max: 85 },
    danger: { min: 0, max: 70 },
  },
  BATTERY_TEMP: {
    safe: { min: 10, max: 50 },
    warning: [
      { min: -40, max: 10 },
      { min: 50, max: 60 },
    ],
    danger: [{ min: 60, max: 80 }],
  },
} as const;

// ============================================================================
// 측정 항목 메타데이터
// ============================================================================

export const METRIC_METADATA = {
  vehicle_speed: {
    label: "차량 속도",
    labelEn: "Vehicle Speed",
    unit: "km/h",
    icon: "🚗",
    description: "차량의 현재 속도",
  },
  steering_angle: {
    label: "조향각",
    labelEn: "Steering Angle",
    unit: "도",
    icon: "🎯",
    description: "핸들의 조향 각도",
  },
  accel_pedal: {
    label: "가속 페달",
    labelEn: "Accelerator Pedal",
    unit: "%",
    icon: "⚡",
    description: "가속 페달 위치",
  },
  brake_pedal: {
    label: "브레이크 페달",
    labelEn: "Brake Pedal",
    unit: "%",
    icon: "🛑",
    description: "브레이크 페달 위치",
  },
  gear: {
    label: "기어 위치",
    labelEn: "Gear Position",
    unit: "",
    icon: "⚙️",
    description: "현재 기어 위치",
  },
  ap_state: {
    label: "오토파일럿 상태",
    labelEn: "Autopilot State",
    unit: "",
    icon: "🤖",
    description: "오토파일럿 활성화 상태",
  },
  acc_set_speed: {
    label: "ACC 설정 속도",
    labelEn: "ACC Set Speed",
    unit: "km/h",
    icon: "🎚️",
    description: "크루즈 컨트롤 설정 속도",
  },
  lateral_torque: {
    label: "횡방향 토크",
    labelEn: "Lateral Torque",
    unit: "Nm",
    icon: "🔄",
    description: "횡방향 토크 요청값",
  },
  kpi_01_speed_norm: {
    label: "KPI 01: 속도 정규화",
    labelEn: "KPI 01: Speed Normalization",
    unit: "",
    icon: "📈",
    description: "정규화된 속도 지표",
  },
  kpi_02_steer_abs: {
    label: "KPI 02: 조향 절대값",
    labelEn: "KPI 02: Steering Absolute",
    unit: "",
    icon: "📊",
    description: "조향 각도 절대값",
  },
  kpi_03_accel_load: {
    label: "KPI 03: 가속 부하",
    labelEn: "KPI 03: Acceleration Load",
    unit: "",
    icon: "⚡",
    description: "가속 페달 부하",
  },
  kpi_04_brake_intensity: {
    label: "KPI 04: 브레이크 강도",
    labelEn: "KPI 04: Brake Intensity",
    unit: "",
    icon: "🛑",
    description: "브레이크 강도",
  },
  kpi_05_torque_abs: {
    label: "KPI 05: 토크 절대값",
    labelEn: "KPI 05: Torque Absolute",
    unit: "",
    icon: "🔧",
    description: "토크 절대값",
  },
  kpi_06_autopilot_flag: {
    label: "KPI 06: 오토파일럿 플래그",
    labelEn: "KPI 06: Autopilot Flag",
    unit: "",
    icon: "🚦",
    description: "오토파일럿 활성화 플래그",
  },
  kpi_07_cruise_delta: {
    label: "KPI 07: 크루즈 속도 차이",
    labelEn: "KPI 07: Cruise Delta",
    unit: "",
    icon: "📏",
    description: "설정 속도와 실제 속도 차이",
  },
  kpi_08_speed_gradient: {
    label: "KPI 08: 속도 변화율",
    labelEn: "KPI 08: Speed Gradient",
    unit: "",
    icon: "📉",
    description: "속도 변화율",
  },
  kpi_09_steer_rate: {
    label: "KPI 09: 조향 변화율",
    labelEn: "KPI 09: Steering Rate",
    unit: "",
    icon: "🌀",
    description: "조향 각도 변화율",
  },
  kpi_10_accel_change: {
    label: "KPI 10: 가속 변화량",
    labelEn: "KPI 10: Acceleration Change",
    unit: "",
    icon: "⚡",
    description: "가속 페달 변화량",
  },
  kpi_11_brake_event: {
    label: "KPI 11: 브레이크 이벤트",
    labelEn: "KPI 11: Brake Event",
    unit: "",
    icon: "🚨",
    description: "브레이크 이벤트 감지",
  },
  kpi_12_torque_change: {
    label: "KPI 12: 토크 변화량",
    labelEn: "KPI 12: Torque Change",
    unit: "",
    icon: "🔄",
    description: "토크 변화량",
  },
  kpi_13_load_index: {
    label: "KPI 13: 부하 지수",
    labelEn: "KPI 13: Load Index",
    unit: "",
    icon: "📊",
    description: "시스템 부하 지수",
  },
  stability_index: {
    label: "안정성 지수",
    labelEn: "Stability Index",
    unit: "",
    icon: "📊",
    description: "주행 안정성 지수",
  },
  risk_score: {
    label: "위험 점수",
    labelEn: "Risk Score",
    unit: "",
    icon: "⚠️",
    description: "주행 위험도 점수",
  },
  // Battery KPI Metadata
  di_vehicle_speed: {
    label: "차량 속도",
    labelEn: "Vehicle Speed",
    unit: "km/h",
    icon: "🚗",
    description: "차량 속도",
  },
  di_accel_pedal_pos: {
    label: "가속 페달 위치",
    labelEn: "Accelerator Pedal Position",
    unit: "%",
    icon: "⚡",
    description: "가속 페달 위치",
  },
  dir_torque_actual: {
    label: "후방 모터 실제 토크",
    labelEn: "Rear Motor Actual Torque",
    unit: "Nm",
    icon: "🔧",
    description: "후방 모터 실제 토크",
  },
  dir_torque_command: {
    label: "후방 모터 명령 토크",
    labelEn: "Rear Motor Command Torque",
    unit: "Nm",
    icon: "🔧",
    description: "후방 모터 명령 토크",
  },
  dif_torque_actual: {
    label: "전방 모터 실제 토크",
    labelEn: "Front Motor Actual Torque",
    unit: "Nm",
    icon: "🔧",
    description: "전방 모터 실제 토크",
  },
  dif_torque_command: {
    label: "전방 모터 명령 토크",
    labelEn: "Front Motor Command Torque",
    unit: "Nm",
    icon: "🔧",
    description: "전방 모터 명령 토크",
  },
  batt_voltage: {
    label: "배터리 전압",
    labelEn: "Battery Voltage",
    unit: "V",
    icon: "🔋",
    description: "배터리 전압",
  },
  batt_current: {
    label: "배터리 전류",
    labelEn: "Battery Current",
    unit: "A",
    icon: "⚡",
    description: "배터리 전류",
  },
  pack_power: {
    label: "팩 전력",
    labelEn: "Pack Power",
    unit: "W",
    icon: "⚡",
    description: "배터리 팩 전력 (전압 × 전류)",
  },
  drive_power: {
    label: "방전 전력",
    labelEn: "Drive Power",
    unit: "kW",
    icon: "🔋",
    description: "방전 전력",
  },
  regen_power: {
    label: "회생 전력",
    labelEn: "Regenerative Power",
    unit: "kW",
    icon: "♻️",
    description: "회생 제동 전력",
  },
  bms_max_pack_temp: {
    label: "BMS 최대 팩 온도",
    labelEn: "BMS Max Pack Temperature",
    unit: "°C",
    icon: "🌡️",
    description: "BMS 최대 팩 온도",
  },
  bms_min_pack_temp: {
    label: "BMS 최소 팩 온도",
    labelEn: "BMS Min Pack Temperature",
    unit: "°C",
    icon: "🌡️",
    description: "BMS 최소 팩 온도",
  },
  brick_temp_max: {
    label: "셀 최대 온도",
    labelEn: "Cell Max Temperature",
    unit: "°C",
    icon: "🌡️",
    description: "셀 최대 온도",
  },
  brick_temp_min: {
    label: "셀 최소 온도",
    labelEn: "Cell Min Temperature",
    unit: "°C",
    icon: "🌡️",
    description: "셀 최소 온도",
  },
  brick_voltage_max: {
    label: "셀 최대 전압",
    labelEn: "Cell Max Voltage",
    unit: "V",
    icon: "🔋",
    description: "셀 최대 전압",
  },
  brick_voltage_min: {
    label: "셀 최소 전압",
    labelEn: "Cell Min Voltage",
    unit: "V",
    icon: "🔋",
    description: "셀 최소 전압",
  },
  soc_max: {
    label: "최대 SOC",
    labelEn: "Max SOC",
    unit: "%",
    icon: "🔋",
    description: "최대 충전 상태",
  },
  soc_ave: {
    label: "평균 SOC",
    labelEn: "Average SOC",
    unit: "%",
    icon: "🔋",
    description: "평균 충전 상태",
  },
  soc_ui: {
    label: "UI SOC",
    labelEn: "UI SOC",
    unit: "%",
    icon: "🔋",
    description: "UI 표시 충전 상태",
  },
  soc_min: {
    label: "최소 SOC",
    labelEn: "Min SOC",
    unit: "%",
    icon: "🔋",
    description: "최소 충전 상태",
  },
  coolant_temp_bat_inlet: {
    label: "배터리 냉각수 온도",
    labelEn: "Battery Coolant Inlet Temperature",
    unit: "°C",
    icon: "🌡️",
    description: "배터리 입구 냉각수 온도",
  },
  max_discharge_current: {
    label: "최대 방전 전류",
    labelEn: "Max Discharge Current",
    unit: "A",
    icon: "⚡",
    description: "최대 방전 전류",
  },
  max_charge_current: {
    label: "최대 충전 전류",
    labelEn: "Max Charge Current",
    unit: "A",
    icon: "⚡",
    description: "최대 충전 전류",
  },
  max_voltage: {
    label: "최대 전압",
    labelEn: "Max Voltage",
    unit: "V",
    icon: "🔋",
    description: "최대 전압",
  },
  // Time Series KPI Metadata
  accel: {
    label: "가속도",
    labelEn: "Acceleration",
    unit: "m/s²",
    icon: "📈",
    description: "순간 가속도",
  },
  jerk: {
    label: "저크",
    labelEn: "Jerk",
    unit: "m/s³",
    icon: "📊",
    description: "가속도 변화율",
  },
  energy_wh: {
    label: "에너지",
    labelEn: "Energy",
    unit: "Wh",
    icon: "⚡",
    description: "구간 에너지 소비",
  },
  discharge_wh: {
    label: "방전 에너지",
    labelEn: "Discharge Energy",
    unit: "Wh",
    icon: "🔋",
    description: "방전 에너지",
  },
  regen_wh: {
    label: "회생 에너지",
    labelEn: "Regenerative Energy",
    unit: "Wh",
    icon: "♻️",
    description: "회생 제동 에너지",
  },
  delta_s_km: {
    label: "구간 거리",
    labelEn: "Distance",
    unit: "km",
    icon: "📏",
    description: "구간 주행 거리",
  },
  event_accel: {
    label: "급가속 이벤트",
    labelEn: "Aggressive Acceleration",
    unit: "",
    icon: "⚠️",
    description: "급가속 이벤트 (출력 > 2500W)",
  },
  event_brake: {
    label: "급감속 이벤트",
    labelEn: "Aggressive Braking",
    unit: "",
    icon: "🛑",
    description: "급감속 이벤트 (출력 < -3000W)",
  },
  highspeed_dist: {
    label: "고속 주행 거리",
    labelEn: "High Speed Distance",
    unit: "km",
    icon: "🚀",
    description: "고속 주행 거리 (> 100km/h)",
  },
  soc_violation: {
    label: "SOC 위반",
    labelEn: "SOC Violation",
    unit: "",
    icon: "⚠️",
    description: "SOC 범위 위반 (< 20% 또는 > 80%)",
  },
} as const;

// ============================================================================
// 애플리케이션 설정
// ============================================================================

export const APP_CONFIG = {
  NAME: "퓨처모빌리티AI",
  DESCRIPTION: "차량 데이터 수집 및 분석 웹 플랫폼",
  DEFAULT_LOCALE: "ko",
  SUPPORTED_LOCALES: ["ko", "en"],
} as const;

// ============================================================================
// API 엔드포인트
// ============================================================================

export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    CALLBACK: "/api/auth/callback",
  },
  // 데이터
  DATA: {
    LIST: "/api/data",
    DETAIL: (id: string) => `/api/data/${id}`,
    CREATE: "/api/data",
    UPDATE: (id: string) => `/api/data/${id}`,
    DELETE: (id: string) => `/api/data/${id}`,
    MANUAL: "/api/data/manual",
  },
  // 파일 업로드
  UPLOAD: {
    FILE: "/api/upload",
  },
  // 차트
  CHARTS: {
    DATA: "/api/charts",
  },
  // 대시보드
  DASHBOARD: {
    STATS: "/api/dashboard/stats",
  },
  // 관리자
  ADMIN: {
    USERS: "/api/admin/users",
    DATA: "/api/admin/data",
    STATS: "/api/admin/stats",
    USER_ROLE: (id: string) => `/api/admin/users/${id}/role`,
  },
  // Python API (향후)
  PYTHON: {
    PROCESS: "/api/process-data",
    NORMALIZE: "/api/normalize-columns",
    VALIDATE: "/api/validate",
  },
} as const;

// ============================================================================
// 에러 메시지
// ============================================================================

export const ERROR_MESSAGES = {
  // 인증
  AUTH_REQUIRED: "로그인이 필요합니다.",
  AUTH_FAILED: "인증에 실패했습니다.",
  INVALID_EMAIL: "유효하지 않은 이메일 주소입니다.",

  // 파일 업로드
  FILE_TOO_LARGE: "파일 크기가 너무 큽니다. (최대 50MB)",
  INVALID_FILE_TYPE: "지원하지 않는 파일 형식입니다.",
  UPLOAD_FAILED: "파일 업로드에 실패했습니다.",

  // 데이터 검증
  INVALID_DATA: "유효하지 않은 데이터입니다.",
  OUT_OF_RANGE: "값이 허용 범위를 벗어났습니다.",
  MISSING_REQUIRED_FIELD: "필수 항목이 누락되었습니다.",

  // 일반 오류
  NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
  SERVER_ERROR: "서버 오류가 발생했습니다.",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
} as const;

// ============================================================================
// 성공 메시지
// ============================================================================

export const SUCCESS_MESSAGES = {
  AUTH_SUCCESS: "로그인 링크가 이메일로 전송되었습니다.",
  LOGOUT_SUCCESS: "로그아웃되었습니다.",
  UPLOAD_SUCCESS: "파일이 성공적으로 업로드되었습니다.",
  DATA_CREATED: "데이터가 생성되었습니다.",
  DATA_UPDATED: "데이터가 수정되었습니다.",
  DATA_DELETED: "데이터가 삭제되었습니다.",
  SETTINGS_SAVED: "설정이 저장되었습니다.",
} as const;

// ============================================================================
// 날짜 형식
// ============================================================================

export const DATE_FORMATS = {
  FULL: "yyyy-MM-dd HH:mm:ss",
  DATE: "yyyy-MM-dd",
  TIME: "HH:mm:ss",
  DATETIME: "yyyy-MM-dd HH:mm",
} as const;

// ============================================================================
// 로컬 스토리지 키
// ============================================================================

export const STORAGE_KEYS = {
  USER_SETTINGS: "user_settings",
  THEME: "theme",
  LANGUAGE: "language",
} as const;
