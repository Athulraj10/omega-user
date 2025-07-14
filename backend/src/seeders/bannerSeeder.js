const { Banner } = require("../models")

const bannerData = [
   {
      title: "Summer Sale - Up to 50% Off",
      description: "Get amazing discounts on summer collection. Limited time offer!",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
      link: "/products?category=summer",
      linkText: "Shop Now",
      status: "active",
      position: "home",
      priority: 1,
      isActive: true,
      targetAudience: "all",
      deviceType: "all",
   },
   {
      title: "New Arrivals - Fashion Forward",
      description: "Discover the latest trends in fashion. Be the first to shop!",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop",
      link: "/products?category=new-arrivals",
      linkText: "Explore",
      status: "active",
      position: "home",
      priority: 2,
      isActive: true,
      targetAudience: "all",
      deviceType: "all",
   },
   {
      title: "Electronics Deals",
      description: "Best prices on electronics and gadgets. Free shipping on orders over $50!",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop",
      link: "/products?category=electronics",
      linkText: "View Deals",
      status: "active",
      position: "category",
      priority: 1,
      isActive: true,
      targetAudience: "all",
      deviceType: "all",
   },
   {
      title: "Mobile App Exclusive",
      description: "Download our app and get 10% off your first order!",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=300&fit=crop",
      link: "/app-download",
      linkText: "Download App",
      status: "active",
      position: "sidebar",
      priority: 1,
      isActive: true,
      targetAudience: "new",
      deviceType: "mobile",
   },
   {
      title: "Free Shipping on All Orders",
      description: "No minimum purchase required. Shop now and enjoy free shipping!",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop",
      link: "/shipping-info",
      linkText: "Learn More",
      status: "active",
      position: "sidebar",
      priority: 2,
      isActive: true,
      targetAudience: "all",
      deviceType: "all",
   },
   {
      title: "Holiday Collection",
      description: "Perfect gifts for your loved ones. Shop our holiday collection now!",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&h=400&fit=crop",
      link: "/products?category=holiday",
      linkText: "Shop Gifts",
      status: "active",
      position: "home",
      priority: 3,
      isActive: true,
      targetAudience: "all",
      deviceType: "all",
      startDate: new Date("2024-12-01"),
      endDate: new Date("2024-12-31"),
   },
]

const seedBanners = async () => {
   try {
      // Clear existing banners
      await Banner.deleteMany({})
      console.log("Cleared existing banners")

      // Insert new banner data
      const banners = await Banner.insertMany(bannerData)
      console.log(`Seeded ${banners.length} banners successfully`)

      return banners
   } catch (error) {
      console.error("Error seeding banners:", error)
      throw error
   }
}

const clearBanners = async () => {
   try {
      await Banner.deleteMany({})
      console.log("Cleared all banners")
   } catch (error) {
      console.error("Error clearing banners:", error)
      throw error
   }
}

module.exports = {
   seedBanners,
   clearBanners,
} 