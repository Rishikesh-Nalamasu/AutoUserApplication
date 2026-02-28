import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Driver from '../models/Driver.js';

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
