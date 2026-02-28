import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Driver from '../models/Driver.js';
import PastHorn from '../models/PastHorn.js';
import PastRide from '../models/PastRide.js';
import pool from '../config/db.js';

// Generate JWT Token
const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Student Signup abcdef
export const studentSignup = async (req, res) => {
  try {
    const { name, year, branch, section, email, password } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findByEmail(email);
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create student
    const studentId = await Student.create({
      name,
      year,
      branch,
      section,
      email,
      password_hash
    });

    // Get created student
    const student = await Student.findById(studentId);

    // Generate token
    const token = generateToken(studentId, 'student');

    res.status(201).json({
      token,
      user: {
        id: student.student_id,
        name: student.name,
        year: student.year,
        branch: student.branch,
        section: student.section,
        email: student.email
      }
    });
  } catch (error) {
    console.error('Student signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// Student Login
export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student
    const student = await Student.findByEmail(email);
    if (!student) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, student.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(student.student_id, 'student');

    res.json({
      token,
      user: {
        id: student.student_id,
        name: student.name,
        year: student.year,
        branch: student.branch,
        section: student.section,
        email: student.email
      }
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Driver Login
export const driverLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find driver
    const driver = await Driver.findByEmail(email);
    if (!driver) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, driver.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(driver.driver_id, 'driver');

    res.json({
      token,
      user: {
        id: driver.driver_id,
        name: driver.name,
        auto_reg_no: driver.auto_reg_no,
        email: driver.email
      }
    });
  } catch (error) {
    console.error('Driver login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Verify Token
export const verifyToken = async (req, res) => {
  try {
    res.json({
      user: req.user,
      type: req.userType
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userType === 'student' ? req.user.student_id : req.user.driver_id;
    if (req.userType === 'student') {
      await Student.update(userId, req.body);
      const updated = await Student.findById(userId);
      res.json({ user: { id: updated.student_id, name: updated.name, year: updated.year, branch: updated.branch, section: updated.section, email: updated.email } });
    } else {
      await Driver.update(userId, req.body);
      const updated = await Driver.findById(userId);
      res.json({ user: { id: updated.driver_id, name: updated.name, auto_reg_no: updated.auto_reg_no, email: updated.email } });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Get Past Rides (Driver)
export const getPastRides = async (req, res) => {
  try {
    const driverId = req.user.driver_id;
    const rides = await PastRide.getAllByDriverId(driverId);
    res.json({ rides });
  } catch (error) {
    console.error('Past rides error:', error);
    res.status(500).json({ message: 'Error fetching past rides' });
  }
};

// Get Past Horns (Student)
export const getPastHorns = async (req, res) => {
  try {
    const studentId = req.user.student_id;
    const horns = await PastHorn.getAllByStudentId(studentId);
    res.json({ horns });
  } catch (error) {
    console.error('Past horns error:', error);
    res.status(500).json({ message: 'Error fetching past horns' });
  }
};

// Dashboard Data
export const getDashboard = async (req, res) => {
  try {
    const range = req.query.range || '7days';
    let days = 7;
    if (range === '24hours') days = 1;
    else if (range === '30days') days = 30;

    // Daily activity
    const [dailyActivity] = await pool.query(`
      SELECT DATE(created_at) as date,
             COUNT(*) as horns
      FROM PastHorns
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [days]);

    const [dailyRides] = await pool.query(`
      SELECT DATE(start_time) as date,
             COUNT(*) as rides
      FROM PastRides
      WHERE start_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(start_time)
      ORDER BY date
    `, [days]);

    // Merge daily data
    const dateMap = {};
    dailyActivity.forEach(r => { dateMap[r.date] = { ...(dateMap[r.date] || {}), horns: r.horns }; });
    dailyRides.forEach(r => { dateMap[r.date] = { ...(dateMap[r.date] || {}), rides: r.rides }; });
    const daily = Object.entries(dateMap).map(([date, d]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      horns: d.horns || 0,
      rides: d.rides || 0,
    }));

    // Location distribution
    const [locationDist] = await pool.query(`
      SELECT l.location_name as name, COUNT(ph.horn_id) as value
      FROM Locations l
      LEFT JOIN PastHorns ph ON l.location_id = ph.location_id AND ph.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY l.location_id, l.location_name
      HAVING value > 0
      ORDER BY value DESC
    `, [days]);

    // Checkpoint distribution
    const [checkpointDist] = await pool.query(`
      SELECT c.checkpoint_name as name, COUNT(pr.ride_id) as value
      FROM Checkpoints c
      LEFT JOIN PastRides pr ON c.checkpoint_id = pr.checkpoint_id AND pr.start_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY c.checkpoint_id, c.checkpoint_name
      HAVING value > 0
      ORDER BY value DESC
    `, [days]);

    // Hourly activity
    const [hourlyData] = await pool.query(`
      SELECT HOUR(created_at) as hour, COUNT(*) as count
      FROM PastHorns
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY HOUR(created_at)
      ORDER BY hour
    `, [days]);
    const hourly = hourlyData.map(h => ({
      hour: `${h.hour}:00`,
      horns: h.count,
    }));

    // Totals
    const [totalHorns] = await pool.query('SELECT COUNT(*) as count FROM PastHorns WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', [days]);
    const [totalRides] = await pool.query('SELECT COUNT(*) as count FROM PastRides WHERE start_time >= DATE_SUB(NOW(), INTERVAL ? DAY)', [days]);
    const [activeHorns] = await pool.query("SELECT COUNT(*) as count FROM PastHorns WHERE status = 'ON'");
    const [activeRides] = await pool.query("SELECT COUNT(*) as count FROM PastRides WHERE status = 'ON'");

    // Peak hour
    const peakHour = hourlyData.length > 0 ? hourlyData.reduce((max, h) => h.count > max.count ? h : max, hourlyData[0]) : null;

    res.json({
      overview: {
        totalHorns: totalHorns[0].count,
        totalRides: totalRides[0].count,
        activeNow: activeHorns[0].count + activeRides[0].count,
        peakHour: peakHour ? `${peakHour.hour}:00` : 'N/A',
      },
      daily,
      locationDistribution: locationDist,
      checkpointDistribution: checkpointDist,
      hourly,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};
