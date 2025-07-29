import backend from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Health check - testing backend connectivity");
    
    // Test basic backend connectivity
    const { data, status } = await backend.get("/api/v1/health", {
      timeout: 5000 // 5 second timeout
    });

    console.log("Backend health check response:", { status, data });

    return NextResponse.json({
      success: true,
      message: "Backend is accessible",
      backendStatus: status,
      backendData: data,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Backend health check failed:", error?.response?.data || error.message);

    return NextResponse.json({
      success: false,
      message: "Backend is not accessible",
      error: error?.response?.data?.message || error.message,
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
} 