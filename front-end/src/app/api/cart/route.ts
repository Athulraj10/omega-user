import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Helper function to get auth token from request headers
const getAuthToken = (req: NextRequest) => {
   const authHeader = req.headers.get("authorization")
   return authHeader?.replace("Bearer ", "") || null
}

export async function GET(req: NextRequest) {
   try {
      const token = getAuthToken(req)

      if (!token) {
         return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/cart`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      })

      const data = await response.json()
      return NextResponse.json(data)
   } catch (error) {
      console.error("Error fetching cart:", error)
      return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
   }
}

export async function POST(req: NextRequest) {
   try {
      const token = getAuthToken(req)
      const body = await req.json()

      if (!token) {
         return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/cart/add`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(body),
      })

      const data = await response.json()
      return NextResponse.json(data)
   } catch (error) {
      console.error("Error adding to cart:", error)
      return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
   }
}

export async function PUT(req: NextRequest) {
   try {
      const token = getAuthToken(req)
      const body = await req.json()

      if (!token) {
         return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      const response = await fetch(
         `${API_BASE_URL}/api/v1/cart/update/${body.productId}`,
         {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ quantity: body.quantity }),
         }
      )

      const data = await response.json()
      return NextResponse.json(data)
   } catch (error) {
      console.error("Error updating cart:", error)
      return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
   }
}

export async function DELETE(req: NextRequest) {
   try {
      const token = getAuthToken(req)
      const { searchParams } = new URL(req.url)
      const productId = searchParams.get("productId")

      if (!token) {
         return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      const endpoint = productId
         ? `${API_BASE_URL}/api/v1/cart/remove/${productId}`
         : `${API_BASE_URL}/api/v1/cart/clear`

      const response = await fetch(endpoint, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      })

      const data = await response.json()
      return NextResponse.json(data)
   } catch (error) {
      console.error("Error removing from cart:", error)
      return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
   }
}
