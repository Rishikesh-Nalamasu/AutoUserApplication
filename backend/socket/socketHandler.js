import jwt from 'jsonwebtoken';
import Location from '../models/Location.js';
import Checkpoint from '../models/Checkpoint.js';
import PastHorn from '../models/PastHorn.js';
import PastRide from '../models/PastRide.js';
import Student from '../models/Student.js';
import Driver from '../models/Driver.js';

// Store active intervals for cleanup
const studentIntervals = new Map();
const driverIntervals = new Map();

// Broadcast updated data to all connected clients
const broadcastUpdate = async (io) => {
  try {
    const [locationData, checkpointData] = await Promise.all([
      PastHorn.getActiveByLocation(),
      PastRide.getActiveByCheckpoint()
    ]);

    io.emit('data_update', {
      locations: locationData,
      checkpoints: checkpointData
    });
  } catch (error) {
    console.error('Broadcast update error:', error);
  }
};

// Initialize socket handler
const initializeSocket = (io) => {
  // Authentication middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      let user;
      if (decoded.type === 'student') {
        user = await Student.findById(decoded.id);
      } else if (decoded.type === 'driver') {
        user = await Driver.findById(decoded.id);
      }

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      socket.userType = decoded.type;
      socket.userId = decoded.id;
      
      next();
    } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userType} - ${socket.userId}`);

    // Send initial data
    await broadcastUpdate(io);

    // Get user's current horn/ride status
    socket.on('get_status', async () => {
      try {
        if (socket.userType === 'student') {
          const lastHorn = await PastHorn.getLastByStudentId(socket.userId);
          socket.emit('status_update', {
            type: 'student',
            isActive: lastHorn?.status === 'ON',
            hornId: lastHorn?.horn_id,
            locationId: lastHorn?.location_id
          });
        } else if (socket.userType === 'driver') {
          const lastRide = await PastRide.getLastByDriverId(socket.userId);
          socket.emit('status_update', {
            type: 'driver',
            isActive: lastRide?.status === 'ON',
            rideId: lastRide?.ride_id,
            checkpointId: lastRide?.checkpoint_id
          });
        }
      } catch (error) {
        console.error('Get status error:', error);
        socket.emit('error', { message: 'Failed to get status' });
      }
    });

    // Student: Press Horn
    socket.on('horn_press', async (data) => {
      try {
        if (socket.userType !== 'student') {
          return socket.emit('error', { message: 'Only students can horn' });
        }

        const { latitude, longitude } = data;

        // Check if student is inside any geofenced location
        const location = await Location.findLocationByCoordinates(latitude, longitude);

        if (!location) {
          return socket.emit('horn_response', {
            success: false,
            message: 'You are not inside any designated location'
          });
        }

        // Create horn record
        const hornId = await PastHorn.create(socket.userId, location.location_id);

        // Start 2-minute interval to check if student is still in location
        const intervalId = setInterval(async () => {
          // This will be triggered by location updates from client
        }, 120000); // 2 minutes

        studentIntervals.set(socket.userId, intervalId);

        socket.emit('horn_response', {
          success: true,
          message: 'Horn activated',
          hornId,
          locationName: location.location_name
        });

        // Broadcast update to all clients
        await broadcastUpdate(io);
      } catch (error) {
        console.error('Horn press error:', error);
        socket.emit('error', { message: 'Failed to activate horn' });
      }
    });

    // Student: Stop Horn
    socket.on('horn_stop', async () => {
      try {
        if (socket.userType !== 'student') {
          return socket.emit('error', { message: 'Only students can stop horn' });
        }

        // Get last active horn and turn it off
        const lastHorn = await PastHorn.getLastByStudentId(socket.userId);
        
        if (lastHorn && lastHorn.status === 'ON') {
          await PastHorn.updateStatus(lastHorn.horn_id, 'OFF');
          
          // Clear interval
          if (studentIntervals.has(socket.userId)) {
            clearInterval(studentIntervals.get(socket.userId));
            studentIntervals.delete(socket.userId);
          }
        }

        socket.emit('horn_response', {
          success: true,
          message: 'Horn stopped'
        });

        // Broadcast update to all clients
        await broadcastUpdate(io);
      } catch (error) {
        console.error('Horn stop error:', error);
        socket.emit('error', { message: 'Failed to stop horn' });
      }
    });

    // Student: Location update (for checking if still in geofence)
    socket.on('student_location_update', async (data) => {
      try {
        if (socket.userType !== 'student') return;

        const { latitude, longitude } = data;
        const lastHorn = await PastHorn.getLastByStudentId(socket.userId);

        if (lastHorn && lastHorn.status === 'ON') {
          // Check if still in any location
          const location = await Location.findLocationByCoordinates(latitude, longitude);

          if (!location) {
            // Student left the geofenced area, turn off horn
            await PastHorn.updateStatus(lastHorn.horn_id, 'OFF');
            
            socket.emit('horn_auto_stopped', {
              message: 'You left the location area. Horn stopped automatically.'
            });

            // Clear interval
            if (studentIntervals.has(socket.userId)) {
              clearInterval(studentIntervals.get(socket.userId));
              studentIntervals.delete(socket.userId);
            }

            await broadcastUpdate(io);
          }
        }
      } catch (error) {
        console.error('Student location update error:', error);
      }
    });

    // Driver: Start Ride
    socket.on('start_ride', async (data) => {
      try {
        if (socket.userType !== 'driver') {
          return socket.emit('error', { message: 'Only drivers can start ride' });
        }

        const { latitude, longitude } = data;

        // Find nearest checkpoint
        const nearestCheckpoint = await Checkpoint.findNearest(latitude, longitude);

        if (!nearestCheckpoint) {
          return socket.emit('ride_response', {
            success: false,
            message: 'No checkpoints found'
          });
        }

        // Create ride record
        const rideId = await PastRide.create(socket.userId, nearestCheckpoint.checkpoint_id);

        // Start 3-second interval to update checkpoint
        const intervalId = setInterval(async () => {
          // This will be handled by driver_location_update event
        }, 3000);

        driverIntervals.set(socket.userId, intervalId);

        socket.emit('ride_response', {
          success: true,
          message: 'Ride started',
          rideId,
          checkpointName: nearestCheckpoint.checkpoint_name
        });

        // Broadcast update to all clients
        await broadcastUpdate(io);
      } catch (error) {
        console.error('Start ride error:', error);
        socket.emit('error', { message: 'Failed to start ride' });
      }
    });

    // Driver: End Ride
    socket.on('end_ride', async () => {
      try {
        if (socket.userType !== 'driver') {
          return socket.emit('error', { message: 'Only drivers can end ride' });
        }

        // Get last active ride and turn it off
        const lastRide = await PastRide.getLastByDriverId(socket.userId);
        
        if (lastRide && lastRide.status === 'ON') {
          await PastRide.updateStatus(lastRide.ride_id, 'OFF');
          
          // Clear interval
          if (driverIntervals.has(socket.userId)) {
            clearInterval(driverIntervals.get(socket.userId));
            driverIntervals.delete(socket.userId);
          }
        }

        socket.emit('ride_response', {
          success: true,
          message: 'Ride ended'
        });

        // Broadcast update to all clients
        await broadcastUpdate(io);
      } catch (error) {
        console.error('End ride error:', error);
        socket.emit('error', { message: 'Failed to end ride' });
      }
    });

    // Driver: Location update (for updating nearest checkpoint)
    socket.on('driver_location_update', async (data) => {
      try {
        if (socket.userType !== 'driver') return;

        const { latitude, longitude } = data;
        const lastRide = await PastRide.getLastByDriverId(socket.userId);

        if (lastRide && lastRide.status === 'ON') {
          // Find nearest checkpoint
          const nearestCheckpoint = await Checkpoint.findNearest(latitude, longitude);

          if (nearestCheckpoint && nearestCheckpoint.checkpoint_id !== lastRide.checkpoint_id) {
            // Update checkpoint
            await PastRide.updateCheckpoint(lastRide.ride_id, nearestCheckpoint.checkpoint_id);

            socket.emit('checkpoint_update', {
              checkpointId: nearestCheckpoint.checkpoint_id,
              checkpointName: nearestCheckpoint.checkpoint_name
            });

            await broadcastUpdate(io);
          }

          // Check if ride has been active for more than 15 minutes
          const startTime = new Date(lastRide.start_time);
          const now = new Date();
          const diffMinutes = (now - startTime) / (1000 * 60);

          if (diffMinutes >= 15) {
            await PastRide.updateStatus(lastRide.ride_id, 'OFF');
            
            socket.emit('ride_auto_ended', {
              message: 'Ride automatically ended after 15 minutes'
            });

            if (driverIntervals.has(socket.userId)) {
              clearInterval(driverIntervals.get(socket.userId));
              driverIntervals.delete(socket.userId);
            }

            await broadcastUpdate(io);
          }
        }
      } catch (error) {
        console.error('Driver location update error:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userType} - ${socket.userId}`);
      
      // Clean up intervals
      if (socket.userType === 'student' && studentIntervals.has(socket.userId)) {
        clearInterval(studentIntervals.get(socket.userId));
        studentIntervals.delete(socket.userId);
      }
      
      if (socket.userType === 'driver' && driverIntervals.has(socket.userId)) {
        clearInterval(driverIntervals.get(socket.userId));
        driverIntervals.delete(socket.userId);
      }
    });
  });

  // Background task: End expired rides every minute
  setInterval(async () => {
    try {
      const endedCount = await PastRide.endExpiredRides();
      if (endedCount > 0) {
        console.log(`Auto-ended ${endedCount} expired rides`);
        await broadcastUpdate(io);
      }
    } catch (error) {
      console.error('End expired rides error:', error);
    }
  }, 60000); // Check every minute
};

export default initializeSocket;
