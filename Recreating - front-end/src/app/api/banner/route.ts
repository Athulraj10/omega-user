import { NextResponse } from "next/server";
import backend from "@/lib/backend";

export async function GET(request: Request) {
  try {
    const response = await backend.get("/api/v1/banner");
    console.log(response, 'response from backend')
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    // console.error("API error:", error);

    return NextResponse.json(
      { message: error.response?.data?.message || "Internal server error" },
      { status: error.response?.status || 500 }
    );
  }
}
