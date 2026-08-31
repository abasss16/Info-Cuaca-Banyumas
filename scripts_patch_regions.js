const fs = require('fs');

const { BANYUMAS_KECAMATAN_BOUNDARY_MAP, BANYUMAS_OFFICIAL_GEOJSON } = require('./src/data/banyumasGeoJson.ts');

// We can read current banyumasRegions.ts and update each region's boundaryCoords and boundaryMultiCoords from BANYUMAS_KECAMATAN_BOUNDARY_MAP
// Let's write a script to patch banyumasRegions.ts
