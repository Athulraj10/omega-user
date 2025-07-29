const mongoose = require('mongoose');
const { seedCategories } = require('./src/seeders/categorySeeder');
const { getConfig } = require('./src/config/config');

async function runSeeder() {
  try {
    const config = getConfig();
    
    // Connect to MongoDB
    await mongoose.connect(config.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Run the seeder
    await seedCategories();
    
    console.log('Seeder completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Seeder failed:', error);
    process.exit(1);
  }
}

runSeeder();