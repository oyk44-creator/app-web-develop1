import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * @openapi
 * /api/data/kpi-summary:
 *   get:
 *     tags:
 *       - Data
 *     summary: Get KPI summary
 *     description: Retrieve KPI summary data
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
export async function GET(request: NextRequest) {
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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const uploadId = searchParams.get("uploadId");

    // 특정 업로드의 KPI 요약 조회
    if (uploadId) {
      const { data: summary, error } = await supabase
        .from("tesla_kpi_summary")
        .select("*")
        .eq("upload_id", uploadId)
        .eq("user_id", user.id)
        .single();

      if (error) {
        return NextResponse.json(
          { error: "KPI summary not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ data: summary });
    }

    // 전체 KPI 요약 목록 조회 (최근 10개)
    const { data: summaries, error } = await supabase
      .from("tesla_kpi_summary")
      .select(
        `
        *,
        file_uploads (
          file_name,
          created_at
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Failed to fetch KPI summaries:", error);
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: 500 }
      );
    }

    // 전체 평균 KPI 계산
    if (summaries && summaries.length > 0) {
      const avgKpis = {
        avg_aggressive_accel:
          summaries.reduce(
            (sum, s) => sum + (s.aggressive_accel_per100 || 0),
            0
          ) / summaries.length,
        avg_aggressive_brake:
          summaries.reduce(
            (sum, s) => sum + (s.aggressive_brake_per100 || 0),
            0
          ) / summaries.length,
        avg_wh_per_100km:
          summaries.reduce((sum, s) => sum + (s.wh_per_100km || 0), 0) /
          summaries.length,
        avg_regen_ratio:
          summaries.reduce((sum, s) => sum + (s.regen_ratio || 0), 0) /
          summaries.length,
        avg_soc:
          summaries.reduce((sum, s) => sum + (s.avg_soc || 0), 0) /
          summaries.length,
        avg_speed:
          summaries.reduce((sum, s) => sum + (s.avg_speed || 0), 0) /
          summaries.length,
        avg_pack_temp:
          summaries.reduce((sum, s) => sum + (s.avg_pack_temp || 0), 0) /
          summaries.length,
        avg_risk_score:
          summaries.reduce((sum, s) => sum + (s.risk_score || 0), 0) /
          summaries.length,
        total_distance: summaries.reduce(
          (sum, s) => sum + (s.total_dist_km || 0),
          0
        ),
        total_energy: summaries.reduce(
          (sum, s) => sum + (s.total_energy_wh || 0),
          0
        ),
        total_regen: summaries.reduce(
          (sum, s) => sum + (s.total_regen_wh || 0),
          0
        ),
      };

      return NextResponse.json({
        data: summaries,
        averages: avgKpis,
        count: summaries.length,
      });
    }

    return NextResponse.json({
      data: summaries || [],
      averages: null,
      count: 0,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
