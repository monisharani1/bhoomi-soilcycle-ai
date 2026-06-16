// ============================================================
//  Bhoomi — Location Routes
//  POST /api/location/check-buildings
// ============================================================

const express = require('express');
const router = express.Router();
const { checkBuildings } = require('../services/buildingDetectionService');

/**
 * POST /api/location/check-buildings
 * Body: { latitude: 12.5211, longitude: 76.8958, radius: 80 }
 *
 * Returns whether there are buildings near the GPS coordinates
 * using the OpenStreetMap Overpass API.
 */
router.post('/location/check-buildings', async (req, res) => {
  const { latitude, longitude, radius } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: 'latitude and longitude are required.',
    });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const r = parseInt(radius) || 80;

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ success: false, message: 'Invalid coordinates.' });
  }

  if (r < 10 || r > 500) {
    return res.status(400).json({ success: false, message: 'Radius must be between 10 and 500 meters.' });
  }

  const result = await checkBuildings(lat, lon, r);
  return res.status(200).json(result);
});

module.exports = router;
