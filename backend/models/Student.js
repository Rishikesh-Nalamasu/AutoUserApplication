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
}

export default Student;
