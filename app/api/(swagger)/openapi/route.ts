import { NextResponse } from "next/server";
import { generateOpenAPIDocument } from "@/lib/openapi-registry";

/**
 * @openapi
 * /api/openapi:
 *   get:
 *     tags:
 *       - Documentation
 *     summary: Get OpenAPI specification
 *     description: Get the OpenAPI 3.0 specification auto-generated from Zod schemas
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET() {
  try {
    const openAPIDoc = generateOpenAPIDocument();

    return NextResponse.json(openAPIDoc);
  } catch (error) {
    console.error("Error generating OpenAPI document:", error);
    return NextResponse.json(
      { error: "Failed to generate OpenAPI document" },
      { status: 500 }
    );
  }
}
