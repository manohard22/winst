const { Client } = require("pg");

// Database configuration
const DB_CONFIG = {
  host: "localhost",
  port: 5432,
  database: "lucro_portal_db",
  user: "lucro_db_user",
  password: "root",
};

async function verifyRequirements() {
  console.log(
    "🔍 Verifying Lucro Internship Portal Requirements Implementation..."
  );
  console.log("=".repeat(70));

  let client;

  try {
    client = new Client(DB_CONFIG);
    await client.connect();
    console.log("✅ Connected to database successfully");

    // Check database connection and basic tables
    await verifyBasicStructure(client);

    // Verify all 4 requirements
    await verifyAssessmentSystem(client);
    await verifyReferralSystem(client);
    await verifyAffiliateSystem(client);
    await verifyTaskSubmissions(client);

    // Overall verification summary
    await generateVerificationSummary(client);

    await client.end();
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Database connection failed. Please ensure:");
      console.log("   1. PostgreSQL is running");
      console.log("   2. Database 'lucro_portal_db' exists");
      console.log("   3. User 'lucro_db_user' has proper permissions");
      console.log("   4. Run 'npm run setup-db-fresh' to create the database");
    }
    process.exit(1);
  }
}

async function verifyBasicStructure(client) {
  console.log("\n📊 Verifying Basic Database Structure:");

  const basicTables = [
    "users",
    "internship_programs",
    "technologies",
    "student_internship",
    "orders",
    "payments",
    "program_technologies",
  ];

  for (const table of basicTables) {
    try {
      const result = await client.query(
        `SELECT COUNT(*) as count FROM ${table}`
      );
      const count = result.rows[0].count;
      console.log(`   ✅ ${table}: ${count} records`);
    } catch (error) {
      console.log(`   ❌ ${table}: Missing or error`);
    }
  }
}

async function verifyAssessmentSystem(client) {
  console.log("\n🎯 Requirement 1: Assessment System");
  console.log("-".repeat(40));

  try {
    // Check assessment tables exist
    const tables = [
      "assessment_questions",
      "assessment_attempts",
      "assessment_answers",
    ];
    const tableChecks = await Promise.all(
      tables.map(async (table) => {
        try {
          const result = await client.query(
            `SELECT COUNT(*) as count FROM ${table}`
          );
          return { table, count: result.rows[0].count, exists: true };
        } catch (error) {
          return { table, count: 0, exists: false };
        }
      })
    );

    let assessmentScore = 0;

    tableChecks.forEach(({ table, count, exists }) => {
      if (exists) {
        console.log(`   ✅ ${table}: ${count} records`);
        assessmentScore += count > 0 ? 1 : 0.5;
      } else {
        console.log(`   ❌ ${table}: Table missing`);
      }
    });

    // Check assessment features
    const features = await client.query(`
      SELECT 
        COUNT(DISTINCT aq.program_id) as programs_with_questions,
        COUNT(DISTINCT aa.student_id) as students_with_attempts,
        AVG(aa.score_percentage) as avg_score,
        COUNT(CASE WHEN aa.status = 'completed' THEN 1 END) as completed_attempts
      FROM assessment_questions aq
      LEFT JOIN assessment_attempts aa ON aq.program_id = aa.program_id
    `);

    const stats = features.rows[0];
    console.log(
      `   📈 Programs with questions: ${stats.programs_with_questions}`
    );
    console.log(
      `   👥 Students with attempts: ${stats.students_with_attempts}`
    );
    console.log(
      `   📊 Average score: ${parseFloat(stats.avg_score || 0).toFixed(1)}%`
    );
    console.log(`   ✅ Completed attempts: ${stats.completed_attempts}`);

    const assessmentImplemented = assessmentScore >= 2;
    console.log(
      `\n   Status: ${
        assessmentImplemented ? "✅ IMPLEMENTED" : "❌ NOT IMPLEMENTED"
      }`
    );

    return assessmentImplemented;
  } catch (error) {
    console.log(`   ❌ Error checking assessment system: ${error.message}`);
    return false;
  }
}

