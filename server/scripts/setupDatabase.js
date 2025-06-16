import fs from "fs";
import path from "path";
import pool from "../config/database.js";

async function setupDatabase() {
  try {
    console.log("🏗️  Setting up database schema...");

    // Read and execute schema file
    const schemaPath = path.join(process.cwd(), "..", "database", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    await pool.query(schema);
    console.log("✅ Database schema created successfully");

    // Read and execute dummy data file
    const dummyDataPath = path.join(
      process.cwd(),
      "..",
      "database",
      "dummy_data.sql"
    );
    const dummyData = fs.readFileSync(dummyDataPath, "utf8");

    await pool.query(dummyData);
    console.log("✅ Dummy data inserted successfully");

    // Verify setup
    const result = await pool.query("SELECT COUNT(*) FROM users");
    console.log(`📊 Total users in database: ${result.rows[0].count}`);

    console.log("🎉 Database setup completed successfully!");
  } catch (error) {
    console.error("❌ Database setup error:", error);
  } finally {
    await pool.end();
  }
}

setupDatabase();
