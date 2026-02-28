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

  static async update(driverId, data) {
    const fields = [];
    const values = [];
    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.auto_reg_no !== undefined) { fields.push('auto_reg_no = ?'); values.push(data.auto_reg_no); }
    if (fields.length === 0) return;
    values.push(driverId);
    await pool.query(`UPDATE Drivers SET ${fields.join(', ')} WHERE driver_id = ?`, values);
  }
}

export default Driver;
