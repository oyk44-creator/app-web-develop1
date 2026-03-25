import { NextResponse } from "next/server";
import { HealthCheckSchema } from "@/lib/api-schemas";

/**
 * Health check endpoint - validates response with Zod schema
 */
export async function GET() {
  const response = {
    status: "ok",
    message: "API is working!",
    timestamp: new Date().toISOString(),
  };

  // Validate response against Zod schema
  const validatedResponse = HealthCheckSchema.parse(response);

  return NextResponse.json(validatedResponse);
}
