import { NextRequest, NextResponse } from "next/server";

// Mock data for banners
const mockBanners = [
  {
    id: 1,
    title: "Fresh Organic Vegetables",
    subtitle: "Get 20% off on all organic vegetables",
    image: "/assets/img/banner/1.jpg",
    link: "/shop-left-sidebar-col-3",
    buttonText: "Shop Now",
    position: "left"
  },
  {
    id: 2,
    title: "Premium Quality Fruits",
    subtitle: "Handpicked fresh fruits delivered to your door",
    image: "/assets/img/banner/2.jpg",
    link: "/shop-left-sidebar-col-3",
    buttonText: "Explore",
    position: "right"
  }
];

export async function GET(request: NextRequest) {
  return NextResponse.json(mockBanners);
}

export async function POST(request: NextRequest) {
  return NextResponse.json(mockBanners);
} 