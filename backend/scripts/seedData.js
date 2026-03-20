import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

// ==================== SAMPLE DATA ====================

// Indian Student Names
const studentNames = [
  'Aarav Sharma', 'Vivaan Patel', 'Aditya Gupta', 'Vihaan Singh', 'Arjun Reddy',
  'Reyansh Kumar', 'Ayaan Verma', 'Krishna Iyer', 'Ishaan Nair', 'Sai Prasad',
  'Ananya Das', 'Diya Menon', 'Aadhya Choudhury', 'Saanvi Joshi', 'Kavya Rao',
  'Priya Agarwal', 'Riya Saxena', 'Shreya Mishra', 'Tanvi Kapoor', 'Nisha Pandey',
  'Rohan Malhotra', 'Karan Bhatia', 'Siddharth Bansal', 'Harsh Tiwari', 'Rahul Goel',
  'Neha Srivastava', 'Pooja Rastogi', 'Ankita Bhardwaj', 'Sneha Dubey', 'Megha Chauhan',
  'Yash Khanna', 'Dev Sethi', 'Raj Mehra', 'Amit Chawla', 'Vikram Grover',
  'Palak Arora', 'Simran Bajaj', 'Kritika Luthra', 'Anjali Thakur', 'Preeti Ahuja'
];

// Indian Driver Names
const driverNames = [
  'Ramesh Kumar', 'Suresh Yadav', 'Mahesh Prasad', 'Ganesh Rao', 'Rajesh Singh',
  'Dinesh Sharma', 'Naresh Verma', 'Kamlesh Patel', 'Rakesh Gupta', 'Mukesh Mishra',
  'Santosh Tiwari', 'Anil Dubey', 'Sunil Pandey', 'Manoj Chauhan', 'Vinod Saxena'
];

// Auto registration numbers (AP - Andhra Pradesh style)
const autoRegNos = [
  'AP39TA1234', 'AP39TB2345', 'AP39TC3456', 'AP39TD4567', 'AP39TE5678',
  'AP39TF6789', 'AP39TG7890', 'AP39TH8901', 'AP39TI9012', 'AP39TJ0123',
  'AP39TK1357', 'AP39TL2468', 'AP39TM3579', 'AP39TN4680', 'AP39TO5791'
];

// Branches
const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML'];
const sections = ['A', 'B', 'C', 'D'];
const years = [1, 2, 3, 4];

// Default password for all accounts
const DEFAULT_PASSWORD = 'Test@123';

// ==================== HELPER FUNCTIONS ====================

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate dates for the past 30 days
function getRecentDates(count) {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const daysAgo = randomInt(0, 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    dates.push(date);
  }
  return dates;
}

// Generate realistic time based on peak patterns
// Morning: 8:30 AM to 9:15 AM (peak: 8:40 AM to 9:00 AM)
// Evening: 3:40 PM to 4:30 PM (peak: 3:40 PM to 4:15 PM)
function generateRealisticTime(date, preferPeak = false) {
  const newDate = new Date(date);
  const rand = Math.random();
  
  // 60% morning, 40% evening
  const isMorning = rand < 0.6;
  
  if (isMorning) {
    // Morning slot: 8:30 AM to 9:15 AM
    if (preferPeak || Math.random() < 0.7) {
      // Peak: 8:40 AM to 9:00 AM
      newDate.setHours(8, randomInt(40, 59), randomInt(0, 59), 0);
    } else {
      // Off-peak morning
      if (Math.random() < 0.5) {
        newDate.setHours(8, randomInt(30, 39), randomInt(0, 59), 0);
      } else {
        newDate.setHours(9, randomInt(0, 15), randomInt(0, 59), 0);
      }
    }
  } else {
    // Evening slot: 3:40 PM to 4:30 PM
    if (preferPeak || Math.random() < 0.7) {
      // Peak: 3:40 PM to 4:15 PM
      if (Math.random() < 0.6) {
        newDate.setHours(15, randomInt(40, 59), randomInt(0, 59), 0);
      } else {
        newDate.setHours(16, randomInt(0, 15), randomInt(0, 59), 0);
      }
    } else {
      // Off-peak evening
      newDate.setHours(16, randomInt(15, 30), randomInt(0, 59), 0);
    }
  }
  
  return newDate;
}

