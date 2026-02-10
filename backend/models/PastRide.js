import pool from '../config/db.js';

class PastRide {
  // Get last ride record for a driver
  static async getLastByDriverId(driverId) {
    const [rows] = await pool.query(
      'SELECT * FROM PastRides WHERE driver_id = ? ORDER BY start_time DESC LIMIT 1',
      [driverId]
    );
    return rows[0];
  }

  // Create new ride record
  static async create(driverId, checkpointId) {
    const [result] = await pool.query(
      'INSERT INTO PastRides (driver_id, checkpoint_id, status) VALUES (?, ?, "ON")',
      [driverId, checkpointId]
    );
    return result.insertId;
  }

  // Update ride checkpoint
  static async updateCheckpoint(rideId, checkpointId) {
    await pool.query(
      'UPDATE PastRides SET checkpoint_id = ? WHERE ride_id = ?',
      [checkpointId, rideId]
    );
  }

  // Update ride status
  static async updateStatus(rideId, status) {
    await pool.query(
      'UPDATE PastRides SET status = ? WHERE ride_id = ?',
      [status, rideId]
    );
  }

  // Get all active rides (status = ON)
  static async getAllActive() {
    const [rows] = await pool.query(`
      SELECT pr.ride_id, pr.driver_id, pr.checkpoint_id, pr.status, pr.start_time,
             d.name as driver_name, d.auto_reg_no,
             c.checkpoint_name
      FROM PastRides pr
      JOIN Drivers d ON pr.driver_id = d.driver_id
      JOIN Checkpoints c ON pr.checkpoint_id = c.checkpoint_id
      WHERE pr.status = 'ON'
      ORDER BY pr.start_time DESC
    `);
    return rows;
  }

  // Get active rides grouped by checkpoint
  static async getActiveByCheckpoint() {
    const [rows] = await pool.query(`
      SELECT c.checkpoint_id, c.checkpoint_name, c.sequence_order,
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'driver_id', d.driver_id,
                 'name', d.name,
                 'auto_reg_no', d.auto_reg_no,
                 'ride_id', pr.ride_id,
                 'start_time', pr.start_time
               )
             ) as drivers
      FROM Checkpoints c
      LEFT JOIN PastRides pr ON c.checkpoint_id = pr.checkpoint_id AND pr.status = 'ON'
      LEFT JOIN Drivers d ON pr.driver_id = d.driver_id
      GROUP BY c.checkpoint_id, c.checkpoint_name, c.sequence_order
      ORDER BY c.sequence_order
    `);
    return rows;
  }

  // End rides that have been active for more than 15 minutes
  static async endExpiredRides() {
    const [result] = await pool.query(`
      UPDATE PastRides 
      SET status = 'OFF' 
      WHERE status = 'ON' 
      AND TIMESTAMPDIFF(MINUTE, start_time, NOW()) >= 15
    `);
    return result.affectedRows;
  }

  // Get ride by ID
  static async findById(rideId) {
    const [rows] = await pool.query(
      'SELECT * FROM PastRides WHERE ride_id = ?',
      [rideId]
    );
    return rows[0];
  }
}

export default PastRide;
