import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

// GET /api/orders/[id] - Get order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("Authorization");

    const { data, status } = await backend.get(`/api/v1/orders/${id}`, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error fetching order by ID:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to fetch order" },
      { status: error.response?.status || 500 }
    );
  }
} 