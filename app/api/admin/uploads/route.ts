import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * @openapi
 * /api/admin/uploads:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get upload logs (Admin)
 *     description: Retrieve upload logs with pagination (admin only)
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
export async function GET(request: NextRequest) {
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

    // Query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const keyword = searchParams.get("keyword") || "";
    const userId = searchParams.get("userId") || "";

    const offset = (page - 1) * limit;

    // Build query - get all file uploads (without join)
    let query = supabase
      .from("file_uploads")
      .select(
        `
        id,
        user_id,
        file_name,
        file_size,
        file_type,
        vehicle_type,
        upload_status,
        total_records,
        processed_records,
        created_at,
        completed_at
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (keyword) {
      query = query.ilike("file_name", `%${keyword}%`);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    // Execute query with pagination
    const {
      data: uploads,
      error,
      count,
    } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error("Failed to fetch uploads:", error);
      return NextResponse.json(
        { error: "Failed to fetch data", details: error.message },
        { status: 500 }
      );
    }

    // Get unique user IDs from uploads
    const userIds = Array.from(
      new Set(uploads?.map((u: any) => u.user_id).filter(Boolean))
    );

    // Fetch user emails separately
    let userEmailMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from("user_profiles")
        .select("id, email")
        .in("id", userIds);

      if (!usersError && users) {
        userEmailMap = users.reduce((acc: Record<string, string>, u: any) => {
          acc[u.id] = u.email;
          return acc;
        }, {});
      }
    }

    // Transform data to include user email
    const transformedData = uploads?.map((upload: any) => ({
      ...upload,
      user_email: userEmailMap[upload.user_id] || "Unknown",
    }));

    return NextResponse.json({
      data: transformedData || [],
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
