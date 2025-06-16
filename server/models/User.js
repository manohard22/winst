import pool from "../config/database.js";
import bcrypt from "bcryptjs";

export class User {
  static async create(userData) {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      education,
      fieldOfStudy,
      technology,
    } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`;

    // Get student role ID
    const roleQuery = "SELECT role_id FROM roles WHERE role_name = $1";
    const roleResult = await pool.query(roleQuery, ["student"]);
    const roleId = roleResult.rows[0].role_id;

    // Get technology ID
    const techQuery = "SELECT tech_id FROM technologies WHERE tech_name = $1";
    const techResult = await pool.query(techQuery, [technology]);

    if (techResult.rows.length === 0) {
      throw new Error("Invalid technology selection");
    }

    const techId = techResult.rows[0].tech_id;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Insert user
      const userQuery = `
        INSERT INTO users (full_name, email, password_hash, phone, education_level, field_of_study, role_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING user_id, full_name, email, phone, education_level, field_of_study, created_at
      `;

      const userResult = await client.query(userQuery, [
        fullName,
        email,
        hashedPassword,
        phone,
        education,
        fieldOfStudy,
        roleId,
      ]);

      const user = userResult.rows[0];

      // Create student internship record
      const internshipQuery = `
        INSERT INTO student_internship (student_id, tech_id, start_date, end_date, status)
        VALUES ($1, $2, CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months', 'pending')
      `;

      await client.query(internshipQuery, [user.user_id, techId]);

      await client.query("COMMIT");

      return {
        id: user.user_id,
        firstName,
        lastName,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        education: user.education_level,
        fieldOfStudy: user.field_of_study,
        technology,
        role: "student",
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByEmail(email) {
    const query = `
      SELECT u.user_id, u.full_name, u.email, u.password_hash, u.phone, 
             u.education_level, u.field_of_study, r.role_name,
             t.tech_name, si.status as internship_status, si.progress_percentage
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      LEFT JOIN student_internship si ON u.user_id = si.student_id
      LEFT JOIN technologies t ON si.tech_id = t.tech_id
      WHERE u.email = $1 AND u.is_active = true
    `;

    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async findById(userId) {
    const query = `
      SELECT u.user_id, u.full_name, u.email, u.phone, 
             u.education_level, u.field_of_study, r.role_name,
             t.tech_name, si.status as internship_status, si.progress_percentage
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      LEFT JOIN student_internship si ON u.user_id = si.student_id
      LEFT JOIN technologies t ON si.tech_id = t.tech_id
      WHERE u.user_id = $1 AND u.is_active = true
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  static async updateLastLogin(userId) {
    const query =
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1";
    await pool.query(query, [userId]);
  }

  static async getAllStudents() {
    const query = `
      SELECT u.user_id, u.full_name, u.email, u.phone, u.education_level,
             u.field_of_study, u.created_at, u.last_login,
             t.tech_name, si.status, si.progress_percentage, si.start_date, si.end_date,
             si.mentor_assigned, si.enrollment_date
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      LEFT JOIN student_internship si ON u.user_id = si.student_id
      LEFT JOIN technologies t ON si.tech_id = t.tech_id
      WHERE r.role_name = 'student' AND u.is_active = true
      ORDER BY u.created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }
}
