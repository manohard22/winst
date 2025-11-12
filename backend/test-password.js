const bcrypt = require('bcrypt');

// Test password verification
const password = 'password123';
const hash = '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e';

async function testPassword() {
  try {
    console.log('Testing password verification...');
    console.log('Password:', password);
    console.log('Hash:', hash);
    
    // Test with existing hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('Is valid with existing hash:', isValid);
    
    // Generate a new hash for password123
    console.log('\nGenerating new hash for password123...');
    const newHash = await bcrypt.hash(password, 10);
    console.log('New hash:', newHash);
    
    // Verify the new hash
    const isNewValid = await bcrypt.compare(password, newHash);
    console.log('Is valid with new hash:', isNewValid);
    
    // Try some other common passwords
    const passwords = ['password', 'admin123', '123456', 'winst123'];
    for (const pwd of passwords) {
      const testValid = await bcrypt.compare(pwd, hash);
      console.log(`Testing "${pwd}":`, testValid);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testPassword();