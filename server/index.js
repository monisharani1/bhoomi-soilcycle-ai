// ============================================================
//  Bhoomi SoilCycle AI — Express Server Entry Point
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const soilRoutes = require('./routes/soil');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // CRA fallback
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
    version: '1.0.0',
    status: 'running',
    endpoints: {
      detect_soil: 'POST /api/detect-soil',
      list_districts: 'GET /api/detect-soil/districts',
    },
  });
});

// ── API Routes ───────────────────────────────────────────────
app.use('/api', soilRoutes);

// ── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌱 Bhoomi Backend running at http://localhost:${PORT}`);
  console.log(`📍 POST /api/detect-soil  →  Soil detection`);
  console.log(`📋 GET  /api/detect-soil/districts  →  All districts\n`);
});

module.exports = app;
