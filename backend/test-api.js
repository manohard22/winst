const axios = require('axios');

const testTechnologiesAPI = async () => {
  try {
    console.log('🧪 Testing Technologies API...');
    
    const response = await axios.get('http://localhost:3001/api/technologies', {
      timeout: 5000
    });
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ API Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.data && response.data.data.technologies) {
      console.log(`✅ Found ${response.data.data.technologies.length} technologies`);
    } else {
      console.log('❌ API returned success=false or no technologies data');
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused - Backend server is not running');
      console.log('💡 Please start the backend server first:');
      console.log('   cd backend && npm run dev');
    } else {
      console.log('❌ API Test Failed:', error.message);
      if (error.response) {
        console.log('❌ Response Status:', error.response.status);
        console.log('❌ Response Data:', error.response.data);
      }
    }
  }
};

testTechnologiesAPI();