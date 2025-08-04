import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/orders/[id]/cancel - Cancel order
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const authHeader = request.headers.get("Authorization");

    const { data, status } = await backend.patch(`/api/v1/orders/${id}/cancel`, body, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error cancelling order:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to cancel order" },
      { status: error.response?.status || 500 }
    );
  }
} 