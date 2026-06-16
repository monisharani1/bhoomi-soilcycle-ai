// ============================================================
//  Bhoomi — Building Detection Service
//  Uses OpenStreetMap Overpass API (FREE, no API key needed)
//  Detects buildings/structures within a radius of GPS coords
// ============================================================

const axios = require('axios');

/**
 * Check if there are buildings near given coordinates.
 * Uses Overpass API to query OpenStreetMap data.
 *
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in meters (default 80m)
 */
async function checkBuildings(lat, lon, radius = 80) {
  // Overpass QL query — find buildings and structures in radius
  const query = `
[out:json][timeout:12];
(
  way["building"](around:${radius},${lat},${lon});
  relation["building"](around:${radius},${lat},${lon});
  node["building"](around:${radius},${lat},${lon});
  way["amenity"](around:${radius},${lat},${lon});
  way["landuse"="residential"](around:${radius},${lat},${lon});
  way["landuse"="commercial"](around:${radius},${lat},${lon});
  way["landuse"="industrial"](around:${radius},${lat},${lon});
);
out body qt;
`;

  try {
    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      query.trim(),
      {
        headers: { 'Content-Type': 'text/plain' },
        timeout: 15000,
      }
    );

    const elements = response.data?.elements || [];
    const buildingCount = elements.filter(
      (el) => el.tags?.building || el.tags?.amenity
    ).length;
    const structureCount = elements.length;
    const hasBuildings = structureCount > 0;

    // Classify what was found
    const types = [...new Set(
      elements
        .map((el) => el.tags?.building || el.tags?.landuse || el.tags?.amenity)
        .filter(Boolean)
    )].slice(0, 5);

    return {
      success: true,
      has_buildings: hasBuildings,
      building_count: buildingCount,
      structure_count: structureCount,
      structure_types: types,
      radius_meters: radius,
      caution: hasBuildings
        ? `${structureCount} structure(s) detected within ${radius}m of your location. This area may overlap with built-up zones — not ideal for farming.`
        : null,
      source: 'OpenStreetMap Overpass API',
    };
  } catch (err) {
    // If Overpass is unreachable, don't block the user
    console.warn('⚠️  Overpass API unreachable:', err.message);
    return {
      success: false,
      has_buildings: false,
      error: 'Building check temporarily unavailable.',
      caution: null,
    };
  }
}

module.exports = { checkBuildings };
