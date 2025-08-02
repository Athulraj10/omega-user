import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

// GET /api/addresses - Get all addresses for the authenticated user
export async function GET(request: NextRequest) {
  try {
    console.log("Received request for user addresses");

    const { data, status } = await backend.get("/api/v1/addresses");

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
    console.log("Received request to create address");

    const body = await request.json();
    const { data, status } = await backend.post("/api/v1/addresses", body);

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error creating address:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to create address" },
      { status: error.response?.status || 500 }
    );
  }
} 