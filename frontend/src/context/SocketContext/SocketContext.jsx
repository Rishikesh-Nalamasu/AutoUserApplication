import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../AuthContext/AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, userType } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [checkpointData, setCheckpointData] = useState([]);
  const [userStatus, setUserStatus] = useState({
    isActive: false,
    hornId: null,
    rideId: null,
    locationId: null,
    checkpointId: null
  });
  const [message, setMessage] = useState(null);

  // Connect to socket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      
      const newSocket = io('http://localhost:5000', {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        // Request initial status
        newSocket.emit('get_status');
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // Handle data updates (locations and checkpoints)
      newSocket.on('data_update', (data) => {
        setLocationData(data.locations || []);
        setCheckpointData(data.checkpoints || []);
      });

      // Handle status updates
      newSocket.on('status_update', (status) => {
        setUserStatus({
          isActive: status.isActive,
          hornId: status.hornId,
          rideId: status.rideId,
          locationId: status.locationId,
          checkpointId: status.checkpointId
        });
      });

      // Handle horn responses
      newSocket.on('horn_response', (response) => {
        setMessage(response);
        if (response.success) {
          setUserStatus(prev => ({
            ...prev,
            isActive: response.hornId ? true : false,
            hornId: response.hornId || null
          }));
        }
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      });

      // Handle horn auto-stopped
      newSocket.on('horn_auto_stopped', (data) => {
        setMessage({ success: false, message: data.message });
        setUserStatus(prev => ({
          ...prev,
          isActive: false,
          hornId: null
        }));
        setTimeout(() => setMessage(null), 3000);
      });

      // Handle ride responses
      newSocket.on('ride_response', (response) => {
        setMessage(response);
        if (response.success) {
          setUserStatus(prev => ({
            ...prev,
            isActive: response.rideId ? true : !prev.isActive,
            rideId: response.rideId || null
          }));
        }
        setTimeout(() => setMessage(null), 3000);
      });

      // Handle checkpoint updates
      newSocket.on('checkpoint_update', (data) => {
        setUserStatus(prev => ({
          ...prev,
          checkpointId: data.checkpointId
        }));
      });

      // Handle ride auto-ended
      newSocket.on('ride_auto_ended', (data) => {
        setMessage({ success: false, message: data.message });
        setUserStatus(prev => ({
          ...prev,
          isActive: false,
          rideId: null
        }));
        setTimeout(() => setMessage(null), 3000);
      });

      // Handle errors
      newSocket.on('error', (error) => {
        setMessage({ success: false, message: error.message });
        setTimeout(() => setMessage(null), 3000);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      // Disconnect when logged out
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated]);

  // Get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true }
      );
    });
  };

  // Press Horn (Student)
  const pressHorn = useCallback(async () => {
    if (!socket || !isConnected) return;

    try {
      const location = await getCurrentLocation();
      socket.emit('horn_press', location);
    } catch (error) {
      setMessage({ success: false, message: 'Failed to get your location. Please enable location services.' });
      setTimeout(() => setMessage(null), 3000);
    }
  }, [socket, isConnected]);

  // Stop Horn (Student)
  const stopHorn = useCallback(() => {
    if (!socket || !isConnected) return;
    socket.emit('horn_stop');
  }, [socket, isConnected]);

  // Start Ride (Driver)
  const startRide = useCallback(async () => {
    if (!socket || !isConnected) return;

    try {
      const location = await getCurrentLocation();
      socket.emit('start_ride', location);
    } catch (error) {
      setMessage({ success: false, message: 'Failed to get your location. Please enable location services.' });
      setTimeout(() => setMessage(null), 3000);
    }
  }, [socket, isConnected]);

  // End Ride (Driver)
  const endRide = useCallback(() => {
    if (!socket || !isConnected) return;
    socket.emit('end_ride');
  }, [socket, isConnected]);

  // Send location updates periodically
  useEffect(() => {
    if (!socket || !isConnected || !userStatus.isActive) return;

    const sendLocationUpdate = async () => {
      try {
        const location = await getCurrentLocation();
        
        if (userType === 'student') {
          socket.emit('student_location_update', location);
        } else if (userType === 'driver') {
          socket.emit('driver_location_update', location);
        }
      } catch (error) {
        console.error('Failed to send location update:', error);
      }
    };

    // Different intervals for student (2 min) and driver (3 sec)
    const interval = userType === 'student' ? 120000 : 3000;
    const intervalId = setInterval(sendLocationUpdate, interval);

    return () => clearInterval(intervalId);
  }, [socket, isConnected, userStatus.isActive, userType]);

  const value = {
    socket,
    isConnected,
    locationData,
    checkpointData,
    userStatus,
    message,
    pressHorn,
    stopHorn,
    startRide,
    endRide
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
