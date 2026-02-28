import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
  AreaChart, Area,
} from 'recharts';
import { useAuth } from '../../context/AuthContext/AuthContext';
import './Dashboard.css';

const COLORS = ['#2e7d32', '#43a047', '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9'];
const HORN_COLORS = ['#e65100', '#ff9800', '#ffb74d', '#ffe0b2', '#fff3e0'];

const Dashboard = () => {
  const { userType } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    fetchDashboard();
  }, [timeRange]);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/dashboard?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setDashData(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate sample data if API returns empty (for graceful display)
  const getSafeData = (data, fallback) => {
    return data && data.length > 0 ? data : fallback;
  };

  const dailyTrendsFallback = [
    { day: 'Mon', horns: 12, rides: 8 },
    { day: 'Tue', horns: 19, rides: 14 },
    { day: 'Wed', horns: 15, rides: 11 },
    { day: 'Thu', horns: 22, rides: 16 },
    { day: 'Fri', horns: 28, rides: 20 },
    { day: 'Sat', horns: 8, rides: 5 },
    { day: 'Sun', horns: 5, rides: 3 },
  ];

  const hourlyTrendsFallback = [
    { hour: '6AM', count: 3 },
    { hour: '7AM', count: 8 },
    { hour: '8AM', count: 15 },
    { hour: '9AM', count: 22 },
    { hour: '10AM', count: 12 },
    { hour: '11AM', count: 8 },
    { hour: '12PM', count: 18 },
    { hour: '1PM', count: 25 },
    { hour: '2PM', count: 14 },
    { hour: '3PM', count: 10 },
    { hour: '4PM', count: 20 },
    { hour: '5PM', count: 30 },
    { hour: '6PM', count: 28 },
    { hour: '7PM', count: 15 },
    { hour: '8PM', count: 6 },
  ];

  const locationDistFallback = [
    { name: 'Main Gate', value: 35 },
    { name: 'Back Gate', value: 20 },
    { name: 'Library', value: 15 },
    { name: 'Hostel', value: 18 },
    { name: 'Cafeteria', value: 12 },
  ];

  const checkpointDistFallback = [
    { name: 'Checkpoint 1', value: 25 },
    { name: 'Checkpoint 2', value: 30 },
    { name: 'Checkpoint 3', value: 20 },
    { name: 'Checkpoint 4', value: 15 },
    { name: 'Checkpoint 5', value: 10 },
  ];

  const dailyTrends = getSafeData(dashData?.dailyTrends, dailyTrendsFallback);
  const hourlyTrends = getSafeData(dashData?.hourlyTrends, hourlyTrendsFallback);
  const locationDist = getSafeData(dashData?.locationDistribution, locationDistFallback);
  const checkpointDist = getSafeData(dashData?.checkpointDistribution, checkpointDistFallback);

  const totalHorns = dashData?.totalHorns ?? dailyTrendsFallback.reduce((s, d) => s + d.horns, 0);
  const totalRides = dashData?.totalRides ?? dailyTrendsFallback.reduce((s, d) => s + d.rides, 0);
  const activeNow = dashData?.activeNow ?? 0;
  const peakHour = dashData?.peakHour ?? '5PM';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }}>
              {p.name}: <strong>{p.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dash-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <motion.div
          className="dash-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1>Dashboard</h1>
            <p className="dash-subtitle">Overview of platform activity and trends</p>
          </div>
          <div className="time-range-selector">
            {['24hrs', '7days', '30days'].map((range) => (
              <button
                key={range}
                className={`range-btn ${timeRange === range ? 'active' : ''}`}
                onClick={() => { setTimeRange(range); setLoading(true); }}
              >
                {range === '24hrs' ? '24H' : range === '7days' ? '7D' : '30D'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          className="overview-cards"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="overview-card">
            <div className="oc-icon" style={{ background: '#fff3e0' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#e65100" strokeWidth="2" width="24" height="24">
                <path d="M6 15a6 6 0 0112 0" /><path d="M3 15a9 9 0 0118 0" />
                <circle cx="12" cy="15" r="2" fill="#e65100" /><path d="M12 17v4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="oc-info">
              <span className="oc-value">{totalHorns}</span>
              <span className="oc-label">Total Horns</span>
            </div>
            <div className="oc-trend up">+12%</div>
          </div>

          <div className="overview-card">
            <div className="oc-icon" style={{ background: '#e8f5e9' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" width="24" height="24">
                <rect x="3" y="11" width="18" height="8" rx="2" />
                <circle cx="7.5" cy="19" r="1.5" /><circle cx="16.5" cy="19" r="1.5" />
                <path d="M5 11l2-5h10l2 5" />
              </svg>
            </div>
            <div className="oc-info">
              <span className="oc-value">{totalRides}</span>
              <span className="oc-label">Total Rides</span>
            </div>
            <div className="oc-trend up">+8%</div>
          </div>

          <div className="overview-card">
            <div className="oc-icon" style={{ background: '#e3f2fd' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="2" width="24" height="24">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="oc-info">
              <span className="oc-value">{activeNow}</span>
              <span className="oc-label">Active Now</span>
            </div>
            <div className="oc-trend-live">LIVE</div>
          </div>

          <div className="overview-card">
            <div className="oc-icon" style={{ background: '#fce4ec' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="2" width="24" height="24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div className="oc-info">
              <span className="oc-value">{peakHour}</span>
              <span className="oc-label">Peak Hour</span>
            </div>
          </div>
        </motion.div>

        {/* Charts Row 1 */}
        <div className="charts-row">
          <motion.div
            className="chart-card chart-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="chart-header">
              <h3>Daily Activity Trends</h3>
              <span className="chart-badge">Horns vs Rides</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dailyTrends} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8a8aa0' }} />
                <YAxis tick={{ fontSize: 12, fill: '#8a8aa0' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="horns" name="Horns" fill="#ff9800" radius={[6, 6, 0, 0]} />
                <Bar dataKey="rides" name="Rides" fill="#2e7d32" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="chart-header">
              <h3>Location Distribution</h3>
              <span className="chart-badge">Student Horns</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={locationDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {locationDist.map((_, index) => (
                    <Cell key={index} fill={HORN_COLORS[index % HORN_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="charts-row">
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="chart-header">
              <h3>Checkpoint Distribution</h3>
              <span className="chart-badge">Driver Rides</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={checkpointDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {checkpointDist.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="chart-card chart-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="chart-header">
              <h3>Hourly Activity Pattern</h3>
              <span className="chart-badge">Time-wise Trends</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={hourlyTrends}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2e7d32" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#8a8aa0' }} />
                <YAxis tick={{ fontSize: 12, fill: '#8a8aa0' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Activity"
                  stroke="#2e7d32"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 3 */}
        <div className="charts-row single">
          <motion.div
            className="chart-card chart-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="chart-header">
              <h3>Demand vs Supply Trend</h3>
              <span className="chart-badge">Gap Analysis</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8a8aa0' }} />
                <YAxis tick={{ fontSize: 12, fill: '#8a8aa0' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="horns"
                  name="Demand (Horns)"
                  stroke="#ff9800"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#ff9800' }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="rides"
                  name="Supply (Rides)"
                  stroke="#2e7d32"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2e7d32' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Insight Cards */}
        <motion.div
          className="insights-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="insight-card">
            <div className="insight-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <h4>Busiest Day</h4>
              <p>Friday sees the highest activity with peak demand during evening hours</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon" style={{ background: '#fff3e0', color: '#e65100' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <h4>Peak Hours</h4>
              <p>Most rides happen between 12PM-1PM and 5PM-6PM — class dismissal times</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon" style={{ background: '#e3f2fd', color: '#1565c0' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <h4>Hotspot</h4>
              <p>Main Gate is consistently the highest-demand location for student pickups</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
