import pool from '../config/db.js';

class PastHorn {
  // Get last horn record for a student
  static async getLastByStudentId(studentId) {
    const [rows] = await pool.query(
      'SELECT * FROM PastHorns WHERE student_id = ? ORDER BY created_at DESC LIMIT 1',
      [studentId]
    );
    return rows[0];
  }

  // Create new horn record
  static async create(studentId, locationId) {
    const [result] = await pool.query(
      'INSERT INTO PastHorns (student_id, location_id, status) VALUES (?, ?, "ON")',
      [studentId, locationId]
    );
    return result.insertId;
  }

  // Update horn status
  static async updateStatus(hornId, status) {
    await pool.query(
      'UPDATE PastHorns SET status = ? WHERE horn_id = ?',
      [status, hornId]
    );
  }

  // Get all active horns (status = ON)
  static async getAllActive() {
    const [rows] = await pool.query(`
      SELECT ph.horn_id, ph.student_id, ph.location_id, ph.status, ph.created_at,
             s.name as student_name, s.year, s.branch, s.section,
             l.location_name
      FROM PastHorns ph
      JOIN Students s ON ph.student_id = s.student_id
      JOIN Locations l ON ph.location_id = l.location_id
      WHERE ph.status = 'ON'
      ORDER BY ph.created_at DESC
    `);
    return rows;
  }

  // Get active horns grouped by location
  static async getActiveByLocation() {
    const [rows] = await pool.query(`
      SELECT l.location_id, l.location_name,
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'student_id', s.student_id,
                 'name', s.name,
                 'year', s.year,
                 'branch', s.branch,
                 'section', s.section,
                 'horn_id', ph.horn_id,
                 'created_at', ph.created_at
               )
             ) as students
      FROM Locations l
      LEFT JOIN PastHorns ph ON l.location_id = ph.location_id AND ph.status = 'ON'
      LEFT JOIN Students s ON ph.student_id = s.student_id
      GROUP BY l.location_id, l.location_name
    `);
    return rows;
  }

  // Turn off horns for students not in their location anymore
  static async turnOffOutOfRange(studentId) {
    const [rows] = await pool.query(
      'SELECT horn_id FROM PastHorns WHERE student_id = ? AND status = "ON"',
      [studentId]
    );
    
    if (rows.length > 0) {
      await pool.query(
        'UPDATE PastHorns SET status = "OFF" WHERE student_id = ? AND status = "ON"',
        [studentId]
      );
    }
    
    return rows.length > 0;
  }
}

export default PastHorn;
