class BoidState {
  constructor(separation, cohesion, alignment, visualRange, width, height, speedLimit = 3) {
    this.separation = separation;
    this.cohesion = cohesion;
    this.alignment = alignment;
    this.visualRange = visualRange;
    this.width = width;
    this.height = height;
    this.speedLimit = speedLimit;
  }
}

class Boid {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }
}

const boidDistance = (boid1, boid2) => {
  return Math.sqrt(
    Math.pow(boid1.x - boid2.x, 2) + Math.pow(boid1.y - boid2.y, 2)
  );
};

const buildNeighborsMap = (boids, state) => {
  const neighborsMap = new Map();
  for (let i = 0; i < boids.length; i++) {
    const boid = boids[i];
    const neighbors = [];
    for (let j = 0; j < boids.length; j++) {
      if (i === j) continue;
      if (boidDistance(boid, boids[j]) < state.visualRange) {
        neighbors.push(boids[j]);
      }
    }
    neighborsMap.set(boid, neighbors);
  }
  return neighborsMap;
};


const keepWithinBounds = (boid, state) => {
  if (boid.x < 0) boid.x = state.width;
  if (boid.x > state.width) boid.x = 0;
  if (boid.y < 0) boid.y = state.height;
  if (boid.y > state.height) boid.y = 0;
};

const limitSpeed = (boid, state) => {
  const speed = Math.sqrt(boid.dx * boid.dx + boid.dy * boid.dy);
  if (speed > state.speedLimit) {
    boid.dx = (boid.dx / speed) * state.speedLimit;
    boid.dy = (boid.dy / speed) * state.speedLimit;
  }
};

const separation = (boidNeighborMap, state, boid) => {
  const minDistance = 20;
  let moveX = 0;
  let moveY = 0;
  for (let otherBoid of boidNeighborMap.get(boid)) {
    if (boidDistance(boid, otherBoid) < minDistance) {
      moveX += boid.x - otherBoid.x;
      moveY += boid.y - otherBoid.y;
    }
  }
  boid.dx += moveX * state.separation;
  boid.dy += moveY * state.separation;
};

const cohesion = (boidNeighborMap, state, boid) => {
  const neighbors = boidNeighborMap.get(boid);
  if (neighbors.length === 0) return;
  const centerOfMass = { x: 0, y: 0 };
  neighbors.forEach((neighbor) => {
    centerOfMass.x += neighbor.x;
    centerOfMass.y += neighbor.y;
  });
  centerOfMass.x /= neighbors.length;
  centerOfMass.y /= neighbors.length;
  boid.dx += (centerOfMass.x - boid.x) * state.cohesion;
  boid.dy += (centerOfMass.y - boid.y) * state.cohesion;
};

const alignment = (boidNeighborMap, state, boid) => {
  const neighbors = boidNeighborMap.get(boid);
  if (neighbors.length === 0) return;
  const averageVelocity = { x: 0, y: 0 };
  neighbors.forEach((neighbor) => {
    averageVelocity.x += neighbor.dx;
    averageVelocity.y += neighbor.dy;
  });
  averageVelocity.x /= neighbors.length;
  averageVelocity.y /= neighbors.length;
  boid.dx += (averageVelocity.x - boid.dx) * state.alignment;
  boid.dy += (averageVelocity.y - boid.dy) * state.alignment;
};

const updateBoids = (boids, state) => {
  const boidNeighborMap = buildNeighborsMap(boids, state);
  for (let boid of boids) {
    separation(boidNeighborMap, state, boid);
    cohesion(boidNeighborMap, state, boid);
    alignment(boidNeighborMap, state, boid);
    keepWithinBounds(boid, state);
    limitSpeed(boid, state);
    boid.x += boid.dx;
    boid.y += boid.dy;
  }
};

export { Boid, BoidState, updateBoids };