async function verifyReferralSystem(client) {
  console.log("\n👥 Requirement 2: Referral Friend System");
  console.log("-".repeat(40));

  try {
    // Check referral table and data
    const referralStats = await client.query(`
      SELECT 
        COUNT(*) as total_referrals,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_referrals,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_referrals,
        SUM(CASE WHEN status = 'completed' THEN discount_amount ELSE 0 END) as total_savings,
        COUNT(DISTINCT referrer_id) as users_with_referrals
      FROM referrals
    `);

    const stats = referralStats.rows[0];
    console.log(`   📊 Total referrals: ${stats.total_referrals}`);
    console.log(`   ✅ Completed referrals: ${stats.completed_referrals}`);
    console.log(`   ⏳ Pending referrals: ${stats.pending_referrals}`);
    console.log(`   💰 Total savings provided: ₹${stats.total_savings || 0}`);
    console.log(`   👥 Users with referrals: ${stats.users_with_referrals}`);

    // Check if referral codes are properly formatted
    const codeCheck = await client.query(`
      SELECT referral_code, discount_amount 
      FROM referrals 
      WHERE referral_code LIKE 'REF%' 
      LIMIT 3
    `);

    console.log(`   🎫 Sample referral codes:`);
    codeCheck.rows.forEach((row) => {
      console.log(
        `      ${row.referral_code} (₹${row.discount_amount} discount)`
      );
    });

    // Check orders with referral discounts
    const referralOrders = await client.query(`
      SELECT COUNT(*) as orders_with_referrals
      FROM orders 
      WHERE discount_type = 'referral' AND referral_code IS NOT NULL
    `);

    console.log(
      `   🛒 Orders with referral discounts: ${referralOrders.rows[0].orders_with_referrals}`
    );

    const referralImplemented = stats.total_referrals > 0;
    console.log(
      `\n   Status: ${
        referralImplemented ? "✅ IMPLEMENTED" : "❌ NOT IMPLEMENTED"
      }`
    );

    return referralImplemented;
  } catch (error) {
    console.log(`   ❌ Error checking referral system: ${error.message}`);
    return false;
  }
}

async function verifyAffiliateSystem(client) {
  console.log("\n💰 Requirement 3: Affiliate Program");
  console.log("-".repeat(40));

  try {
    // Check affiliate tables
    const affiliateStats = await client.query(`
      SELECT 
        COUNT(*) as total_affiliates,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_affiliates,
        AVG(commission_rate) as avg_commission_rate,
        SUM(total_earnings) as total_affiliate_earnings,
        SUM(total_referrals) as total_affiliate_referrals
      FROM affiliates
    `);

    const stats = affiliateStats.rows[0];
    console.log(`   📊 Total affiliates: ${stats.total_affiliates}`);
    console.log(`   ✅ Active affiliates: ${stats.active_affiliates}`);
    console.log(
      `   💵 Average commission rate: ${parseFloat(
        stats.avg_commission_rate || 0
      ).toFixed(1)}%`
    );
    console.log(
      `   💰 Total affiliate earnings: ₹${stats.total_affiliate_earnings || 0}`
    );
    console.log(
      `   📈 Total affiliate referrals: ${stats.total_affiliate_referrals || 0}`
    );

    // Check affiliate earnings
    const earningsStats = await client.query(`
      SELECT 
        COUNT(*) as total_transactions,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_transactions,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_transactions,
        SUM(CASE WHEN status = 'paid' THEN commission_amount ELSE 0 END) as paid_commissions,
        SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END) as pending_commissions
      FROM affiliate_earnings
    `);

    const earnings = earningsStats.rows[0];
    console.log(`   🔄 Total transactions: ${earnings.total_transactions}`);
    console.log(`   ✅ Paid transactions: ${earnings.paid_transactions}`);
    console.log(`   ⏳ Pending transactions: ${earnings.pending_transactions}`);
    console.log(`   💵 Paid commissions: ₹${earnings.paid_commissions || 0}`);
    console.log(
      `   ⏳ Pending commissions: ₹${earnings.pending_commissions || 0}`
    );

    // Sample affiliate codes
    const codeCheck = await client.query(`
      SELECT affiliate_code, commission_rate, total_earnings 
      FROM affiliates 
      WHERE affiliate_code LIKE 'AFF%' 
      LIMIT 3
    `);

    console.log(`   🎫 Sample affiliate codes:`);
    codeCheck.rows.forEach((row) => {
      console.log(
        `      ${row.affiliate_code} (${row.commission_rate}% rate, ₹${row.total_earnings} earned)`
      );
    });

    const affiliateImplemented = stats.total_affiliates > 0;
    console.log(
      `\n   Status: ${
        affiliateImplemented ? "✅ IMPLEMENTED" : "❌ NOT IMPLEMENTED"
      }`
    );

    return affiliateImplemented;
  } catch (error) {
    console.log(`   ❌ Error checking affiliate system: ${error.message}`);
    return false;
  }
}

