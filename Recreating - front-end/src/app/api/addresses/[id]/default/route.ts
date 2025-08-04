import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/addresses/[id]/default - Set address as default
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("Received request to set address as default ID:", id);

    console.log("Received request for user addresses");
    const authHeader = request.headers.get("Authorization");
    console.log("Getting cart data",authHeader);
    const { data, status } = await backend.patch(`/api/v1/addresses/${id}/default`, {
      headers: {
        Authorization: authHeader || "",
      },
    });

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error setting default address:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to set default address" },
      { status: error.response?.status || 500 }
    );
  }
} 