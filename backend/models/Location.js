import pool from '../config/db.js';

class Location {
  // Get all locations with their geofence polygons
  static async getAllWithGeofence() {
    const [rows] = await pool.query(`
      SELECT l.location_id, l.location_name, l.location_description,
             ST_AsText(lgp.fence) as fence_wkt
      FROM Locations l
      LEFT JOIN Location_Geofence_Points lgp ON l.location_id = lgp.location_id
    `);
    return rows;
  }

  // Get all locations
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM Locations');
    return rows;
  }

  // Get location by ID
  static async findById(locationId) {
    const [rows] = await pool.query(
      'SELECT * FROM Locations WHERE location_id = ?',
      [locationId]
    );
    return rows[0];
  }

  // Check if a point is inside any geofenced location
  static async findLocationByCoordinates(latitude, longitude) {
    const [rows] = await pool.query(`
      SELECT l.location_id, l.location_name, l.location_description
      FROM Locations l
      JOIN Location_Geofence_Points lgp ON l.location_id = lgp.location_id
      WHERE ST_Contains(lgp.fence, ST_GeomFromText('POINT(${longitude} ${latitude})', 4326))
    `);
    return rows[0] || null;
  }

  // Get UI coordinates for locations by device type
  static async getUICoordinates(deviceType) {
    const [rows] = await pool.query(`
      SELECT l.location_id, l.location_name, luc.x_coordinate, luc.y_coordinate
      FROM Locations l
      LEFT JOIN Location_UI_Coordinates luc ON l.location_id = luc.location_id
      WHERE luc.device_type = ?
    `, [deviceType]);
    return rows;
  }
}

export default Location;
