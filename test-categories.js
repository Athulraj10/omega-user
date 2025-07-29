const axios = require('axios');

async function testCategoriesAPI() {
  try {
    console.log('Testing categories API...');
    
    // Test the backend API directly
    const backendResponse = await axios.get('http://localhost:5000/api/v1/categories');
    console.log('Backend API Response:', backendResponse.data);
    
    // Test the Next.js API route
    const frontendResponse = await axios.get('http://localhost:3000/api/categories');
    console.log('Frontend API Response:', frontendResponse.data);
    
    console.log('✅ Categories API is working!');
    
  } catch (error) {
    console.error('❌ Error testing categories API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testCategoriesAPI();