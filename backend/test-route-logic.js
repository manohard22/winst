// Test the exact same code as the technologies route
const pool = require('./config/database');

const testTechnologiesRoute = async () => {
  try {
    console.log('🧪 Testing exact technologies route logic...');
    
    // Test the exact query from the route
    const query = 'SELECT * FROM technologies WHERE is_active = true ORDER BY category, name';
    const queryParams = [];
    
    console.log('📊 Executing query:', query);
    console.log('📊 Query params:', queryParams);
    
    const result = await pool.query(query, queryParams);
    
    console.log('✅ Query successful!');
    console.log('📊 Result row count:', result.rows.length);
    
    if (result.rows.length > 0) {
      console.log('📊 Sample row:', result.rows[0]);
      
      // Test the mapping logic
      const mappedData = result.rows.map(tech => ({
        id: tech.id,
        name: tech.name,
        category: tech.category,
        description: tech.description,
        iconUrl: tech.icon_url,
        isActive: tech.is_active,
        createdAt: tech.created_at
      }));
      
      console.log('✅ Data mapping successful!');
      console.log('📊 Sample mapped data:', mappedData[0]);
      
      // Test the full response structure
      const response = {
        success: true,
        data: {
          technologies: mappedData
        }
      };
      
      console.log('✅ Response structure created successfully!');
      console.log('📊 Response sample:', {
        success: response.success,
        dataCount: response.data.technologies.length,
        firstTech: response.data.technologies[0]
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    console.error('❌ Error stack:', error.stack);
  } finally {
    await pool.end();
  }
};

testTechnologiesRoute();