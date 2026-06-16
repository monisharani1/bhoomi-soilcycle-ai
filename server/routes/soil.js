// ============================================================
//  Bhoomi SoilCycle AI — Soil API Route
//  POST /api/detect-soil
// ============================================================

const express = require('express');
const router = express.Router();
const { detectSoil } = require('../services/soilDetectionService');

/**
 * POST /api/detect-soil
 * Body: { latitude: number, longitude: number }
 */
router.post('/detect-soil', (req, res) => {
  const { latitude, longitude } = req.body;

  // ── Presence check ──────────────────────────────────────
  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: 'latitude and longitude are required.',
    });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  // ── Numeric check ───────────────────────────────────────
  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({
      success: false,
      message: 'latitude and longitude must be valid numbers.',
    });
  }

  // ── Run detection ───────────────────────────────────────
  const result = detectSoil(lat, lon);

  if (!result.success) {
    return res.status(404).json(result);
  }

  return res.status(200).json(result);
});

/**
 * GET /api/detect-soil/districts
 * Returns all available districts in the dataset (useful for frontend dropdowns)
 */
router.get('/detect-soil/districts', (req, res) => {
  const soilDataset = require('../data/soilDataset');
  const districts = soilDataset.map((r) => ({
    id: r.id,
    district: r.district,
    state: r.state,
    soil_type: r.soil_type,
    center: {
      lat: ((r.lat_min + r.lat_max) / 2).toFixed(4),
      lon: ((r.lon_min + r.lon_max) / 2).toFixed(4),
    },
  }));
  return res.status(200).json({ success: true, count: districts.length, districts });
});

module.exports = router;
