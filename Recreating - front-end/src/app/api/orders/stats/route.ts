import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

// GET /api/orders/stats - Get order statistics
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    const { data, status } = await backend.get("/api/v1/orders/stats", {
      headers: {
        Authorization: authHeader || "",
      },
    });

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error fetching order stats:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to fetch order statistics" },
      { status: error.response?.status || 500 }
    );
  }
} 