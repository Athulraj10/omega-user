const mongoose = require("mongoose")
const { seedBanners } = require("./src/seeders/bannerSeeder")

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/omega-user"

const runSeeder = async () => {
   try {
      // Connect to MongoDB
      await mongoose.connect(MONGODB_URI)
      console.log("Connected to MongoDB")

      // Run the banner seeder
      await seedBanners()

      console.log("Banner seeding completed successfully")
      process.exit(0)
   } catch (error) {
      console.error("Error running banner seeder:", error)
      process.exit(1)
   }
}

runSeeder() 