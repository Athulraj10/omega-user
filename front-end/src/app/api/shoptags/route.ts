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

      // Extract tags from filters or return empty array if not available
      const tags = data.tags || data.filters?.tags || []
      return NextResponse.json(tags)
   } catch (error) {
      console.error("Error fetching tags:", error)
      return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
   }
}
