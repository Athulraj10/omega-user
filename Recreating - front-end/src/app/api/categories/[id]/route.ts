import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("Getting category data for ID:", id);

    const { data, status } = await backend.get(`/api/v1/categories/${id}`);



    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error getting category:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to get category" },
      { status: error.response?.status || 500 }
    );
  }
}