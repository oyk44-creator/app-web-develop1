import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { logError, getIpAddress, getUserAgent } from "@/lib/utils/errorLogger";

// Time Series 데이터 인터페이스
interface TimeSeriesData {
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

interface KPISummary {
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

// 초기화 요청
interface InitRequest {
  type: "init";
  fileName: string;
  fileSize: number;
  totalRecords: number;
}

// 청크 데이터 요청
interface ChunkRequest {
  type: "chunk";
  uploadId: string;
  chunkIndex: number;
  data: TimeSeriesData[];
}

// 완료 요청
interface FinalizeRequest {
  type: "finalize";
  uploadId: string;
  kpiSummary: KPISummary;
  totalRecords: number;
}

type UploadRequest = InitRequest | ChunkRequest | FinalizeRequest;

/**
 * @openapi
 * /api/upload/tesla-kpi:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload Tesla KPI data
 *     description: Upload Tesla KPI CSV data file with chunking support
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload successful
 *       400:
 *         description: Bad request - Invalid file
 *       401:
 *         description: Unauthorized
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          /**
           * @openapi
           * /api/upload/tesla-kpi:
           *   post:
           *     summary: Tesla KPI 청크 업로드
           *     requestBody:
           *       required: true
           *       content:
           *         application/json:
           *           schema:
           *             type: object
           *             properties:
           *               type:
           *                 type: string
           *                 enum: [init, chunk, finalize]
           *               fileName:
           *                 type: string
           *               fileSize:
           *                 type: number
           *               totalRecords:
           *                 type: number
           *               uploadId:
           *                 type: string
           *               chunkIndex:
           *                 type: number
           *               data:
           *                 type: array
           *               kpiSummary:
           *                 type: object
           *     responses:
           *       200:
           *         description: 처리 완료
           *       400:
           *         description: 잘못된 요청
           */
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Server Component에서 호출된 경우 무시
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

    // user_profiles 확인 및 생성
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profile) {
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert({
          id: user.id,
          email: user.email || "",
          full_name:
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User",
          role: "user",
        });

      if (profileError) {
        console.error("Failed to create user profile:", profileError);
        return NextResponse.json(
          { error: "Failed to create user profile" },
          { status: 500 }
        );
      }
    }

    const body: UploadRequest = await request.json();

    // 1. 초기화 요청 처리
    if (body.type === "init") {
      const { fileName, fileSize, totalRecords } = body;

      const { data: uploadRecord, error: uploadError } = await supabase
        .from("file_uploads")
        .insert({
          user_id: user.id,
          file_name: fileName,
          file_size: fileSize,
          file_type: fileName.endsWith(".csv")
            ? "text/csv"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          vehicle_type: "tesla",
          upload_status: "processing",
          storage_path: `${user.id}/${Date.now()}_${fileName}`,
          total_records: totalRecords,
          processed_records: 0,
        })
        .select()
        .single();

      if (uploadError) {
        console.error("Upload record error:", uploadError);
        return NextResponse.json(
          { error: "Failed to create upload record" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        uploadId: uploadRecord.id,
      });
    }

    // 2. 청크 데이터 처리
    if (body.type === "chunk") {
      const { uploadId, data } = body;

      if (!data || data.length === 0) {
        return NextResponse.json(
          { error: "No data in chunk" },
          { status: 400 }
        );
      }

      // DB 삽입용 데이터 변환
      const kpiData = data.map((ts) => ({
        user_id: user.id,
        upload_id: uploadId,
        ...ts,
      }));

      // 삽입
      const { error: insertError } = await supabase
        .from("tesla_kpi_data")
        .insert(kpiData);

      if (insertError) {
        console.error("Tesla KPI data insert error:", insertError);

        // 에러 로깅
        await logError({
          errorType: "database_insert_error",
          errorCode: insertError.code,
          errorMessage: insertError.message,
          context: "file_upload",
          resourceType: "tesla_kpi_data",
          resourceId: uploadId,
          requestPath: "/api/upload/tesla-kpi",
          ipAddress: getIpAddress(request),
          userAgent: getUserAgent(request),
          userId: user.id,
        });

        await supabase
          .from("file_uploads")
          .update({
            upload_status: "failed",
            error_message: `${insertError.message} (code: ${insertError.code})`,
          })
          .eq("id", uploadId);

        return NextResponse.json(
          {
            error: "Failed to insert data into database",
            details: insertError.message,
            code: insertError.code,
          },
          { status: 500 }
        );
      }

      // processed_records 업데이트
      const { data: currentUpload } = await supabase
        .from("file_uploads")
        .select("processed_records")
        .eq("id", uploadId)
        .single();

      const newProcessedCount =
        (currentUpload?.processed_records || 0) + data.length;

      await supabase
        .from("file_uploads")
        .update({ processed_records: newProcessedCount })
        .eq("id", uploadId);

      return NextResponse.json({
        success: true,
        insertedCount: data.length,
        totalProcessed: newProcessedCount,
      });
    }

    // 3. 완료 처리
    if (body.type === "finalize") {
      const { uploadId, kpiSummary, totalRecords } = body;

      // KPI 요약 저장
      const { error: summaryError } = await supabase
        .from("tesla_kpi_summary")
        .insert({
          user_id: user.id,
          upload_id: uploadId,
          ...kpiSummary,
        });

      if (summaryError) {
        console.error("KPI summary insert error:", summaryError);
      }

      // 업로드 완료 처리
      await supabase
        .from("file_uploads")
        .update({
          upload_status: "completed",
          processed_records: totalRecords,
          total_records: totalRecords,
          completed_at: new Date().toISOString(),
        })
        .eq("id", uploadId);

      return NextResponse.json({
        success: true,
        uploadId: uploadId,
        recordsProcessed: totalRecords,
        totalRecords: totalRecords,
        kpiSummary: kpiSummary,
      });
    }

    return NextResponse.json(
      { error: "Invalid request type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Upload error:", error);

    // 에러 로깅
    await logError({
      errorType: "unexpected_error",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      context: "file_upload",
      requestPath: "/api/upload/tesla-kpi",
      ipAddress: getIpAddress(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
