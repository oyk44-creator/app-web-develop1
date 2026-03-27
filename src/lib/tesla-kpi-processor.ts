import Papa from "papaparse";
import * as XLSX from "xlsx";

// Tesla 원본 센서 데이터 인터페이스
interface TeslaRawDataRow {
  timestamps: string;
  DI_vehicleSpeed: string;
  DI_accelPedalPos: string;
  DIR_torqueActual: string;
  DIR_torqueCommand: string;
  DIF_torqueActual: string;
  DIF_torqueCommand: string;
  BattVoltage132: string;
  RawBattCurrent132: string;
  BMSmaxPackTemperature: string;
  BMSminPackTemperature: string;
  BattBrickTempMax332: string;
  BattBrickTempMin332: string;
  BattBrickVoltageMax332: string;
  BattBrickVoltageMin332: string;
  BattBrickVoltageMaxNum332: string;
  BattBrickVoltageMinNum332: string;
  MaxDischargeCurrent2D2: string;
  MaxChargeCurrent2D2: string;
  MaxVoltage2D2: string;
  SOCmax292: string;
  SOCave292: string;
  SOCUI292: string;
  SOCmin292: string;
  VCFRONT_tempCoolantBatInlet: string;
  ChargeLineVoltage264: string;
  [key: string]: string | undefined;
}

// Time Series 계산 결과 인터페이스
export interface TimeSeriesData {
  timestamps: number;
  di_vehicle_speed: number | null;
  di_accel_pedal_pos: number | null;
  dir_torque_actual: number | null;
  dir_torque_command: number | null;
  dif_torque_actual: number | null;
  dif_torque_command: number | null;
  batt_voltage: number | null;
  batt_current: number | null;
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
  charge_line_voltage: number | null;
  delta_t: number | null;
  speed_mps: number | null;
  delta_v: number | null;
  accel: number | null;
  jerk: number | null;
  pack_power: number | null;
  energy_wh: number | null;
  discharge_wh: number | null;
  regen_wh: number | null;
  delta_s_km: number | null;
  event_accel: number;
  event_brake: number;
  highspeed_dist: number | null;
  stop_time: number | null;
  idle_time: number | null;
  soc_violation: number;
  high_current_dist: number | null;
  risk_score: number | null;
}

export interface KPISummary {
  total_dist_km: number;
  total_energy_wh: number;
  total_regen_wh: number;
  total_time_s: number;
  aggressive_accel_per100: number;
  aggressive_brake_per100: number;
  high_speed_ratio: number;
  stop_go_ratio: number;
  accel_rms: number;
  coasting_ratio: number;
  avg_current: number;
  regen_ratio: number;
  wh_per_100km: number;
  avg_soc: number;
  delta_soc: number;
  avg_speed: number;
  max_speed: number;
  idle_per_100km: number;
  high_current_ratio: number;
  soc_violation_ratio: number;
  avg_pack_temp: number;
  high_temp_charging_ratio: number;
  charging_ratio: number;
  max_discharge_current: number;
  risk_score: number;
}

export interface ProcessResult {
  timeSeriesData: TimeSeriesData[];
  kpiSummary: KPISummary;
  totalRecords: number;
}

