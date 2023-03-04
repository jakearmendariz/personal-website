class BoidState {
  constructor(seperation, cohesion, alignment, visualRange, width, height) {
    this.seperation = seperation;
    this.cohesion = cohesion;
    this.cohesion = cohesion;
    this.alignment = alignment;
    this.visualRange = visualRange;
    this.width = width;
    this.height = height;
    this.numBoids = 50;
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

// class BoidUpdates {
//   constructor(vx, vy) {
//     this.vx = vx;
//     this.vy = vy;
//   }
// }

const boidDistance = (boid1, boid2) => {
  // Calculate the distance between two boids
  return Math.sqrt(
    Math.pow(boid1.x - boid2.x, 2) + Math.pow(boid1.y - boid2.y, 2)
  );
};

const buildNeighborsMap = (boids, state) => {
  // Build a map of boids to their neighbors
  const neighborsMap = new Map();
  for (let i = 0; i < boids.length; i++) {
    const boid = boids[i];
    const neighbors = [];
    for (let j = 0; j < boids.length; j++) {
      if (i === j) continue;
      const otherBoid = boids[j];
      if (boidDistance(boid, otherBoid) < state.visualRange) {
        neighbors.push(otherBoid);
      }
    }
    // //console.log(boid, neighbors)
    neighborsMap.set(boid, neighbors);
  }
  return neighborsMap;
};

const buildInitialBoids = (numBoids, width, height) => {
  // Builds boids with random widths and heights,
  // but all heights are negative to keep them above screen
  const boids = [];
  for (let i = 0; i < numBoids; i++) {
    const boid = new Boid(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 10,
      Math.random() * 10
    );
    boids.push(boid);
  }
  return boids;
};

// Constrain a boid to within the window. If it gets too close to an edge,
// nudge it back in and reverse its direction.
const keepWithinBounds = (boid, boidState) => {
  const { width, height } = boidState;
  const margin = 200;
  const turnFactor = 1;
  if (boid.x < margin) {
    boid.dx += turnFactor;
  }
  if (boid.x > width - margin) {
    boid.dx -= turnFactor;
  }
  if (boid.y < margin) {
    boid.dy += turnFactor;
  }
  if (boid.y > height - margin) {
    boid.dy -= turnFactor;
  }
};

const limitSpeed = (boid) => {
  const speedLimit = 15;

  const speed = Math.sqrt(boid.dx * boid.dx + boid.dy * boid.dy);
  if (speed > speedLimit) {
    boid.dx = (boid.dx / speed) * speedLimit;
    boid.dy = (boid.dy / speed) * speedLimit;
  }
}

const updateBoids = (boids, state) => {
  // Update the velocity of each boid based on the rules of boids
  const boidNeighborMap = buildNeighborsMap(boids, state);
  const updates = [];
  for (let boid of boids) {
    seperation(boidNeighborMap, state, boid);
    cohesion(boidNeighborMap, state, boid);
    alignment(boidNeighborMap, state, boid);
    keepWithinBounds(boid, state);
    limitSpeed(boid);
  }
  console.log(boids[0].x, boids[0].y)
 
  for (let i = 0; i < boids.length; i++) {
    boids[i].x += boids[i].dx;
    boids[i].y += boids[i].dy;
  }
};

const updateBoid = (updates, i, ax, ay) => {
  updates[i].vx += ax;
  updates[i].vy += ay;
};

const seperation = (boidNeighborMap, state, boid) => {
  const minDistance = 20; // The distance to stay away from other boids
  let moveX = 0;
  let moveY = 0;
  for (let otherBoid of boidNeighborMap.get(boid)) {
    // console.log("seperation")
    if (otherBoid !== boid) {
        moveX += boid.x - otherBoid.x;
        moveY += boid.y - otherBoid.y;
    }
  }
  boid.dx += moveX * state.seperation;
  boid.dy += moveY * state.seperation;
};

const cohesion = (boidNeighborMap, state, boid) => {
  // Update the velocity of each boid to move towards the center of mass of its neighbors
  const centerOfMass = {
    x: 0,
    y: 0,
  };
  boidNeighborMap.get(boid).forEach((neighbor) => {
    centerOfMass.x += neighbor.x;
    centerOfMass.y += neighbor.y;
  });
  // console.log(centerOfMass.x, centerOfMass.y)
  centerOfMass.x /= boidNeighborMap.size;
  centerOfMass.y /= boidNeighborMap.size;
  // console.log(boidNeighborMap.size)
  // const xDiff = centerOfMass.x - boid.x;
  // const yDiff = centerOfMass.y - boid.y;
  // const angle = Math.atan2(yDiff, xDiff);
  // const ax = Math.cos(angle) * state.cohesion;
  // const ay = Math.sin(angle) * state.cohesion;
  boid.dx += (centerOfMass.x - boid.x) * state.cohesion;
  boid.dy += (centerOfMass.y - boid.y) * state.cohesion;
};

const alignment = (boidNeighborMap, state, boid) => {
  // Update the velocity of each boid to match the average velocity of its neighbors
  let i = 0;
  const averageVelocity = {
    x: 0,
    y: 0,
  };
  boidNeighborMap.get(boid).forEach((neighbor) => {
      averageVelocity.x += neighbor.dx;
      averageVelocity.y += neighbor.dy;
  });
  averageVelocity.x /= boidNeighborMap.size;
  averageVelocity.y /= boidNeighborMap.size;
  // console.log('avg', averageVelocity.x, averageVelocity.y)
  const xDiff = averageVelocity.x - boid.dx;
  const yDiff = averageVelocity.y - boid.dy;
  // console.log('x', xDiff, yDiff)
  // const angle = Math.atan2(yDiff, xDiff);
  boid.dx += xDiff * state.alignment;
  boid.dy += yDiff * state.alignment;
};

export { Boid, BoidState, updateBoids, buildInitialBoids };
