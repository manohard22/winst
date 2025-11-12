const bcrypt = require('bcrypt');

async function testLogin() {
    const password = 'password123';
    const correctHash = '$2b$10$9tIhVneUihIcrvNKkiADkueKAo/h3eg37d2Xgj1yhO24/jKDO//fC';
    const oldHash = '$2b$10$rOGLbyKV3sYt3GNnyq4HVOx4W7E5y6gG2VCxEZeJKzE9iHn8FyI8e';
    
    console.log('🔐 WINST LOGIN TEST - Bcrypt Verification');
    console.log('=========================================');
    
    console.log(`Testing password: "${password}"`);
    console.log('');
    
    // Test with correct hash
    const correctResult = await bcrypt.compare(password, correctHash);
    console.log(`✅ New correct hash: ${correctResult ? 'PASS' : 'FAIL'}`);
    console.log(`   Hash: ${correctHash}`);
    
    // Test with old problematic hash
    const oldResult = await bcrypt.compare(password, oldHash);
    console.log(`❌ Old problematic hash: ${oldResult ? 'PASS' : 'FAIL'}`);
    console.log(`   Hash: ${oldHash}`);
    
    console.log('');
    console.log('🎯 NEXT STEPS:');
    if (correctResult && !oldResult) {
        console.log('1. Run: psql -U your_username -d winst_db -f database/fix_password_hashes.sql');
        console.log('2. Or manually update database with the SQL from fix_password_hashes.sql');
        console.log('3. Login with: admin@winst.com / password123');
        console.log('');
        console.log('✅ Authentication should work after updating the database!');
    } else {
        console.log('❌ Hash generation issue - please regenerate hashes');
    }
}

testLogin().catch(console.error);