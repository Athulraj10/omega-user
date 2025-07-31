import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("Authorization");

    console.log("Adding to wishlist:", body);

    const { data, status } = await backend.post("/api/v1/wishlist/add", body, {
      headers: {
        Authorization: authHeader || "",
      },
    });



    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error adding to wishlist:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to add to wishlist" },
      { status: error.response?.status || 500 }
    );
  }
} 