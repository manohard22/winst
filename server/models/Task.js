import pool from "../config/database.js";

export class Task {
  static async getTasksByUser(userId) {
    const query = `
      SELECT t.task_id, t.title, t.description, t.due_date, t.status, t.points,
             t.created_at, tech.tech_name,
             ts.submission_id, ts.submission_text, ts.submission_url, 
             ts.submitted_at, ts.feedback, ts.grade
      FROM tasks t
      JOIN technologies tech ON t.tech_id = tech.tech_id
      LEFT JOIN task_submissions ts ON t.task_id = ts.task_id AND ts.student_id = $1
      WHERE t.assigned_to = $1
      ORDER BY t.due_date ASC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async submitTask(taskId, userId, submissionData) {
    const { submissionText, submissionUrl } = submissionData;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Check if submission already exists
      const existingQuery = `
        SELECT submission_id FROM task_submissions 
        WHERE task_id = $1 AND student_id = $2
      `;

      const existingResult = await client.query(existingQuery, [
        taskId,
        userId,
      ]);

      let query, params;

      if (existingResult.rows.length > 0) {
        // Update existing submission
        query = `
          UPDATE task_submissions 
          SET submission_text = $3, submission_url = $4, submitted_at = CURRENT_TIMESTAMP
          WHERE task_id = $1 AND student_id = $2
          RETURNING submission_id, submitted_at
        `;
        params = [taskId, userId, submissionText, submissionUrl];
      } else {
        // Create new submission
        query = `
          INSERT INTO task_submissions (task_id, student_id, submission_text, submission_url)
          VALUES ($1, $2, $3, $4)
          RETURNING submission_id, submitted_at
        `;
        params = [taskId, userId, submissionText, submissionUrl];
      }

      const result = await client.query(query, params);

      // Update task status
      const updateTaskQuery = `
        UPDATE tasks SET status = 'completed' WHERE task_id = $1
      `;

      await client.query(updateTaskQuery, [taskId]);

      await client.query("COMMIT");

      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAllTasks() {
    const query = `
      SELECT t.task_id, t.title, t.description, t.due_date, t.status, t.points,
             t.created_at, tech.tech_name,
             u.full_name as assigned_to_name, u.email as assigned_to_email,
             creator.full_name as created_by_name
      FROM tasks t
      JOIN technologies tech ON t.tech_id = tech.tech_id
      JOIN users u ON t.assigned_to = u.user_id
      JOIN users creator ON t.created_by = creator.user_id
      ORDER BY t.created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  static async createTask(taskData) {
    const {
      title,
      description,
      techId,
      assignedTo,
      createdBy,
      dueDate,
      points,
    } = taskData;

    const query = `
      INSERT INTO tasks (title, description, tech_id, assigned_to, created_by, due_date, points)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING task_id, title, description, due_date, status, points, created_at
    `;

    const result = await pool.query(query, [
      title,
      description,
      techId,
      assignedTo,
      createdBy,
      dueDate,
      points,
    ]);

    return result.rows[0];
  }
}
