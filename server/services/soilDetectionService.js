// ============================================================
//  Bhoomi SoilCycle AI — Soil Detection Service
//  Core logic: match GPS coordinates to soil region via bounding box
// ============================================================

const soilDataset = require('../data/soilDataset');

/**
 * Detect soil type and NPK values from latitude/longitude
 * Uses bounding-box range matching (MVP approach)
 *
 * @param {number} latitude
 * @param {number} longitude
 * @returns {object} Detection result
 */
function detectSoil(latitude, longitude) {
  // ── Input validation ──────────────────────────────────────
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return { success: false, message: 'Invalid coordinates provided.' };
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return { success: false, message: 'Coordinates out of valid range.' };
  }

  // ── Bounding box lookup ───────────────────────────────────
  // Find all matching regions (point-in-box)
  const matches = soilDataset.filter(
    (region) =>
      latitude >= region.lat_min &&
      latitude <= region.lat_max &&
      longitude >= region.lon_min &&
      longitude <= region.lon_max
  );

  if (matches.length === 0) {
    return {
      success: false,
      message: 'Soil data not available for this location yet.',
    };
  }

  // ── Pick best match ───────────────────────────────────────
  // If multiple regions overlap (edge cases), pick the one whose center
  // is closest to the farmer's GPS point
  const best = matches.reduce((closest, region) => {
    const centerLat = (region.lat_min + region.lat_max) / 2;
    const centerLon = (region.lon_min + region.lon_max) / 2;
    const dist = Math.hypot(latitude - centerLat, longitude - centerLon);

    const closestCenterLat = (closest.lat_min + closest.lat_max) / 2;
    const closestCenterLon = (closest.lon_min + closest.lon_max) / 2;
    const closestDist = Math.hypot(
      latitude - closestCenterLat,
      longitude - closestCenterLon
    );

    return dist < closestDist ? region : closest;
  });

  // ── Build response ────────────────────────────────────────
  return {
    success: true,
    location: {
      state: best.state,
      district: best.district,
      latitude,
      longitude,
    },
    soil: {
      soil_type: best.soil_type,
      soil_type_kn: best.soil_type_kn,
      confidence: best.confidence,
      description: best.description,
    },
    npk: {
      nitrogen: best.nitrogen,
      phosphorus: best.phosphorus,
      potassium: best.potassium,
      values: best.npk_values,
    },
    meta: {
      region_id: best.id,
      matched_by: 'bounding_box',
    },
  };
}

module.exports = { detectSoil };
