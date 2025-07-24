import Deal from "../../../utility/data/deal";
import { NextResponse } from "next/server";
import backend from "@/lib/backend";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const response = await backend.get("/api/v1/deals", {
      headers: {
        Authorization: authHeader || "",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
    // return NextResponse.json(Deal, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || "Internal server error" },
      { status: error.response?.status || 500 }
    );
  }
}
