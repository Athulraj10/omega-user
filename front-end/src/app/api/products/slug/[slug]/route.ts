import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export async function GET(
   request: NextRequest,
   { params }: { params: { slug: string } }
) {
   try {
      const response = await fetch(`${API_BASE_URL}/api/products/slug/${params.slug}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      })

      if (!response.ok) {
         throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
   } catch (error: any) {
      console.error("Product Slug API Error:", error)
      return NextResponse.json(
         { error: "Failed to fetch product by slug" },
         { status: 500 }
      )
   }
}
