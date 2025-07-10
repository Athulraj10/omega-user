import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
   try {
      // For now, we'll return a fallback since FAQ endpoints might not be implemented yet
      // You can replace this with actual FAQ API calls when the backend supports them

      // Example of how it would work with a real FAQ API:
      // const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      // const response = await fetch(`${API_BASE_URL}/api/v1/faq`, {
      //   method: 'GET',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // const data = await response.json();
      // return NextResponse.json(data);

      // Fallback response for now
      return NextResponse.json([
         {
            questions: "How do I place an order?",
            ans: "You can place an order by browsing our products, adding them to your cart, and proceeding to checkout.",
         },
         {
            questions: "What payment methods do you accept?",
            ans: "We accept all major credit cards, PayPal, and bank transfers.",
         },
         {
            questions: "How long does shipping take?",
            ans: "Standard shipping takes 3-5 business days. Express shipping is available for faster delivery.",
         },
      ])
   } catch (error) {
      console.error("Error fetching questions:", error)
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
   }
}
