import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function POST(req: NextRequest) {
   try {
      const body = await req.json()
      const {
         searchTerm = "",
         sortOption = "1",
         page = 1,
         limit = 10,
         selectedCategory = [],
         selectedWeight = [],
         selectedColor = [],
         selectedTags = [],
         range = { min: 0, max: 250 },
      } = body

      // Build query parameters for the backend
      const params = new URLSearchParams()

      if (searchTerm) params.append("search", searchTerm)
      if (page) params.append("page", page.toString())
      if (limit) params.append("limit", limit.toString())
      if (sortOption) params.append("sort", sortOption)
      if (selectedCategory.length > 0)
         params.append("categories", selectedCategory.join(","))
      if (selectedWeight.length > 0) params.append("weights", selectedWeight.join(","))
      if (selectedColor.length > 0) params.append("colors", selectedColor.join(","))
      if (selectedTags.length > 0) params.append("tags", selectedTags.join(","))
      if (range.min !== undefined) params.append("minPrice", range.min.toString())
      if (range.max !== undefined) params.append("maxPrice", range.max.toString())

      const queryString = params.toString()

      const response = await fetch(
         `${API_BASE_URL}/api/v1/products${queryString ? `?${queryString}` : ""}`,
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

      // Transform the response to match the expected format
      return NextResponse.json({
         data: data.products || data.data || data,
         totalItems:
            data.totalItems || data.total || (data.products ? data.products.length : 0),
         currentPage: parseInt(page),
         totalPages:
            data.totalPages ||
            Math.ceil((data.totalItems || data.total || 0) / parseInt(limit)),
      })
   } catch (error) {
      console.error("Error fetching shop items:", error)
      return NextResponse.json(
         {
            error: "Failed to fetch products",
            data: [],
            totalItems: 0,
            currentPage: 1,
            totalPages: 0,
         },
         { status: 500 }
      )
   }
}
