const bcrypt = require('bcrypt');

async function generateCorrectHash() {
    const password = 'password123';
    const saltRounds = 10;
    
    console.log('Generating correct bcrypt hash for password:', password);
    
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Generated hash:', hash);
    
    // Verify it works
    const isValid = await bcrypt.compare(password, hash);
    console.log('Verification test passed:', isValid);
    
    // Test with the existing problematic hash
    const existingHash = '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e';
    const existingValid = await bcrypt.compare(password, existingHash);
    console.log('Existing hash works with password123:', existingValid);
    
    console.log('\n=== SQL UPDATE STATEMENT ===');
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE role IN ('admin', 'student', 'mentor', 'affiliate');`);
}

generateCorrectHash().catch(console.error);