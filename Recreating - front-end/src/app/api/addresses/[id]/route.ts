import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

// PUT /api/addresses/[id] - Update an address
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Received request to update address ID:", params.id);

    const body = await request.json();

    const authHeader = request.headers.get("Authorization");
    console.log("Getting cart data");
    const { data, status } = await backend.put(`/api/v1/addresses/${params.id}`, body, {
      headers: {
        Authorization: authHeader || "",
      },
    });


    
    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error updating address:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to update address" },
      { status: error.response?.status || 500 }
    );
  }
}

// DELETE /api/addresses/[id] - Delete an address
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Received request to delete address ID:", params.id);

    const authHeader = request.headers.get("Authorization");
    console.log("Getting cart data");
    const { data, status } =  await backend.delete(`/api/v1/addresses/${params.id}`, {
      headers: {
        Authorization: authHeader || "",
      },
    });
    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error deleting address:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to delete address" },
      { status: error.response?.status || 500 }
    );
  }
} 