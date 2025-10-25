const axios = require('axios');

const checkBackendStatus = async () => {
  try {
    console.log('🔍 Checking backend server status...');
    
    // Test if server is running
    const healthCheck = await axios.get('http://localhost:3001/health', { timeout: 3000 });
    console.log('✅ Backend server is running');
    console.log('📊 Health check response:', healthCheck.data);
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running on port 3001');
      console.log('💡 Start the backend server with: npm run dev');
      return;
    } else {
      console.log('❌ Health check failed:', error.message);
    }
  }
  
  try {
    // Test technologies endpoint with more details
    console.log('🧪 Testing technologies API endpoint...');
    const response = await axios.get('http://localhost:3001/api/technologies', { 
      timeout: 5000,
      validateStatus: () => true // Accept any status code
    });
    
    console.log('📊 Technologies API Status:', response.status);
    console.log('📊 Technologies API Response:', JSON.stringify(response.data, null, 2));
    
    // Test with different endpoints
    console.log('🧪 Testing technologies categories endpoint...');
    const categoriesResponse = await axios.get('http://localhost:3001/api/technologies/categories', { 
      timeout: 5000,
      validateStatus: () => true
    });
    
    console.log('📊 Categories API Status:', categoriesResponse.status);
    console.log('📊 Categories API Response:', JSON.stringify(categoriesResponse.data, null, 2));
    
  } catch (error) {
    console.log('❌ API tests failed:', error.message);
  }
};

checkBackendStatus();