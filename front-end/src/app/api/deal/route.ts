import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function GET(req: NextRequest) {
   try {
      const response = await fetch(`${API_BASE_URL}/api/v1/products/deals`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      })

      if (!response.ok) {
         throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()

      // Transform the response to match the expected format
      return NextResponse.json(data.products || data.data || data)
   } catch (error) {
      console.error("Error fetching deals:", error)
      return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 })
   }
}