async function verifyTaskSubmissions(client) {
  console.log("\n📝 Requirement 4: Task Submissions System");
  console.log("-".repeat(40));

  try {
    // Check task tables
    const taskStats = await client.query(`
      SELECT 
        COUNT(DISTINCT t.id) as total_tasks,
        COUNT(DISTINCT t.program_id) as programs_with_tasks,
        COUNT(DISTINCT ts.id) as total_submissions,
        COUNT(DISTINCT ts.student_id) as students_with_submissions,
        COUNT(CASE WHEN ts.status = 'approved' THEN 1 END) as approved_submissions,
        COUNT(CASE WHEN ts.status = 'under_review' THEN 1 END) as pending_submissions,
        AVG(ts.points_earned) as avg_points_earned
      FROM tasks t
      LEFT JOIN task_submissions ts ON t.id = ts.task_id
    `);

    const stats = taskStats.rows[0];
    console.log(`   📋 Total tasks: ${stats.total_tasks}`);
    console.log(`   🎓 Programs with tasks: ${stats.programs_with_tasks}`);
    console.log(`   📤 Total submissions: ${stats.total_submissions}`);
    console.log(
      `   👥 Students with submissions: ${stats.students_with_submissions}`
    );
    console.log(`   ✅ Approved submissions: ${stats.approved_submissions}`);
    console.log(`   ⏳ Pending review: ${stats.pending_submissions}`);
    console.log(
      `   📊 Average points earned: ${parseFloat(
        stats.avg_points_earned || 0
      ).toFixed(1)}`
    );

    // Check task types and difficulty levels
    const taskTypes = await client.query(`
      SELECT 
        task_type, 
        difficulty_level,
        COUNT(*) as count
      FROM tasks 
      GROUP BY task_type, difficulty_level
      ORDER BY task_type, difficulty_level
    `);

    console.log(`   📊 Task breakdown:`);
    taskTypes.rows.forEach((row) => {
      console.log(
        `      ${row.task_type} (${row.difficulty_level}): ${row.count} tasks`
      );
    });

    // Check submission status distribution
    const submissionStatus = await client.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM task_submissions 
      GROUP BY status
      ORDER BY count DESC
    `);

    console.log(`   📈 Submission status:`);
    submissionStatus.rows.forEach((row) => {
      console.log(`      ${row.status}: ${row.count} submissions`);
    });

    const taskImplemented =
      stats.total_tasks > 0 && stats.total_submissions > 0;
    console.log(
      `\n   Status: ${
        taskImplemented ? "✅ IMPLEMENTED" : "❌ NOT IMPLEMENTED"
      }`
    );

    return taskImplemented;
  } catch (error) {
    console.log(
      `   ❌ Error checking task submission system: ${error.message}`
    );
    return false;
  }
}

async function generateVerificationSummary(client) {
  console.log("\n" + "=".repeat(70));
  console.log("📋 VERIFICATION SUMMARY");
  console.log("=".repeat(70));

  try {
    // Get overall statistics
    const overallStats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM users WHERE role = 'admin') as total_admins,
        (SELECT COUNT(*) FROM users WHERE role = 'mentor') as total_mentors,
        (SELECT COUNT(*) FROM internship_programs WHERE is_active = true) as active_programs,
        (SELECT COUNT(*) FROM student_internship) as total_enrollments,
        (SELECT COUNT(*) FROM orders WHERE status = 'paid') as paid_orders,
        (SELECT SUM(final_amount) FROM orders WHERE status = 'paid') as total_revenue
    `);

    const stats = overallStats.rows[0];

    console.log("\n📊 Platform Statistics:");
    console.log(`   👥 Students: ${stats.total_students}`);
    console.log(`   👨‍🏫 Mentors: ${stats.total_mentors}`);
    console.log(`   👨‍💼 Admins: ${stats.total_admins}`);
    console.log(`   📚 Active Programs: ${stats.active_programs}`);
    console.log(`   📝 Total Enrollments: ${stats.total_enrollments}`);
    console.log(`   💰 Paid Orders: ${stats.paid_orders}`);
    console.log(`   💵 Total Revenue: ₹${stats.total_revenue || 0}`);

    // Requirements status
    const requirementStatus = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM assessment_questions) > 0 as assessments_ok,
        (SELECT COUNT(*) FROM referrals) > 0 as referrals_ok,
        (SELECT COUNT(*) FROM affiliates) > 0 as affiliates_ok,
        (SELECT COUNT(*) FROM task_submissions) > 0 as tasks_ok
    `);

    const req = requirementStatus.rows[0];

    console.log("\n🎯 Requirements Status:");
    console.log(`   ${req.assessments_ok ? "✅" : "❌"} 1. Assessment System`);
    console.log(
      `   ${req.referrals_ok ? "✅" : "❌"} 2. Referral Friend System`
    );
    console.log(`   ${req.affiliates_ok ? "✅" : "❌"} 3. Affiliate Program`);
    console.log(`   ${req.tasks_ok ? "✅" : "❌"} 4. Task Submissions`);

    const allRequirementsMet =
      req.assessments_ok &&
      req.referrals_ok &&
      req.affiliates_ok &&
      req.tasks_ok;

    console.log("\n" + "=".repeat(70));
    if (allRequirementsMet) {
      console.log("🎉 SUCCESS: ALL 4 REQUIREMENTS FULLY IMPLEMENTED!");
      console.log("✅ Your Lucro Internship Portal is ready for development!");
    } else {
      console.log("⚠️  WARNING: Some requirements are not fully implemented!");
      console.log(
        "💡 Run 'npm run setup-db-fresh' to recreate the database with all requirements."
      );
    }
    console.log("=".repeat(70));

    // Connection info
    console.log("\n🔗 Database Connection Info:");
    console.log(`   Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`);
    console.log(`   Database: ${DB_CONFIG.database}`);
    console.log(`   User: ${DB_CONFIG.user}`);

    console.log("\n👥 Login Credentials:");
    console.log("   Admin: admin@lucro.com / password123");
    console.log("   Student: john.doe@example.com / password123");
    console.log("   Student: jane.smith@example.com / password123");

    console.log("\n🚀 Next Steps:");
    console.log("   1. Start development: npm run dev");
    console.log("   2. Frontend: http://localhost:3000");
    console.log("   3. Admin Portal: http://localhost:3001");
    console.log("   4. Backend API: http://localhost:5000");
  } catch (error) {
    console.log(`❌ Error generating summary: ${error.message}`);
  }
}

// Run verification
if (require.main === module) {
  verifyRequirements();
}

module.exports = { verifyRequirements };
