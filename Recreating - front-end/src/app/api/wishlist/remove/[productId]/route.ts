import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    const { productId } = await params;

    console.log("Removing from wishlist product ID:", productId);

    const { data, status } = await backend.delete(`/api/v1/wishlist/remove/${productId}`, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    console.log("Backend response status:", status);
    console.log("Wishlist data from backend:", data);

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error removing from wishlist:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to remove from wishlist" },
      { status: error.response?.status || 500 }
    );
  }
} 