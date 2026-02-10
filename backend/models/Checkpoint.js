import pool from '../config/db.js';

class Checkpoint {
  // Get all checkpoints
  static async getAll() {
    const [rows] = await pool.query(
      'SELECT * FROM Checkpoints ORDER BY sequence_order'
    );
    return rows;
  }

  // Get checkpoint by ID
  static async findById(checkpointId) {
    const [rows] = await pool.query(
      'SELECT * FROM Checkpoints WHERE checkpoint_id = ?',
      [checkpointId]
    );
    return rows[0];
  }

  // Find nearest checkpoint to given coordinates using Haversine formula
  static async findNearest(latitude, longitude) {
    const [rows] = await pool.query(`
      SELECT checkpoint_id, checkpoint_name, latitude, longitude, sequence_order,
             (6371 * acos(
               cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) +
               sin(radians(?)) * sin(radians(latitude))
             )) AS distance
      FROM Checkpoints
      ORDER BY distance
      LIMIT 1
    `, [latitude, longitude, latitude]);
    return rows[0];
  }

  // Get UI coordinates for checkpoints by device type
  static async getUICoordinates(deviceType) {
    const [rows] = await pool.query(`
      SELECT c.checkpoint_id, c.checkpoint_name, cuc.x_coordinate, cuc.y_coordinate
      FROM Checkpoints c
      LEFT JOIN Checkpoint_UI_Coordinates cuc ON c.checkpoint_id = cuc.checkpoint_id
      WHERE cuc.device_type = ?
    `, [deviceType]);
    return rows;
  }
}

export default Checkpoint;
