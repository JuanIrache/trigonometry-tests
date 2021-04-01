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

console.log('Projected vector 2D', project(a, b));

const c = [4, 2.5, 2.5];
const d = [5, 0, 3.1];

console.log('Projected vector 3D', project(c, d));

// Rotate a vector by an amount
const rotate = (a, angle) => [
  Math.cos(angle) * a[0] - Math.sin(angle) * a[1],
  Math.sin(angle) * a[0] + Math.cos(angle) * a[1]
];

// Rotate one angle a to align it with another b (2D). Like moving the frame of coordinates to align with b
// Many orders of magnitude faster than projectedComponents
const alignAngles = (a, b) => {
  const angleB = Math.atan2(b[1], b[0]);
  return rotate(a, -angleB);
};

// Rotate (2D vectors) a to align it to b, then create separate vectors for its components and unrotate
// Many orders of magnitude faster
const projectFast = (a, b) => {
  const angleB = Math.atan2(b[1], b[0]);
  const alignedA = rotate(a, -angleB);
  const unalignedAX = rotate([alignedA[0], 0], angleB);
  const unalignedAY = rotate([0, alignedA[1]], angleB);
  return [unalignedAX, unalignedAY];
};

// Benchmark
// let t1 = Date.now();
// let _;
// for (let i = 0; i < 9999999; i++) {
//   _ = projectFast(a, b);
// }
// console.log(Date.now() - t1);

console.log('Projected vector 2D fast', projectFast(a, b));

console.log('Projected components', projectedComponents(a, b));
console.log('Projected components 2D fast', alignAngles(a, b));

// Can the fast version be adapted to 3D?
