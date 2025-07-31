import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    console.log("Getting cart data");

    const { data, status } = await backend.get("/api/v1/cart", {
      headers: {
        Authorization: authHeader || "",
      },
    });

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error getting cart:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to get cart" },
      { status: error.response?.status || 500 }
    );
  }
}
