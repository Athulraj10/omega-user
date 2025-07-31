import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("Authorization");
    const { productId } = await params;

    console.log("Updating cart quantity for product ID:", productId, body);

    const { data, status } = await backend.put(`/api/v1/cart/update/${productId}`, body, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error updating cart:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to update cart" },
      { status: error.response?.status || 500 }
    );
  }
} 