import pool from "../config/database.js";

export class Technology {
  static async getAll() {
    const query = `
      SELECT tech_id, tech_name, description, duration_months, price, is_active
      FROM technologies
      WHERE is_active = true
      ORDER BY tech_name
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(techId) {
    const query = `
      SELECT tech_id, tech_name, description, duration_months, price, is_active
      FROM technologies
      WHERE tech_id = $1 AND is_active = true
    `;

    const result = await pool.query(query, [techId]);
    return result.rows[0] || null;
  }

  static async getByName(techName) {
    const query = `
      SELECT tech_id, tech_name, description, duration_months, price, is_active
      FROM technologies
      WHERE tech_name = $1 AND is_active = true
    `;

    const result = await pool.query(query, [techName]);
    return result.rows[0] || null;
  }
}
