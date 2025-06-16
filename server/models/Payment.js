import pool from "../config/database.js";

export class Payment {
  static async create(paymentData) {
    const { userId, techId, amount, method, transactionId, gateway } =
      paymentData;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Create order first
      const orderQuery = `
        INSERT INTO orders (student_id, tech_id, total_amount, final_amount, status, order_description)
        VALUES ($1, $2, $3, $3, 'paid', 'Internship Program Fee')
        RETURNING order_id
      `;

      const orderResult = await client.query(orderQuery, [
        userId,
        techId,
        amount,
      ]);
      const orderId = orderResult.rows[0].order_id;

      // Create payment record
      const paymentQuery = `
        INSERT INTO payments (order_id, amount, payment_method, payment_status, transaction_id, payment_gateway)
        VALUES ($1, $2, $3, 'completed', $4, $5)
        RETURNING payment_id, amount, payment_date, payment_status, transaction_id
      `;

      const paymentResult = await client.query(paymentQuery, [
        orderId,
        amount,
        method,
        transactionId,
        gateway,
      ]);

      // Update student internship status
      const updateInternshipQuery = `
        UPDATE student_internship 
        SET status = 'active' 
        WHERE student_id = $1 AND tech_id = $2
      `;

      await client.query(updateInternshipQuery, [userId, techId]);

      await client.query("COMMIT");

      return paymentResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAllPayments() {
    const query = `
      SELECT p.payment_id, p.amount, p.payment_date, p.payment_method, 
             p.payment_status, p.transaction_id, p.payment_gateway,
             u.full_name as student_name, u.email as student_email,
             t.tech_name as program, o.order_description
      FROM payments p
      JOIN orders o ON p.order_id = o.order_id
      JOIN users u ON o.student_id = u.user_id
      JOIN technologies t ON o.tech_id = t.tech_id
      ORDER BY p.payment_date DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  static async getPaymentsByUser(userId) {
    const query = `
      SELECT p.payment_id, p.amount, p.payment_date, p.payment_method, 
             p.payment_status, p.transaction_id,
             t.tech_name as program, o.order_description
      FROM payments p
      JOIN orders o ON p.order_id = o.order_id
      JOIN technologies t ON o.tech_id = t.tech_id
      WHERE o.student_id = $1
      ORDER BY p.payment_date DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}
