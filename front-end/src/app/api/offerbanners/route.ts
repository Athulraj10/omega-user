import { NextRequest, NextResponse } from "next/server";

// Mock data for offer banners
const mockOfferBanners = [
  {
    id: 1,
    title: "Special Offer",
    subtitle: "Get 30% off on all dairy products",
    image: "/assets/img/banner/3.jpg",
    link: "/shop-left-sidebar-col-3",
    buttonText: "Shop Now",
    discount: "30% OFF"
  },
  {
    id: 2,
    title: "Flash Sale",
    subtitle: "Limited time offer on fresh fruits",
    image: "/assets/img/banner/4.jpg",
    link: "/shop-left-sidebar-col-3",
    buttonText: "Buy Now",
    discount: "25% OFF"
  }
];

export async function GET(request: NextRequest) {
  return NextResponse.json(mockOfferBanners);
}

export async function POST(request: NextRequest) {
  return NextResponse.json(mockOfferBanners);
} 