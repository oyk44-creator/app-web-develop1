import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface TeslaDataRow {
  time_s: string;
  can_id_hex: string;
  vehicle_speed_kph: string;
  steering_angle_deg: string;
  accel_pedal_pct: string;
  brake_pedal_pct: string;
  gear: string;
  ap_state: string;
  acc_set_speed_kph: string;
  lateral_torque_request_Nm: string;
  KPI_01_speed_norm: string;
  KPI_02_steer_abs: string;
  KPI_03_accel_load: string;
  KPI_04_brake_intensity: string;
  KPI_05_torque_abs: string;
  KPI_06_autopilot_flag: string;
  KPI_07_cruise_delta: string;
  KPI_08_speed_gradient: string;
  KPI_09_steer_rate: string;
  KPI_10_accel_change: string;
  KPI_11_brake_event: string;
  KPI_12_torque_change: string;
  KPI_13_load_index: string;
  KPI_14_stability_index: string;
  KPI_15_risk_score: string;
}

/**
 * @openapi
 * /api/upload/tesla:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload Tesla data
 *     description: Upload Tesla CSV data file
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
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
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
      // 프로필이 없으면 생성
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 파일 타입 검증
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const allowedExtensions = [".csv", ".xls", ".xlsx"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      return NextResponse.json(
        { error: "Invalid file type. Only CSV and XLSX files are allowed." },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit" },
        { status: 400 }
      );
    }

    // 파일 업로드 기록 생성
    const { data: uploadRecord, error: uploadError } = await supabase
      .from("file_uploads")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        vehicle_type: "tesla",
        upload_status: "processing",
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

    // 파일 파싱 (CSV 또는 XLSX)
    let rows: TeslaDataRow[];

    if (fileExtension === ".csv") {
      // CSV 파일 읽기
      const text = await file.text();

      // CSV 파싱
      const parseResult = await new Promise<Papa.ParseResult<TeslaDataRow>>(
        (resolve, reject) => {
          Papa.parse<TeslaDataRow>(text, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false,
            complete: (results) => resolve(results),
            error: (error: Error) => reject(error),
          });
        }
      );

      if (parseResult.errors.length > 0) {
        await supabase
          .from("file_uploads")
          .update({
            upload_status: "failed",
            error_message: parseResult.errors[0].message,
          })
          .eq("id", uploadRecord.id);

        return NextResponse.json(
          { error: "Failed to parse CSV file" },
          { status: 400 }
        );
      }

      rows = parseResult.data;
    } else {
      // XLSX 파일 읽기
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      // 첫 번째 시트 가져오기
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // 시트를 JSON으로 변환
      const jsonData = XLSX.utils.sheet_to_json<TeslaDataRow>(worksheet, {
        header: 1,
        raw: false,
      });

      if (jsonData.length === 0) {
        await supabase
          .from("file_uploads")
          .update({
            upload_status: "failed",
            error_message: "No data found in XLSX file",
          })
          .eq("id", uploadRecord.id);

        return NextResponse.json(
          { error: "No data found in XLSX file" },
          { status: 400 }
        );
      }

      // 첫 번째 행을 헤더로 사용
      const headers = jsonData[0] as unknown as string[];
      const dataRows = jsonData.slice(1);

      // 헤더를 키로 사용하여 객체 배열 생성
      rows = dataRows.map((row: any) => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] !== undefined ? String(row[index]) : "";
        });
        return obj as TeslaDataRow;
      });
    }

    if (rows.length === 0) {
      await supabase
        .from("file_uploads")
        .update({
          upload_status: "failed",
          error_message: "No data found in file",
        })
        .eq("id", uploadRecord.id);

      return NextResponse.json(
        { error: "No data found in file" },
        { status: 400 }
      );
    }

    // 데이터 변환 및 삽입
    const teslaData = rows.map((row) => ({
      user_id: user.id,
      upload_id: uploadRecord.id,
      time_s: parseFloat(row.time_s) || 0,
      can_id_hex: row.can_id_hex || null,
      vehicle_speed_kph: parseFloat(row.vehicle_speed_kph) || null,
      steering_angle_deg: parseFloat(row.steering_angle_deg) || null,
      accel_pedal_pct: parseFloat(row.accel_pedal_pct) || null,
      brake_pedal_pct: parseFloat(row.brake_pedal_pct) || null,
      gear: parseInt(row.gear) || null,
      ap_state: parseInt(row.ap_state) || null,
      acc_set_speed_kph: parseFloat(row.acc_set_speed_kph) || null,
      lateral_torque_request_nm:
        parseFloat(row.lateral_torque_request_Nm) || null,
      kpi_01_speed_norm: parseFloat(row.KPI_01_speed_norm) || null,
      kpi_02_steer_abs: parseFloat(row.KPI_02_steer_abs) || null,
      kpi_03_accel_load: parseFloat(row.KPI_03_accel_load) || null,
      kpi_04_brake_intensity: parseFloat(row.KPI_04_brake_intensity) || null,
      kpi_05_torque_abs: parseFloat(row.KPI_05_torque_abs) || null,
      kpi_06_autopilot_flag: parseInt(row.KPI_06_autopilot_flag) || null,
      kpi_07_cruise_delta: parseFloat(row.KPI_07_cruise_delta) || null,
      kpi_08_speed_gradient: parseFloat(row.KPI_08_speed_gradient) || null,
      kpi_09_steer_rate: parseFloat(row.KPI_09_steer_rate) || null,
      kpi_10_accel_change: parseFloat(row.KPI_10_accel_change) || null,
      kpi_11_brake_event: parseFloat(row.KPI_11_brake_event) || null,
      kpi_12_torque_change: parseFloat(row.KPI_12_torque_change) || null,
      kpi_13_load_index: parseFloat(row.KPI_13_load_index) || null,
      kpi_14_stability_index: parseFloat(row.KPI_14_stability_index) || null,
      kpi_15_risk_score: parseFloat(row.KPI_15_risk_score) || null,
    }));

    // 배치 삽입 (1000개씩)
    const batchSize = 1000;
    let insertedCount = 0;

    for (let i = 0; i < teslaData.length; i += batchSize) {
      const batch = teslaData.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from("tesla_data")
        .insert(batch);

      if (insertError) {
        console.error("Tesla data insert error:", {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
          batchStart: i,
          batchSize: batch.length,
        });

        await supabase
          .from("file_uploads")
          .update({
            upload_status: "failed",
            error_message: `${insertError.message} (code: ${insertError.code})`,
            processed_records: insertedCount,
            total_records: rows.length,
          })
          .eq("id", uploadRecord.id);

        return NextResponse.json(
          {
            error: "Failed to insert data into database",
            details: insertError.message,
            code: insertError.code,
          },
          { status: 500 }
        );
      }

      insertedCount += batch.length;
    }

    // 업로드 성공 처리
    await supabase
      .from("file_uploads")
      .update({
        upload_status: "completed",
        processed_records: insertedCount,
        total_records: rows.length,
        completed_at: new Date().toISOString(),
      })
      .eq("id", uploadRecord.id);

    return NextResponse.json({
      success: true,
      uploadId: uploadRecord.id,
      recordsProcessed: insertedCount,
      totalRecords: rows.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
