import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    const { productId } = await params;

    console.log("Checking wishlist status for product ID:", productId);

    const { data, status } = await backend.get(`/api/v1/wishlist/check/${productId}`, {
      headers: {
        Authorization: authHeader || "",
      },
    });



    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error checking wishlist status:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to check wishlist status" },
      { status: error.response?.status || 500 }
    );
  }
} 