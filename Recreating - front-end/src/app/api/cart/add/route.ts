import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("Authorization");

    console.log("Adding to cart:", body);

    const { data, status } = await backend.post("/api/v1/cart/add", body, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    console.log("Backend response status:", status);
    console.log("Cart data from backend:", data);

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error adding to cart:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to add to cart" },
      { status: error.response?.status || 500 }
    );
  }
} 