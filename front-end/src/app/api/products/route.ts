import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const queryString = searchParams.toString()

      const response = await fetch(
         `${API_BASE_URL}/api/products${queryString ? `?${queryString}` : ""}`,
         {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
            },
         }
      )

      if (!response.ok) {
         throw new Error(`Backend responded with status: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
   } catch (error: any) {
      console.error("Product API Error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
   }
}

export async function POST(req: NextRequest) {
   try {
      const body = await req.json()

      const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(body),
      })

      const data = await response.json()
      return NextResponse.json(data)
   } catch (error) {
      console.error("Error creating product:", error)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
   }
}
