// Sum array
const sum = arr => arr.reduce((acc, v) => acc + v, 0);

// Vector length
const len = a => Math.sqrt(sum(a.map(v => v ** 2)));

// Create unit vector
const unitV = a => {
  const lenA = len(a);
  return a.map(v => v / lenA);
};

// Get dot product (cosine of ab) of 2 vectors
const dotP = (a, b) => sum(a.map((v, i) => v * b[i]));

// Radians to degrees and vice versa
const rtd = v => (v * 180) / Math.PI;
const dtr = v => (v * Math.PI) / 180;

// Get angle between vectors
const angleAB = (a, b) => Math.acos(dotP(unitV(a), unitV(b)));

// Subtract vector b from vector a
const subAB = (a, b) => b.map((v, i) => a[i] - v);

// Scale vector
const scale = (a, amount) => a.map(v => v * amount);

// project vector a on vector b
const project = (a, b) => {
  // longitudinal is length of a * cos of angle, which is the dot product of the unit vectors
  const lon = len(a) * dotP(unitV(a), unitV(b));
  // Scale b vector by this much
  const lonV = scale(unitV(b), lon);
  // lateral is a - lon * unit vector b
  const latV = subAB(a, lonV);
  return [lonV, latV];
};

// project vector a on vector b, get only components relative to b
const projectedComponents = (a, b) => {
  // longitudinal is length of a * cos of angle, which is the dot product of the unit vectors
  const lon = len(a) * dotP(unitV(a), unitV(b));
  // lateral is a - lon * unit vector b
  const lat = len(subAB(a, scale(unitV(b), lon)));
  return [lon, lat];
};

const a = [3.2, 7];
const b = [8, 4];

console.log(project(a, b));
