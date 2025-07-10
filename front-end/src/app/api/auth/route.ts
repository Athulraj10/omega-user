import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function POST(req: NextRequest) {
   try {
      const body = await req.json()
      const { action, ...data } = body

      let endpoint = ""
      let method = "POST"

      switch (action) {
         case "login":
            endpoint = "/api/v1/login"
            break
         case "register":
            endpoint = "/api/v1/registration"
            break
         case "logout":
            endpoint = "/api/v1/logout"
            break
         case "forgot-password":
            endpoint = "/api/v1/forgot_password"
            break
         case "reset-password":
            endpoint = "/api/v1/reset_password"
            break
         case "verify-email":
            endpoint = "/api/v1/email_verify"
            break
         case "resend-otp":
            endpoint = "/api/v1/resend_otp"
            break
         default:
            return NextResponse.json({ error: "Invalid action" }, { status: 400 })
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
         method,
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      })

      const responseData = await response.json()
      return NextResponse.json(responseData)
   } catch (error) {
      console.error("Error in authentication:", error)
      return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
   }
}

export async function GET(req: NextRequest) {
   try {
      const { searchParams } = new URL(req.url)
      const action = searchParams.get("action")
      const token = req.headers.get("authorization")?.replace("Bearer ", "")

      if (!token) {
         return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      let endpoint = ""

      switch (action) {
         case "profile":
            endpoint = "/api/v1/user_detail"
            break
         case "username":
            const username = searchParams.get("username")
            endpoint = `/api/v1/username?username=${encodeURIComponent(username || "")}`
            break
         default:
            return NextResponse.json({ error: "Invalid action" }, { status: 400 })
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
      })

      const data = await response.json()
      return NextResponse.json(data)
   } catch (error) {
      console.error("Error fetching user data:", error)
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
   }
}
