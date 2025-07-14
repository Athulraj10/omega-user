import { NextResponse } from "next/server";
import backend from "@/lib/backend";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    // console.log("Auth header:", authHeader);

    const response = await backend.get("/api/v1/user_detail", {
      headers: {
        Authorization: authHeader || "",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    // console.error("API error:", error);

    return NextResponse.json(
      { message: error.response?.data?.message || "Internal server error" },
      { status: error.response?.status || 500 }
    );
  }
}
