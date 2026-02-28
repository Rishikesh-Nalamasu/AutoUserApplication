import pool from '../config/db.js';

class Student {
  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM Students WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(studentId) {
    const [rows] = await pool.query(
      'SELECT student_id, name, year, branch, section, email, created_at FROM Students WHERE student_id = ?',
      [studentId]
    );
    return rows[0];
  }

  static async create(studentData) {
    const { name, year, branch, section, email, password_hash } = studentData;
    const [result] = await pool.query(
      'INSERT INTO Students (name, year, branch, section, email, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
      [name, year, branch, section, email, password_hash]
    );
    return result.insertId;
  }

  static async update(studentId, data) {
    const fields = [];
    const values = [];
    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.year !== undefined) { fields.push('year = ?'); values.push(data.year); }
    if (data.branch !== undefined) { fields.push('branch = ?'); values.push(data.branch); }
    if (data.section !== undefined) { fields.push('section = ?'); values.push(data.section); }
    if (fields.length === 0) return;
    values.push(studentId);
    await pool.query(`UPDATE Students SET ${fields.join(', ')} WHERE student_id = ?`, values);
  }
}

export default Student;
