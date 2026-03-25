import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserProfileSchema, ErrorSchema } from "@/lib/api-schemas";

/**
 * Get current user - validated with Zod schema
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const error = ErrorSchema.parse({
      error: "Unauthorized",
      message: "User not authenticated",
    });
    return NextResponse.json(error, { status: 401 });
  }

  const { data, error: dbError } = await supabase
    .from("user_profiles")
    .select("id, email, full_name, avatar_url, role, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (dbError) {
    const error = ErrorSchema.parse({
      error: "Database Error",
      message: dbError.message,
    });
    return NextResponse.json(error, { status: 500 });
  }

  if (!data) {
    const error = ErrorSchema.parse({
      error: "Not Found",
      message: "User profile not found",
    });
    return NextResponse.json(error, { status: 404 });
  }

  // Validate response with Zod schema
  const validatedProfile = UserProfileSchema.parse(data);

  return NextResponse.json(validatedProfile, { status: 200 });
}
