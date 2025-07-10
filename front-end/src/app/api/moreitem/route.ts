import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function GET(req: NextRequest) {
   try {
      const { searchParams } = new URL(req.url)
      const limit = searchParams.get("limit") || "20"

      const response = await fetch(`${API_BASE_URL}/api/v1/products?limit=${limit}`, {
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
      console.error("Error fetching more items:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
   }
}
