const axios = require('axios');

const testDebugEndpoint = async () => {
  try {
    console.log('🧪 Testing debug technologies endpoint...');
    
    const response = await axios.get('http://localhost:3001/api/technologies/test', { 
      timeout: 10000,
      validateStatus: () => true
    });
    
    console.log('📊 Debug endpoint status:', response.status);
    console.log('📊 Debug endpoint response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Debug endpoint test failed:', error.message);
    if (error.response) {
      console.log('❌ Response:', error.response.data);
    }
  }
};

testDebugEndpoint();