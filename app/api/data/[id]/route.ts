import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * @openapi
 * /api/data/{id}:
 *   get:
 *     tags:
 *       - Data
 *     summary: Get data by ID
 *     description: Retrieve vehicle data by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Data not found
 *   delete:
 *     tags:
 *       - Data
 *     summary: Delete data by ID
 *     description: Delete vehicle data by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data deleted successfully
 *       404:
 *         description: Data not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: uploadId } = await params;

    // Query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = (page - 1) * limit;

    // 파일 업로드 메타데이터 조회
    const { data: upload, error: uploadError } = await supabase
      .from("file_uploads")
      .select("*")
      .eq("id", uploadId)
      .eq("user_id", user.id)
      .single();

    if (uploadError || !upload) {
      return NextResponse.json({ error: "Upload not found" }, { status: 404 });
    }

    // Tesla KPI 데이터 조회 (새로운 테이블 우선)
    let {
      data: teslaData,
      error: dataError,
      count,
    } = await supabase
      .from("tesla_kpi_data")
      .select("*", { count: "exact" })
      .eq("upload_id", uploadId)
      .eq("user_id", user.id)
      .order("timestamps", { ascending: true })
      .range(offset, offset + limit - 1);

    // tesla_kpi_data에 데이터가 없으면 기존 tesla_data 조회 (하위 호환성)
    if (!teslaData || teslaData.length === 0) {
      const result = await supabase
        .from("tesla_data")
        .select("*", { count: "exact" })
        .eq("upload_id", uploadId)
        .eq("user_id", user.id)
        .order("time_s", { ascending: true })
        .range(offset, offset + limit - 1);

      teslaData = result.data;
      dataError = result.error;
      count = result.count;
    }

    if (dataError) {
      console.error("Failed to fetch Tesla data:", dataError);
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      upload,
      data: teslaData || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();

    // 사용자 인증용 클라이언트
    const supabaseAuth = createServerClient(
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
            }
          },
        },
      }
    );

    // 사용자 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: uploadId } = await params;

    // 업로드 정보 확인 (사용자 소유 확인)
    const { data: upload, error: uploadError } = await supabaseAuth
      .from("file_uploads")
      .select("id, user_id, vehicle_type")
      .eq("id", uploadId)
      .eq("user_id", user.id)
      .single();

    if (uploadError || !upload) {
      return NextResponse.json({ error: "Upload not found" }, { status: 404 });
    }

    // Admin 클라이언트 생성 (RLS 우회)
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Tesla 데이터 삭제 (Hard Delete with Admin)
    if (upload.vehicle_type === "tesla") {
      // 먼저 tesla_kpi_data 테이블에서 삭제
      const { error: deleteKpiError, count: deletedKpiCount } =
        await supabaseAdmin
          .from("tesla_kpi_data")
          .delete({ count: "exact" })
          .eq("upload_id", uploadId)
          .eq("user_id", user.id);

      if (deleteKpiError) {
        console.error("Error deleting Tesla KPI data:", deleteKpiError);
        return NextResponse.json(
          {
            error: "Failed to delete Tesla KPI data",
            details: deleteKpiError.message,
          },
          { status: 500 }
        );
      }

      console.log(
        `Deleted ${deletedKpiCount} Tesla KPI data records for upload ${uploadId}`
      );

      // 기존 tesla_data 테이블에서도 삭제 (하위 호환성)
      const { error: deleteDataError, count: deletedDataCount } =
        await supabaseAdmin
          .from("tesla_data")
          .delete({ count: "exact" })
          .eq("upload_id", uploadId)
          .eq("user_id", user.id);

      if (deleteDataError) {
        console.error("Error deleting Tesla data:", deleteDataError);
        return NextResponse.json(
          {
            error: "Failed to delete Tesla data",
            details: deleteDataError.message,
          },
          { status: 500 }
        );
      }

      console.log(
        `Deleted ${deletedDataCount} Tesla data records for upload ${uploadId}`
      );
    }

    // 업로드 레코드 삭제 (Hard Delete with Admin)
    const { error: deleteUploadError, count: deletedUploadCount } =
      await supabaseAdmin
        .from("file_uploads")
        .delete({ count: "exact" })
        .eq("id", uploadId)
        .eq("user_id", user.id);

    if (deleteUploadError) {
      console.error("Error deleting upload record:", deleteUploadError);
      return NextResponse.json(
        {
          error: "Failed to delete upload record",
          details: deleteUploadError.message,
        },
        { status: 500 }
      );
    }

    console.log(
      `Deleted ${deletedUploadCount} upload records for upload ${uploadId}`
    );

    return NextResponse.json({
      success: true,
      message: "Data deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
