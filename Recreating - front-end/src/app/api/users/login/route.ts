// app/api/users/register/route.ts
import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const { data, status } = await backend.post("/api/v1/login", payload);
    console.log({ data })
    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: error.response?.data?.message || "Internal server error" },
      { status: error.response?.status || 500 }
    );
  }
}
