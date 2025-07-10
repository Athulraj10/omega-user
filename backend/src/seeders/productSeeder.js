const mongoose = require("mongoose")
const { Product } = require("../models")

const sampleProducts = [
   {
      name: "Premium Wireless Headphones",
      slug: "premium-wireless-headphones",
      description:
         "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
      category: "Electronics",
      brand: "AudioTech",
      price: 299.99,
      discountPrice: 249.99,
      images: [
         "/assets/img/product-images/headphones-1.jpg",
         "/assets/img/product-images/headphones-2.jpg",
         "/assets/img/product-images/headphones-3.jpg",
      ],
      imageTwo: "/assets/img/product-images/headphones-2.jpg",
      stock: 50,
      sku: "AUD-001",
      status: "active",
      ratingsAverage: 4.5,
      ratingsCount: 128,
      weight: "250g",
      location: "Online",
      colors: ["Black", "White", "Blue"],
      sizes: ["One Size"],
      tags: ["wireless", "bluetooth", "noise-cancellation"],
      isFeatured: true,
      sale: "Sale",
   },
   {
      name: "Organic Cotton T-Shirt",
      slug: "organic-cotton-tshirt",
      description:
         "Comfortable and eco-friendly organic cotton t-shirt. Available in multiple colors and sizes.",
      category: "Clothing",
      brand: "EcoWear",
      price: 45.0,
      discountPrice: 35.0,
      images: [
         "/assets/img/product-images/tshirt-1.jpg",
         "/assets/img/product-images/tshirt-2.jpg",
      ],
      imageTwo: "/assets/img/product-images/tshirt-2.jpg",
      stock: 100,
      sku: "CLO-001",
      status: "active",
      ratingsAverage: 4.2,
      ratingsCount: 89,
      weight: "150g",
      location: "Online",
      colors: ["White", "Black", "Gray", "Navy"],
      sizes: ["S", "M", "L", "XL"],
      tags: ["organic", "cotton", "sustainable"],
      isFeatured: false,
      sale: "Sale",
   },
   {
      name: "Smart Fitness Watch",
      slug: "smart-fitness-watch",
      description:
         "Advanced fitness tracking watch with heart rate monitor, GPS, and smartphone connectivity.",
      category: "Electronics",
      brand: "FitTech",
      price: 199.99,
      images: [
         "/assets/img/product-images/watch-1.jpg",
         "/assets/img/product-images/watch-2.jpg",
      ],
      imageTwo: "/assets/img/product-images/watch-2.jpg",
      stock: 75,
      sku: "FIT-001",
      status: "active",
      ratingsAverage: 4.7,
      ratingsCount: 156,
      weight: "45g",
      location: "Online",
      colors: ["Black", "Silver", "Rose Gold"],
      sizes: ["Standard"],
      tags: ["fitness", "smartwatch", "health"],
      isFeatured: true,
   },
   {
      name: "Stainless Steel Water Bottle",
      slug: "stainless-steel-water-bottle",
      description:
         "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
      category: "Home & Garden",
      brand: "HydroLife",
      price: 29.99,
      discountPrice: 24.99,
      images: [
         "/assets/img/product-images/bottle-1.jpg",
         "/assets/img/product-images/bottle-2.jpg",
      ],
      imageTwo: "/assets/img/product-images/bottle-2.jpg",
      stock: 200,
      sku: "HYD-001",
      status: "active",
      ratingsAverage: 4.4,
      ratingsCount: 203,
      weight: "400g",
      location: "Online",
      colors: ["Silver", "Black", "Blue", "Pink"],
      sizes: ["500ml", "750ml", "1L"],
      tags: ["insulated", "eco-friendly", "bpa-free"],
      isFeatured: false,
      sale: "Sale",
   },
   {
      name: "Wireless Bluetooth Speaker",
      slug: "wireless-bluetooth-speaker",
      description:
         "Portable wireless speaker with 360-degree sound and waterproof design. Perfect for outdoor activities.",
      category: "Electronics",
      brand: "SoundWave",
      price: 89.99,
      images: [
         "/assets/img/product-images/speaker-1.jpg",
         "/assets/img/product-images/speaker-2.jpg",
      ],
      imageTwo: "/assets/img/product-images/speaker-2.jpg",
      stock: 60,
      sku: "SOU-001",
      status: "active",
      ratingsAverage: 4.3,
      ratingsCount: 94,
      weight: "500g",
      location: "Online",
      colors: ["Black", "White", "Red"],
      sizes: ["Standard"],
      tags: ["bluetooth", "portable", "waterproof"],
      isFeatured: true,
   },
   {
      name: "Yoga Mat Premium",
      slug: "yoga-mat-premium",
      description:
         "Non-slip yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and fitness activities.",
      category: "Sports",
      brand: "YogaLife",
      price: 59.99,
      discountPrice: 49.99,
      images: [
         "/assets/img/product-images/yoga-mat-1.jpg",
         "/assets/img/product-images/yoga-mat-2.jpg",
      ],
      imageTwo: "/assets/img/product-images/yoga-mat-2.jpg",
      stock: 80,
      sku: "SPO-001",
      status: "active",
      ratingsAverage: 4.6,
      ratingsCount: 67,
      weight: "2kg",
      location: "Online",
      colors: ["Purple", "Blue", "Green", "Pink"],
      sizes: ["Standard", "Extra Long"],
      tags: ["yoga", "fitness", "eco-friendly"],
      isFeatured: false,
      sale: "Sale",
   },
   {
      name: "Coffee Maker Automatic",
      slug: "coffee-maker-automatic",
      description:
         "Programmable coffee maker with built-in grinder and multiple brewing options.",
      category: "Home & Garden",
      brand: "BrewMaster",
      price: 149.99,
      images: [
         "/assets/img/product-images/coffee-maker-1.jpg",
         "/assets/img/product-images/coffee-maker-2.jpg",
      ],
      imageTwo: "/assets/img/product-images/coffee-maker-2.jpg",
      stock: 30,
      sku: "HOM-001",
      status: "active",
      ratingsAverage: 4.8,
      ratingsCount: 112,
      weight: "3.5kg",
      location: "Online",
      colors: ["Black", "Stainless Steel"],
      sizes: ["Standard"],
      tags: ["coffee", "automatic", "programmable"],
      isFeatured: true,
   },
   {
      name: "Running Shoes Lightweight",
      slug: "running-shoes-lightweight",
      description:
         "Lightweight running shoes with superior cushioning and breathable mesh upper.",
      category: "Sports",
      brand: "RunFast",
      price: 129.99,
      discountPrice: 109.99,
      images: [
         "/assets/img/product-images/shoes-1.jpg",
         "/assets/img/product-images/shoes-2.jpg",
      ],
      imageTwo: "/assets/img/product-images/shoes-2.jpg",
      stock: 45,
      sku: "SPO-002",
      status: "active",
      ratingsAverage: 4.5,
      ratingsCount: 178,
      weight: "300g",
      location: "Online",
      colors: ["Black/Red", "White/Blue", "Gray/Orange"],
      sizes: ["7", "8", "9", "10", "11", "12"],
      tags: ["running", "lightweight", "cushioned"],
      isFeatured: true,
      sale: "Sale",
   },
]

const seedProducts = async () => {
   try {
      // Clear existing products
      await Product.deleteMany({})
      console.log("Cleared existing products")

      // Insert new products
      const insertedProducts = await Product.insertMany(sampleProducts)
      console.log(`Successfully seeded ${insertedProducts.length} products`)

      return insertedProducts
   } catch (error) {
      console.error("Error seeding products:", error)
      throw error
   }
}

module.exports = { seedProducts, sampleProducts }
