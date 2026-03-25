/**
 * @openapi
 * /api/charts/data:
 *   get:
 *     tags:
 *       - Charts
 *     summary: Get chart data
 *     description: Retrieve data for charts with time range filtering
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *         description: Time range filter
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *         description: Metric key
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 이 라우트는 쿠키 기반 인증을 위해 항상 동적 처리
export const revalidate = 0; // 캐시 비활성화

export async function GET(request: NextRequest) {
  try {
    // cookies() 는 비동기이므로 await 필요
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore
            }
          },
        },
      }
    );

    // 사용자 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const uploadId = searchParams.get("uploadId") || "";
    const limit = parseInt(searchParams.get("limit") || "1000");

    // 먼저 tesla_kpi_data (배터리/에너지 KPI) 조회 시도
    let kpiQuery = supabase
      .from("tesla_kpi_data")
      .select("*")
      .eq("user_id", user.id)
      .order("timestamps", { ascending: true });

    if (uploadId) {
      kpiQuery = kpiQuery.eq("upload_id", uploadId);
    }

    const { data: kpiData } = await kpiQuery.limit(limit);

    // tesla_kpi_data에 데이터가 있으면 사용
    if (kpiData && kpiData.length > 0) {
      const chartData = {
        // 기본 측정값
        di_vehicle_speed: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.di_vehicle_speed || 0,
        })),
        di_accel_pedal_pos: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.di_accel_pedal_pos || 0,
        })),
        batt_voltage: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.batt_voltage || 0,
        })),
        batt_current: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.batt_current || 0,
        })),
        pack_power: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.pack_power || 0,
        })),
        soc_ave: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.soc_ave || 0,
        })),
        soc_ui: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.soc_ui || 0,
        })),
        bms_max_pack_temp: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.bms_max_pack_temp || 0,
        })),
        bms_min_pack_temp: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.bms_min_pack_temp || 0,
        })),
        coolant_temp_bat_inlet: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.coolant_temp_bat_inlet || 0,
        })),
        dir_torque_actual: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.dir_torque_actual || 0,
        })),
        dif_torque_actual: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.dif_torque_actual || 0,
        })),
        // Time Series 계산 KPI
        accel: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.accel || 0,
        })),
        jerk: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.jerk || 0,
        })),
        energy_wh: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.energy_wh || 0,
        })),
        discharge_wh: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.discharge_wh || 0,
        })),
        regen_wh: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.regen_wh || 0,
        })),
        delta_s_km: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.delta_s_km || 0,
        })),
        // 이벤트 플래그
        event_accel: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.event_accel || 0,
        })),
        event_brake: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.event_brake || 0,
        })),
        highspeed_dist: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.highspeed_dist || 0,
        })),
        soc_violation: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.soc_violation || 0,
        })),
        // 실시간 위험 점수
        risk_score: kpiData.map((row: any) => ({
          time_s: row.timestamps,
          value: row.risk_score || 0,
        })),
      };

      return NextResponse.json({
        data: chartData,
        count: kpiData.length,
        dataType: "kpi",
      });
    }

    // tesla_kpi_data가 없으면 기존 tesla_data 조회 (하위 호환성)
    let query = supabase
      .from("tesla_data")
      .select(
        `
        time_s,
        vehicle_speed_kph,
        steering_angle_deg,
        accel_pedal_pct,
        brake_pedal_pct,
        gear,
        ap_state,
        acc_set_speed_kph,
        lateral_torque_request_nm,
        kpi_01_speed_norm,
        kpi_02_steer_abs,
        kpi_03_accel_load,
        kpi_04_brake_intensity,
        kpi_05_torque_abs,
        kpi_06_autopilot_flag,
        kpi_07_cruise_delta,
        kpi_08_speed_gradient,
        kpi_09_steer_rate,
        kpi_10_accel_change,
        kpi_11_brake_event,
        kpi_12_torque_change,
        kpi_13_load_index,
        kpi_14_stability_index,
        kpi_15_risk_score,
        created_at
      `
      )
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("time_s", { ascending: true });

    // 특정 업로드 ID가 지정된 경우
    if (uploadId) {
      query = query.eq("upload_id", uploadId);
    }

    // 날짜 범위 필터
    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      query = query.lte("created_at", endDateTime.toISOString());
    }

    // 데이터 조회 (limit 적용)
    const { data: teslaData, error } = await query.limit(limit);

    if (error) {
      console.error("Failed to fetch chart data:", error);
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: 500 }
      );
    }

    // 차트 데이터 형식으로 변환 (ChartDataPoint[] 형식)
    const chartData = {
      vehicle_speed:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.vehicle_speed_kph || 0,
        })) || [],
      steering_angle:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.steering_angle_deg || 0,
        })) || [],
      accel_pedal:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.accel_pedal_pct || 0,
        })) || [],
      brake_pedal:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.brake_pedal_pct || 0,
        })) || [],
      gear:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.gear || 0,
        })) || [],
      ap_state:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.ap_state || 0,
        })) || [],
      acc_set_speed:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.acc_set_speed_kph || 0,
        })) || [],
      lateral_torque:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.lateral_torque_request_nm || 0,
        })) || [],
      kpi_01_speed_norm:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_01_speed_norm || 0,
        })) || [],
      kpi_02_steer_abs:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_02_steer_abs || 0,
        })) || [],
      kpi_03_accel_load:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_03_accel_load || 0,
        })) || [],
      kpi_04_brake_intensity:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_04_brake_intensity || 0,
        })) || [],
      kpi_05_torque_abs:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_05_torque_abs || 0,
        })) || [],
      kpi_06_autopilot_flag:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_06_autopilot_flag || 0,
        })) || [],
      kpi_07_cruise_delta:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_07_cruise_delta || 0,
        })) || [],
      kpi_08_speed_gradient:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_08_speed_gradient || 0,
        })) || [],
      kpi_09_steer_rate:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_09_steer_rate || 0,
        })) || [],
      kpi_10_accel_change:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_10_accel_change || 0,
        })) || [],
      kpi_11_brake_event:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_11_brake_event || 0,
        })) || [],
      kpi_12_torque_change:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_12_torque_change || 0,
        })) || [],
      kpi_13_load_index:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_13_load_index || 0,
        })) || [],
      stability_index:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_14_stability_index || 0,
        })) || [],
      risk_score:
        teslaData?.map((row) => ({
          time_s: row.time_s,
          value: row.kpi_15_risk_score || 0,
        })) || [],
    };

    return NextResponse.json({
      data: chartData,
      count: teslaData?.length || 0,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
