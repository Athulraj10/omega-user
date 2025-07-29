import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    console.log("Getting wishlist count");

    const { data, status } = await backend.get("/api/v1/wishlist/count", {
      headers: {
        Authorization: authHeader || "",
      },
    });

    console.log("Backend response status:", status);
    console.log("Wishlist count from backend:", data);

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error getting wishlist count:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to get wishlist count" },
      { status: error.response?.status || 500 }
    );
  }
} 