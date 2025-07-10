import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function GET(req: NextRequest) {
   try {
      const response = await fetch(`${API_BASE_URL}/api/v1/products/filters`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      })

      if (!response.ok) {
         throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()

      // Extract colors from filters or return empty array if not available
      const colors = data.colors || data.filters?.colors || []
      return NextResponse.json(colors)
   } catch (error) {
      console.error("Error fetching colors:", error)
      return NextResponse.json({ error: "Failed to fetch colors" }, { status: 500 })
   }
}
