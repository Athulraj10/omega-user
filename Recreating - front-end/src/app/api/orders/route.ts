import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("Authorization");

    const { data, status } = await backend.post("/api/v1/orders", body, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error creating order:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to create order" },
      { status: error.response?.status || 500 }
    );
  }
}

// GET /api/orders - Get user's order history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const status = searchParams.get("status");

    const params = new URLSearchParams({
      page,
      limit,
    });

    if (status) {
      params.append("status", status);
    }

    const authHeader = request.headers.get("Authorization");

    const { data, status: responseStatus } = await backend.get(`/api/v1/orders?${params}`, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    return NextResponse.json(data, { status: responseStatus });
  } catch (error: any) {
    console.error("Error fetching orders:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to fetch orders" },
      { status: error.response?.status || 500 }
    );
  }
} 