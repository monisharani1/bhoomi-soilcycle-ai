// ============================================================
//  Bhoomi SoilCycle AI — Express Server Entry Point
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const soilRoutes = require('./routes/soil');
const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/location');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || '*',
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: '🌱 Bhoomi SoilCycle AI — Backend API',
    version: '2.0.0',
    status: 'running',
    mode: (process.env.TWILIO_ACCOUNT_SID ? 'production' : 'development'),
    endpoints: {
      send_otp:        'POST /api/auth/send-otp',
      verify_otp:      'POST /api/auth/verify-otp',
      detect_soil:     'POST /api/detect-soil',
      list_districts:  'GET  /api/detect-soil/districts',
      check_buildings: 'POST /api/location/check-buildings',
    },
  });
});

// ── API Routes ───────────────────────────────────────────────
app.use('/api', authRoutes);
app.use('/api', soilRoutes);
app.use('/api', locationRoutes);

// ── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌱 Bhoomi Backend running at http://localhost:${PORT}`);
  console.log(`🔐 POST /api/auth/send-otp       →  Send OTP`);
  console.log(`✅ POST /api/auth/verify-otp      →  Verify OTP`);
  console.log(`📍 POST /api/detect-soil          →  Soil detection`);
  console.log(`🏠 POST /api/location/check-buildings → Building scan`);
  console.log(`📋 GET  /api/detect-soil/districts   →  All districts`);
  console.log(`\n🔑 SMS Mode: ${process.env.TWILIO_ACCOUNT_SID ? '✅ Twilio (real SMS)' : '🟡 Dev mode (OTP in console)'}\n`);
});

module.exports = app;
