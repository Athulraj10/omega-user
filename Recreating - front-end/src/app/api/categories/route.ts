import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Getting categories data");

    const { data, status } = await backend.get("/api/v1/categories");

    console.log("Backend response status:", status);
    console.log("Categories data from backend:", data);

    return NextResponse.json(data.data, { status });
  } catch (error: any) {
    console.error("Error getting categories:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to get categories" },
      { status: error.response?.status || 500 }
    );
  }
}