// 20개 KPI 계산 함수
function calculate20KPIs(data: TimeSeriesData[]): KPISummary {
  const totalDistKm = data.reduce((sum, d) => sum + (d.delta_s_km || 0), 0);
  const totalEnergyWh = data.reduce((sum, d) => sum + (d.discharge_wh || 0), 0);
  const totalRegenWh = data.reduce((sum, d) => sum + (d.regen_wh || 0), 0);
  const totalTimeS = data.reduce((sum, d) => sum + (d.delta_t || 0), 0);

  const safeDist = totalDistKm || 1;

  // KPI 1: AggressiveAccel_per100
  const aggressiveAccelPer100 =
    (data.reduce((sum, d) => sum + d.event_accel, 0) / safeDist) * 100;

  // KPI 2: AggressiveBrake_per100
  const aggressiveBrakePer100 =
    (data.reduce((sum, d) => sum + d.event_brake, 0) / safeDist) * 100;

  // KPI 3: HighSpeedRatio
  const highSpeedDist = data.reduce(
    (sum, d) => sum + (d.highspeed_dist || 0),
    0
  );
  const highSpeedRatio = highSpeedDist / safeDist;

  // KPI 4: StopGoRatio
  const stopGoDist = data.reduce((sum, d) => {
    if ((d.di_vehicle_speed || 0) < 5) {
      return sum + (d.delta_s_km || 0);
    }
    return sum;
  }, 0);
  const stopGoRatio = stopGoDist / safeDist;

  // KPI 5: Accel_RMS
  const accelSquares = data
    .filter((d) => d.accel !== null)
    .map((d) => (d.accel || 0) ** 2);
  const accelRms =
    accelSquares.length > 0
      ? Math.sqrt(accelSquares.reduce((a, b) => a + b, 0) / accelSquares.length)
      : 0;

  // KPI 6: CoastingRatio
  const coastingDist = data.reduce((sum, d) => {
    const accel = d.accel || 0;
    const speed = d.di_vehicle_speed || 0;
    if (accel > -0.3 && accel < 0.3 && speed > 30) {
      return sum + (d.delta_s_km || 0);
    }
    return sum;
  }, 0);
  const coastingRatio = coastingDist / safeDist;

  // KPI 7: AvgCurrent
  const currents = data
    .filter((d) => d.batt_current !== null)
    .map((d) => d.batt_current || 0);
  const avgCurrent =
    currents.length > 0
      ? currents.reduce((a, b) => a + b, 0) / currents.length
      : 0;

  // KPI 8: RegenRatio
  const totalEnergy = totalRegenWh + totalEnergyWh;
  const regenRatio = totalEnergy > 0 ? totalRegenWh / totalEnergy : 0;

  // KPI 9: Wh_per100km
  const whPer100km = (totalEnergyWh / safeDist) * 100;

  // KPI 10: AvgSOC
  const socs = data.filter((d) => d.soc_ui !== null).map((d) => d.soc_ui || 0);
  const avgSoc =
    socs.length > 0 ? socs.reduce((a, b) => a + b, 0) / socs.length : 0;

  // KPI 11: DeltaSOC
  const socValues = data
    .filter((d) => d.soc_ui !== null)
    .map((d) => d.soc_ui || 0);
  const deltaSoc =
    socValues.length > 0 ? Math.max(...socValues) - Math.min(...socValues) : 0;

  // KPI 12: AvgSpeed
  const speeds = data
    .filter((d) => d.di_vehicle_speed !== null)
    .map((d) => d.di_vehicle_speed || 0);
  const avgSpeed =
    speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;

  // KPI 13: MaxSpeed
  const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;

  // KPI 14: Idle_per100km
  const idleTime = data.reduce((sum, d) => sum + (d.idle_time || 0), 0);
  const idlePer100km = (idleTime / safeDist) * 100;

  // KPI 15: HighCurrentRatio
  const highCurrentDist = data.reduce(
    (sum, d) => sum + (d.high_current_dist || 0),
    0
  );
  const highCurrentRatio = highCurrentDist / safeDist;

  // KPI 16: SOCViolationRatio
  const socViolationRatio =
    data.length > 0
      ? data.reduce((sum, d) => sum + d.soc_violation, 0) / data.length
      : 0;

  // KPI 17: AvgPackTemp
  const temps = data
    .filter((d) => d.bms_max_pack_temp !== null)
    .map((d) => d.bms_max_pack_temp || 0);
  const avgPackTemp =
    temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : 0;

  // KPI 18: HighTempChargingRatio
  const highTempChargingCount = data.filter(
    (d) => (d.charge_line_voltage || 0) > 0 && (d.bms_max_pack_temp || 0) > 40
  ).length;
  const highTempChargingRatio =
    data.length > 0 ? highTempChargingCount / data.length : 0;

  // KPI 19: ChargingRatio
  const chargingCount = data.filter(
    (d) => (d.charge_line_voltage || 0) > 0
  ).length;
  const chargingRatio = data.length > 0 ? chargingCount / data.length : 0;

  // KPI 20: MaxDischargeCurrent
  const maxDischargeCurrent = currents.length > 0 ? Math.max(...currents) : 0;

  // Risk Score 계산
  const riskFactors = [
    { value: aggressiveAccelPer100, threshold: 10, weight: 0.15 },
    { value: aggressiveBrakePer100, threshold: 10, weight: 0.15 },
    { value: accelRms, threshold: 2, weight: 0.1 },
    { value: whPer100km, threshold: 20000, weight: 0.1 },
    { value: socViolationRatio, threshold: 0.3, weight: 0.15 },
    { value: highCurrentRatio, threshold: 0.3, weight: 0.1 },
    {
      value: avgPackTemp > 35 ? (avgPackTemp - 35) / 10 : 0,
      threshold: 1,
      weight: 0.1,
    },
    { value: 1 - regenRatio, threshold: 1, weight: 0.15 },
  ];

  const riskScore =
    riskFactors.reduce((score, factor) => {
      const normalized = Math.min(1, factor.value / factor.threshold);
      return score + normalized * factor.weight;
    }, 0) * 100;

  return {
    total_dist_km: totalDistKm,
    total_energy_wh: totalEnergyWh,
    total_regen_wh: totalRegenWh,
    total_time_s: totalTimeS,
    aggressive_accel_per100: aggressiveAccelPer100,
    aggressive_brake_per100: aggressiveBrakePer100,
    high_speed_ratio: highSpeedRatio,
    stop_go_ratio: stopGoRatio,
    accel_rms: accelRms,
    coasting_ratio: coastingRatio,
    avg_current: avgCurrent,
    regen_ratio: regenRatio,
    wh_per_100km: whPer100km,
    avg_soc: avgSoc,
    delta_soc: deltaSoc,
    avg_speed: avgSpeed,
    max_speed: maxSpeed,
    idle_per_100km: idlePer100km,
    high_current_ratio: highCurrentRatio,
    soc_violation_ratio: socViolationRatio,
    avg_pack_temp: avgPackTemp,
    high_temp_charging_ratio: highTempChargingRatio,
    charging_ratio: chargingRatio,
    max_discharge_current: maxDischargeCurrent,
    risk_score: riskScore,
  };
}

