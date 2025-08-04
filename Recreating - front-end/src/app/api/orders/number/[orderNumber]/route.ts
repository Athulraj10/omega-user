import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

// GET /api/orders/number/[orderNumber] - Get order by order number
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const authHeader = request.headers.get("Authorization");

    const { data, status } = await backend.get(`/api/v1/orders/number/${orderNumber}`, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error fetching order by number:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to fetch order" },
      { status: error.response?.status || 500 }
    );
  }
} 