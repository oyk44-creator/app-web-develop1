import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get system stats (Admin)
 *     description: Retrieve system statistics (admin only)
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Check if user is authenticated and is an admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from("user_profiles")
      .select("*", { count: "exact", head: true });

    if (usersError) {
      console.error("Error fetching users count:", usersError);
    }

    // Get total data points count
    const { count: totalDataPoints, error: dataError } = await supabase
      .from("tesla_kpi_data")
      .select("*", { count: "exact", head: true });

    if (dataError) {
      console.error("Error fetching data points count:", dataError);
    }

    // Get total file uploads count
    const { count: totalFileUploads, error: filesError } = await supabase
      .from("file_uploads")
      .select("*", { count: "exact", head: true });

    if (filesError) {
      console.error("Error fetching file uploads count:", filesError);
    }

    // Get active users in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: activeUsersLast7Days, error: activeUsersError } =
      await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .gte("last_login_at", sevenDaysAgo.toISOString());

    if (activeUsersError) {
      console.error("Error fetching active users:", activeUsersError);
    }

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalDataPoints: totalDataPoints || 0,
      totalFileUploads: totalFileUploads || 0,
      activeUsersLast7Days: activeUsersLast7Days || 0,
    });
  } catch (error) {
    console.error("Error in admin stats API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
