import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

// GET /api/addresses - Get all addresses for the authenticated user
export async function GET(request: NextRequest) {
  try {
    console.log("Received request for user addresses");
    const authHeader = request.headers.get("Authorization");
    console.log("Getting cart data");
    const { data, status } = await backend.get("/api/v1/addresses", {
      headers: {
        Authorization: authHeader || "",
      },
    });


    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error fetching addresses:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to fetch addresses" },
      { status: error.response?.status || 500 }
    );
  }
}

// POST /api/addresses - Create a new address
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("Authorization");

    console.log("Adding to cart:", body);

    const { data, status } = await backend.post("/api/v1/addresses", body, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error adding to cart:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to add to cart" },
      { status: error.response?.status || 500 }
    );
  }
} 