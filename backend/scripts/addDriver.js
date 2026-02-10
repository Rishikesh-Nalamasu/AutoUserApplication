import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

// ========== EDIT THESE VALUES ==========
const driverData = {
  name: 'John Driver',
  auto_reg_no: 'KA01AB1234',
  email: 'driver@example.com',
  password: 'Nrk_23042005'
};
// =======================================

async function addDriver() {
  try {
    // Check if driver already exists
    const [existing] = await pool.query(
      'SELECT * FROM Drivers WHERE email = ?',
      [driverData.email]
    );

    if (existing.length > 0) {
      console.log('❌ Driver with this email already exists!');
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(driverData.password, salt);

    // Insert driver
    const [result] = await pool.query(
      'INSERT INTO Drivers (name, auto_reg_no, email, password_hash, created_at) VALUES (?, ?, ?, ?, NOW())',
      [driverData.name, driverData.auto_reg_no, driverData.email, password_hash]
    );

    console.log('✅ Driver added successfully!');
    console.log('Driver ID:', result.insertId);
    console.log('Name:', driverData.name);
    console.log('Email:', driverData.email);
    console.log('Auto Reg No:', driverData.auto_reg_no);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding driver:', error.message);
    process.exit(1);
  }
}

addDriver();
