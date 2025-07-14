// app/api/users/register/route.ts
import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { data } = await backend.post("/api/v1/email_verify", payload);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: error.response?.data?.message || "Internal server error" },
      { status: error.response?.status || 500 }
    );
  }
}
