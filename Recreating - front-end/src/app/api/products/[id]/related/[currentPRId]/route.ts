import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
   request: NextRequest,
   { params }: { params: { currentPRId: string } }
) {
   try {
      console.log("Received request for product currentPRId:", params.currentPRId);
      
      const { data, status } = await backend.get(`/api/v1/products/related/${params.currentPRId}`);

    console.log("Backend response status:", status);
    console.log("Product data from backend:", data);

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error("Error fetching product:", error?.response?.data || error.message);

    return NextResponse.json(
      { message: error.response?.data?.message || "Failed to fetch product" },
      { status: error.response?.status || 500 }
    );
  }
}
