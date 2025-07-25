// import { NextRequest, NextResponse } from "next/server"

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//    try {
//       const response = await fetch(`${API_BASE_URL}/api/products/${params.id}`, {
//          method: "GET",
//          headers: {
//             "Content-Type": "application/json",
//          },
//       })

//       if (!response.ok) {
//          throw new Error(`Backend responded with status: ${response.status}`)
//       }

//       const data = await response.json()
//       return NextResponse.json(data)
//    } catch (error: any) {
//       console.error("Product Detail API Error:", error)
//       return NextResponse.json(
//          { error: "Failed to fetch product detail" },
//          { status: 500 }
//       )
//    }import { NextResponse } from "next/server";

export async function GET(
   request: Request,
   { params }: { params: { id: string } }
 ) {
   console.log("API HIT! Params:", params);
   return NextResponse.json({ message: `You hit product ID: ${params.id}` });
 }
 
// }
http://localhost:3000/api/products/test123
