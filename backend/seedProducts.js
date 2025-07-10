const mongoose = require("mongoose")
const { seedProducts } = require("./src/seeders/productSeeder")
require("dotenv").config()

const connectDB = async () => {
   try {
      await mongoose.connect(
         process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce"
      )
      console.log("MongoDB connected successfully")
   } catch (error) {
      console.error("MongoDB connection error:", error)
      process.exit(1)
   }
}

const runSeeder = async () => {
   try {
      await connectDB()
      await seedProducts()
      console.log("Product seeding completed successfully")
      process.exit(0)
   } catch (error) {
      console.error("Error running seeder:", error)
      process.exit(1)
   }
}

runSeeder()