// 파일 파싱 함수
async function parseFile(file: File): Promise<TeslaRawDataRow[]> {
  const fileExtension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));

  if (fileExtension === ".csv") {
    const text = await file.text();
    return new Promise((resolve, reject) => {
      Papa.parse<TeslaRawDataRow>(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(results.errors[0].message));
          } else {
            resolve(results.data);
          }
        },
        error: (error: Error) => reject(error),
      });
    });
  } else {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const jsonData = XLSX.utils.sheet_to_json<TeslaRawDataRow>(worksheet, {
      header: 1,
      raw: false,
    });

    if (jsonData.length === 0) {
      throw new Error("No data found in XLSX file");
    }

    const headers = jsonData[0] as unknown as string[];
    const dataRows = jsonData.slice(1);

    return dataRows.map((row: any) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] !== undefined ? String(row[index]) : "";
      });
      return obj as TeslaRawDataRow;
    });
  }
}

// 메인 처리 함수
export async function processTeslaKpiFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ProcessResult> {
  // 1. 파일 파싱 (10%)
  onProgress?.(10);
  const rows = await parseFile(file);

  if (rows.length === 0) {
    throw new Error("No data found in file");
  }

  // 2. Time Series 계산 (10% ~ 80%)
  const timeSeriesData: TimeSeriesData[] = [];
  let prevTimestamp = 0;
  let prevSpeedMps = 0;
  let prevAccel = 0;
  let prevPower = 0;

  const totalRows = rows.length;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const timestamp = parseFloat(row.timestamps) || 0;
    const speed = parseFloat(row.DI_vehicleSpeed) || 0;
    const voltage = parseFloat(row.BattVoltage132) || 0;
    const current = parseFloat(row.RawBattCurrent132) || 0;
    const soc = parseFloat(row.SOCUI292) || parseFloat(row.SOCave292) || 0;

    const speedMps = (speed * 1000) / 3600;
    const power = voltage * current;

    let deltaT: number | null = null;
    let deltaV: number | null = null;
    let accel: number | null = null;
    let jerk: number | null = null;
    let energyWh: number | null = null;
    let dischargeWh: number | null = null;
    let regenWh: number | null = null;
    let deltaSKm: number | null = null;

    if (i > 0) {
      deltaT = timestamp - prevTimestamp;
      if (deltaT > 0) {
        deltaV = speedMps - prevSpeedMps;
        accel = deltaV / deltaT;
        jerk = (accel - prevAccel) / deltaT;
        energyWh = (((power + prevPower) / 2) * deltaT) / 3600;
        dischargeWh = current > 0 ? energyWh : 0;
        regenWh = current < 0 ? -energyWh : 0;
        deltaSKm = (speedMps * deltaT) / 1000;
      }
    }

    // 이벤트 계산
    const eventAccel = power > 2500 ? 1 : 0;
    const eventBrake = power < -3000 ? 1 : 0;
    const highspeedDist = speed > 120 && deltaSKm ? deltaSKm : 0;
    const stopTime = speed < 1 && deltaT ? deltaT : 0;
    const idleTime = speed < 1 && Math.abs(power) < 2000 && deltaT ? deltaT : 0;
    const socViolation = soc < 20 || soc > 90 ? 1 : 0;
    const highCurrentDist = Math.abs(current) > 250 && deltaSKm ? deltaSKm : 0;

    // 실시간 위험 점수 계산
    let riskScore = 0;
    if (eventAccel) riskScore += 20;
    if (eventBrake) riskScore += 20;

    const accelAbs = Math.abs(accel || 0);
    if (accelAbs > 3) riskScore += 20;
    else if (accelAbs > 2) riskScore += 15;
    else if (accelAbs > 1.5) riskScore += 10;
    else if (accelAbs > 1) riskScore += 5;

    if (speed > 140) riskScore += 15;
    else if (speed > 120) riskScore += 10;
    else if (speed > 100) riskScore += 5;

    if (soc < 10 || soc > 95) riskScore += 15;
    else if (socViolation) riskScore += 10;

    if (Math.abs(current) > 300) riskScore += 10;
    else if (Math.abs(current) > 250) riskScore += 5;

    riskScore = Math.min(100, riskScore);

    const tsData: TimeSeriesData = {
      timestamps: timestamp,
      di_vehicle_speed: speed || null,
      di_accel_pedal_pos: parseFloat(row.DI_accelPedalPos) || null,
      dir_torque_actual: parseFloat(row.DIR_torqueActual) || null,
      dir_torque_command: parseFloat(row.DIR_torqueCommand) || null,
      dif_torque_actual: parseFloat(row.DIF_torqueActual) || null,
      dif_torque_command: parseFloat(row.DIF_torqueCommand) || null,
      batt_voltage: voltage || null,
      batt_current: current || null,
      bms_max_pack_temp: parseFloat(row.BMSmaxPackTemperature) || null,
      bms_min_pack_temp: parseFloat(row.BMSminPackTemperature) || null,
      brick_temp_max: parseFloat(row.BattBrickTempMax332) || null,
      brick_temp_min: parseFloat(row.BattBrickTempMin332) || null,
      brick_voltage_max: parseFloat(row.BattBrickVoltageMax332) || null,
      brick_voltage_min: parseFloat(row.BattBrickVoltageMin332) || null,
      brick_voltage_max_num: parseInt(row.BattBrickVoltageMaxNum332) || null,
      brick_voltage_min_num: parseInt(row.BattBrickVoltageMinNum332) || null,
      max_discharge_current: parseFloat(row.MaxDischargeCurrent2D2) || null,
      max_charge_current: parseFloat(row.MaxChargeCurrent2D2) || null,
      max_voltage: parseFloat(row.MaxVoltage2D2) || null,
      soc_max: parseFloat(row.SOCmax292) || null,
      soc_ave: parseFloat(row.SOCave292) || null,
      soc_ui: parseFloat(row.SOCUI292) || null,
      soc_min: parseFloat(row.SOCmin292) || null,
      coolant_temp_bat_inlet:
        parseFloat(row.VCFRONT_tempCoolantBatInlet) || null,
      charge_line_voltage: parseFloat(row.ChargeLineVoltage264) || null,
      delta_t: deltaT,
      speed_mps: speedMps || null,
      delta_v: deltaV,
      accel: accel,
      jerk: jerk,
      pack_power: power || null,
      energy_wh: energyWh,
      discharge_wh: dischargeWh,
      regen_wh: regenWh,
      delta_s_km: deltaSKm,
      event_accel: eventAccel,
      event_brake: eventBrake,
      highspeed_dist: highspeedDist,
      stop_time: stopTime,
      idle_time: idleTime,
      soc_violation: socViolation,
      high_current_dist: highCurrentDist,
      risk_score: riskScore,
    };

    timeSeriesData.push(tsData);

    prevTimestamp = timestamp;
    prevSpeedMps = speedMps;
    prevAccel = accel || 0;
    prevPower = power;

    // 진행률 업데이트 (10% ~ 80%)
    if (i % 1000 === 0) {
      const progress = 10 + Math.round((i / totalRows) * 70);
      onProgress?.(progress);
    }
  }

  // 3. KPI 요약 계산 (80% ~ 90%)
  onProgress?.(85);
  const kpiSummary = calculate20KPIs(timeSeriesData);

  onProgress?.(90);

  return {
    timeSeriesData,
    kpiSummary,
    totalRecords: rows.length,
  };
}
