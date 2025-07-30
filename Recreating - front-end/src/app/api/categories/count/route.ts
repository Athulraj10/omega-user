import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Getting categories count");

    const { data, status } = await backend.get("/api/v1/categories/count");

    console.log("Backend response status:", status);
    console.log("Categories count from backend:", data);

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error getting categories count:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to get categories count" },
      { status: error.response?.status || 500 }
    );
  }
}