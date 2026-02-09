import pool from '../config/db.js';

class Driver {
  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM Drivers WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(driverId) {
    const [rows] = await pool.query(
      'SELECT driver_id, name, auto_reg_no, email, created_at FROM Drivers WHERE driver_id = ?',
      [driverId]
    );
    return rows[0];
  }
}

export default Driver;