// Generate some off-peak times for variety
function generateOffPeakTime(date) {
  const newDate = new Date(date);
  const hours = [10, 11, 12, 13, 14, 17, 18]; // Off-peak hours
  newDate.setHours(randomElement(hours), randomInt(0, 59), randomInt(0, 59), 0);
  return newDate;
}

// Format date for MySQL
function formatMySQLDateTime(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// ==================== MAIN SEED FUNCTION ====================

async function seedData() {
  try {
    console.log('🌱 Starting seed process...\n');

    // 1. Fetch existing locations and checkpoints
    console.log('📍 Fetching existing locations and checkpoints...');
    const [locations] = await pool.query('SELECT location_id, location_name FROM Locations');
    const [checkpoints] = await pool.query('SELECT checkpoint_id, checkpoint_name, sequence_order FROM Checkpoints ORDER BY sequence_order');
    
    console.log(`   Found ${locations.length} locations:`, locations.map(l => l.location_name).join(', '));
    console.log(`   Found ${checkpoints.length} checkpoints:`, checkpoints.map(c => c.checkpoint_name).join(', '));
    
    if (locations.length === 0 || checkpoints.length === 0) {
      console.log('❌ No locations or checkpoints found. Please ensure they are set up first.');
      process.exit(1);
    }

    // 2. Hash the default password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, salt);

    // 3. Insert Students
    console.log('\n👨‍🎓 Inserting students...');
    const studentIds = [];
    
    for (let i = 0; i < studentNames.length; i++) {
      const name = studentNames[i];
      const email = name.toLowerCase().replace(/\s+/g, '.') + '@student.university.edu';
      const year = randomElement(years);
      const branch = randomElement(branches);
      const section = randomElement(sections);
      
      // Check if student already exists
      const [existing] = await pool.query('SELECT student_id FROM Students WHERE email = ?', [email]);
      
      if (existing.length > 0) {
        studentIds.push(existing[0].student_id);
        console.log(`   ⏭️  Student ${name} already exists (ID: ${existing[0].student_id})`);
      } else {
        const [result] = await pool.query(
          'INSERT INTO Students (name, year, branch, section, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
          [name, year, branch, section, email, passwordHash]
        );
        studentIds.push(result.insertId);
        console.log(`   ✅ Added student: ${name} (${branch} - Year ${year}, Section ${section})`);
      }
    }
    console.log(`   Total students: ${studentIds.length}`);

    // 4. Insert Drivers
    console.log('\n🚗 Inserting drivers...');
    const driverIds = [];
    
    for (let i = 0; i < driverNames.length; i++) {
      const name = driverNames[i];
      const email = name.toLowerCase().replace(/\s+/g, '.') + '@driver.auto.com';
      const autoRegNo = autoRegNos[i];
      
      // Check if driver already exists
      const [existing] = await pool.query('SELECT driver_id FROM Drivers WHERE email = ?', [email]);
      
      if (existing.length > 0) {
        driverIds.push(existing[0].driver_id);
        console.log(`   ⏭️  Driver ${name} already exists (ID: ${existing[0].driver_id})`);
      } else {
        const [result] = await pool.query(
          'INSERT INTO Drivers (name, auto_reg_no, email, password_hash, created_at) VALUES (?, ?, ?, ?, NOW())',
          [name, autoRegNo, email, passwordHash]
        );
        driverIds.push(result.insertId);
        console.log(`   ✅ Added driver: ${name} (${autoRegNo})`);
      }
    }
    console.log(`   Total drivers: ${driverIds.length}`);

    // 5. Insert Past Horns (student horn signals)
    console.log('\n📢 Inserting past horn records...');
    let hornCount = 0;
    
    // Generate 200-300 horn records over the past 30 days
    const hornRecordCount = randomInt(200, 300);
    
    for (let i = 0; i < hornRecordCount; i++) {
      const studentId = randomElement(studentIds);
      const locationId = randomElement(locations).location_id;
      
      // Generate date (past 30 days)
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - randomInt(0, 30));
      
      // 85% peak times, 15% off-peak
      let hornTime;
      if (Math.random() < 0.85) {
        hornTime = generateRealisticTime(baseDate, Math.random() < 0.6);
      } else {
        hornTime = generateOffPeakTime(baseDate);
      }
      
      // Status: older records are OFF, very recent ones might be ON
      const hoursAgo = (Date.now() - hornTime.getTime()) / (1000 * 60 * 60);
      const status = hoursAgo < 0.25 && Math.random() < 0.3 ? 'ON' : 'OFF';
      
      const [result] = await pool.query(
        'INSERT INTO PastHorns (student_id, location_id, status, created_at) VALUES (?, ?, ?, ?)',
        [studentId, locationId, status, formatMySQLDateTime(hornTime)]
      );
      hornCount++;
    }
    console.log(`   ✅ Added ${hornCount} horn records`);

    // 6. Insert Past Rides (driver rides)
    console.log('\n🛺 Inserting past ride records...');
    let rideCount = 0;
    
    // Generate 150-250 ride records over the past 30 days
    const rideRecordCount = randomInt(150, 250);
    
    // Drivers tend to start from checkpoint 1 in morning/evening
    const checkpoint1 = checkpoints.find(c => c.sequence_order === 1) || checkpoints[0];
    
    for (let i = 0; i < rideRecordCount; i++) {
      const driverId = randomElement(driverIds);
      
      // 70% chance to be at checkpoint 1 during peak times
      let checkpointId;
      const isPeakTimeRide = Math.random() < 0.7;
      
      if (isPeakTimeRide) {
        checkpointId = checkpoint1.checkpoint_id;
      } else {
        checkpointId = randomElement(checkpoints).checkpoint_id;
      }
      
      // Generate date (past 30 days)
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - randomInt(0, 30));
      
      // 80% peak times, 20% off-peak
      let rideTime;
      if (Math.random() < 0.80) {
        rideTime = generateRealisticTime(baseDate, Math.random() < 0.65);
      } else {
        rideTime = generateOffPeakTime(baseDate);
      }
      
      // Status: older records are OFF, very recent ones might be ON
      const minutesAgo = (Date.now() - rideTime.getTime()) / (1000 * 60);
      const status = minutesAgo < 15 && Math.random() < 0.2 ? 'ON' : 'OFF';
      
      const [result] = await pool.query(
        'INSERT INTO PastRides (driver_id, checkpoint_id, status, start_time) VALUES (?, ?, ?, ?)',
        [driverId, checkpointId, status, formatMySQLDateTime(rideTime)]
      );
      rideCount++;
    }
    console.log(`   ✅ Added ${rideCount} ride records`);

    // 7. Summary
    console.log('\n' + '='.repeat(50));
    console.log('✨ SEED DATA SUMMARY');
    console.log('='.repeat(50));
    console.log(`👨‍🎓 Students:      ${studentIds.length}`);
    console.log(`🚗 Drivers:       ${driverIds.length}`);
    console.log(`📢 Horn Records:  ${hornCount}`);
    console.log(`🛺 Ride Records:  ${rideCount}`);
    console.log('='.repeat(50));
    console.log(`\n🔐 Default Password for all accounts: ${DEFAULT_PASSWORD}`);
    console.log('\n📧 Sample Login Credentials:');
    console.log(`   Student: aarav.sharma@student.university.edu / ${DEFAULT_PASSWORD}`);
    console.log(`   Driver:  ramesh.kumar@driver.auto.com / ${DEFAULT_PASSWORD}`);
    console.log('\n✅ Seed completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedData();
