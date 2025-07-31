import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    const { productId } = await params;

    console.log("Removing from cart product ID:", productId);

    const { data, status } = await backend.delete(`/api/v1/cart/remove/${productId}`, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error removing from cart:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to remove from cart" },
      { status: error.response?.status || 500 }
    );
  }
} 