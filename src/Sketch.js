// Preloaded image objects
// import {BoidState, updateBoids, buildInitialBoids} from './Boids.js';

let planet, ast, sun;

const drawRocketBase = (p, rocket) => {
    p.fill(220, 220, 220);
    p.rect(rocket.x, rocket.y, rocket.width, rocket.height);
    p.fill(200, 200, 200);
    p.rect(rocket.x, rocket.y, rocket.width / 6, rocket.height);
    p.fill(180, 180, 180);
    p.rect(rocket.x + rocket.width / 3, rocket.y, (rocket.width * 2) / 3, rocket.height);
    p.fill(130, 130, 130);
    p.rect(rocket.x + (rocket.width * 2) / 3, rocket.y, (rocket.width * 1) / 3, rocket.height);
}

const drawWingsAndTip = (p, rocket) => {
    const r = 160, g = 1, b = 70;
    p.fill(r, g, b);
    p.triangle(
        rocket.x,
        rocket.y,
        rocket.x + rocket.width / 2,
        rocket.y - rocket.height * (6 / 16),
        rocket.x + rocket.width,
        rocket.y
    );
    p.ellipse(
        rocket.x + rocket.width / 2,
        rocket.y + rocket.height * 0.01,
        rocket.width,
        rocket.height * 0.2
    );
    p.fill(r + 20, g + 20, b + 20);
    p.triangle(rocket.x, rocket.y + rocket.height, rocket.x - rocket.width / 2, rocket.y + rocket.height,
        rocket.x, rocket.y + rocket.height / 4);
    p.fill(r, g, b);
    p.triangle(rocket.x + (3 / 2) * rocket.width, rocket.y + rocket.height, rocket.x + rocket.width, rocket.y + rocket.height,
        rocket.x + rocket.width, rocket.y + rocket.height / 4);
    p.triangle(rocket.x + rocket.width / 3, rocket.y + rocket.height, rocket.x + rocket.width * (2 / 3),
        rocket.y + rocket.height, rocket.x + rocket.width / 2, rocket.y + rocket.height / 4);
}

const drawFlames = (p, rocket, flame) => {
    if (flame) {
        p.fill(255, 100, 10);
        p.triangle(rocket.x, rocket.y + rocket.height, rocket.x + rocket.width, rocket.y + rocket.height,
            rocket.x + rocket.width / 2, rocket.y + rocket.height * (9 / 6));
        p.fill(210, 230, 0);
        p.triangle(rocket.x + rocket.width / 4, rocket.y + rocket.height, rocket.x + rocket.width - rocket.width / 4,
            rocket.y + rocket.height, rocket.x + rocket.width / 2, rocket.y + rocket.height * (8 / 6));
    } else {
        p.fill(255, 100, 10);
        p.triangle(rocket.x, rocket.y + rocket.height, rocket.x + rocket.width, rocket.y + rocket.height,
            rocket.x + rocket.width / 2, rocket.y + rocket.height * (11 / 6));
        p.fill(210, 230, 0);
        p.triangle(rocket.x + rocket.width / 4, rocket.y + rocket.height, rocket.x + rocket.width - rocket.width / 4,
            rocket.y + rocket.height, rocket.x + rocket.width / 2, rocket.y + rocket.height * (10 / 6));
    }
}

const drawExplosion = (p, x, y, radius) => {
    p.fill(255, 180, 0);
    p.ellipse(x, y, radius, radius);
}

const drawRocket = (p, rocket, flame) => {
    drawRocketBase(p, rocket);
    drawWingsAndTip(p, rocket);
    drawFlames(p, rocket, flame);
}

// const drawBoids = (p, boids) => {
//     boids.forEach(boid => drawBoid(p, boid));
// }

// const drawBoid = (p, boid) => {
//     p.fill(255, 255, 255);
//     p.ellipse(boid.x, boid.y, 10, 10);
// }

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

const SUN = 0;
const PLANET = 1;
const AST = 2;
class Asteroid {
    constructor(x, y, radius, width) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = 1 / radius * width / 4;
        const ratio = (this.radius) / width;
        if (ratio > 1 / 12) {
            this.type = SUN;
            this.health = 3;
        } else if (ratio > 1 / 18) {
            this.type = PLANET;
            this.health = 2;
        } else {
            this.type = AST;
            this.health = 1;
        }
    }
}

class Rocket {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0.010 * width;
        this.height = height * 0.1;
        this.width = this.height * (45 / 175);
    }
}

const drawAsteroid = (p, asteroid) => {
    const diameter = (asteroid.radius * 2);
    if (asteroid.type === SUN) {
        p.image(sun, asteroid.x - asteroid.radius, asteroid.y - asteroid.radius, diameter, diameter)
    } else if (asteroid.type === PLANET) {
        p.image(planet, asteroid.x - asteroid.radius, asteroid.y - asteroid.radius, diameter, diameter)
    } else {
        p.image(ast, asteroid.x - asteroid.radius, asteroid.y - asteroid.radius, diameter, diameter)
    }
}

const drawAsteroids = (p, asteroids) => {
    asteroids.forEach(asteroid => {
        drawAsteroid(p, asteroid);
    });
}

const buildAsteroid = (p) => {
    const radius = random(0.03 * p.width, 0.09 * p.width);
    const asteroid = new Asteroid(random(1, p.width - 20), random(-1 * radius, -1 * p.height),
        radius, p.width)
    return asteroid;
}

const buildAsteroids = (p, n) => {
    let asteroids = [];
    for (let i = 0; i < n; i++) {
        asteroids.push(buildAsteroid(p))
    }
    return asteroids;
}

const drawShots = (p, shots) => {
    p.fill(255, 238, 0);
    for (let i = 0; i < shots.length; i++) {
        p.rect(shots[i][0], shots[i][1], 6, 20);
        if (shots[i][1] < 0) {
            shots.splice(i, 1);
        }
    }
}

export default function sketch(p) {
    let direction, moving, tilting;
    let rocket;
    let shots, flame, shotUpdate;
    let tiltSpeed;
    let gameStarted;
    let explosionPresent;
    let explosionWidth;
    let explosionX, explosionY;
    let asteroids;
    let score;
    let gameCounter;
    // let boids;
    // let boidState;


    p.preload = () => {
        planet = p.loadImage('planet.png');
        sun = p.loadImage('sun.png');
        ast = p.loadImage('asteroid.png');
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noStroke();
        direction = 0;
        moving = false;
        tilting = false;
        explosionPresent = false;
        explosionWidth = 0;
        explosionX = 0;
        explosionY = 0;
        tiltSpeed = 0;
        rocket = new Rocket(
            p.windowWidth / 2,
            p.windowHeight * (3 / 4),
            p.windowWidth,
            p.windowHeight
        );
        shots = [];
        shotUpdate = 0.015 * p.height;
        asteroids = buildAsteroids(p, 8);
        flame = false;
        gameStarted = false;
        score = 0;
        // Number of updates
        // gameCounter = 0;
        // boids = buildInitialBoids(50, p.windowWidth, p.windowHeight);
        
        // boidState = new BoidState(0.05, 0.005, 0.05, 300,  p.windowWidth, p.windowHeight);
        // //console.log(boids)
        // updateBoids(boids, boidState);
        //console.log(boids)

        requestDeviceOrientation()
        // device orientation
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', onOrientationChange);
        }
    }

    function onOrientationChange(e) {
        let gamma = e.gamma;
        if (gamma === 0) {
            tilting = false;
        } else {
            tilting = true;
            tiltSpeed = e.gamma;
        }
    }

    function updateAsteroids() {
        asteroids.map((asteroid) => asteroid.y += asteroid.speed)
    }

    // Every 50 displays check if stuffs off the map
    function offTheMap() {
        if (gameCounter % 50 === 0) {
            for (let i = 0; i < asteroids.length; i++) {
                asteroids[i].y += asteroids[i].speed
                if (asteroids[i].y > (p.height * 1.3)) {
                    asteroids[i] = buildAsteroid(p);
                }
            }
            for (let i = 0; i < shots.length; i++) {
                if (shots[i][1] < 0 ) {
                    shots.splice(i, 1);
                }
            }
        }
    }

    function checkRocketCollisons(asteroid) {
        const rocketWidth = p.windowHeight * 0.085 * (50.0 / 175);
        return (((((Math.abs(asteroid.x - rocket.x) < asteroid.radius) && (Math.abs((asteroid.y - rocket.y)) < asteroid.radius)))
            || (((Math.abs(asteroid.x - (rocket.x + rocketWidth))) < asteroid.radius) && (Math.abs((asteroid.y - rocket.y)) < asteroid.radius))));
    }

    function distance(x1, y1, x2, y2) {
        return Math.sqrt(((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)))
    }


    function checkShotCollisons(asteroid) {
        for (let i = 0; i < shots.length; i++) {
            const sx = shots[i][0];
            const sy = shots[i][1];
            if (distance(sx, sy, asteroid.x, asteroid.y) <= asteroid.radius) {
                shots.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    function checkCollisons() {
        for (let i = 0; i < asteroids.length; i++) {
            if (checkRocketCollisons(asteroids[i])) {
                asteroids = buildAsteroids(p, 6);
                gameStarted = false;
                explosionPresent = true;
                explosionWidth = 0;
                explosionX = rocket.x;
                explosionY = rocket.y;
            }
            else if (checkShotCollisons(asteroids[i])) {
                if (asteroids[i].health === 1) {
                    asteroids[i] = buildAsteroid(p);
                } else {
                    asteroids[i].health -= 1;
                }
                score += 10;
                if (score % 100 === 0) {
                    asteroids.push(buildAsteroid(p))
                }
            }
        }
    }

    function requestDeviceOrientation() {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', () => { });
                    }
                })
                .catch(console.error);
        } else {
            // handle regular non iOS 13+ devices
            //console.log("not iOS");
        }
    }

    function addShot() {
        gameStarted = true;
        if (explosionPresent) {
            if (explosionWidth > p.height) {
                score = 0;
                explosionPresent = false;
            } else {
                gameStarted = false;
            }
        }
        let sx = Math.round(rocket.x + rocket.width / 2) - 3;
        let sy = Math.round(rocket.y - rocket.height * (1 / 2));
        shots.push([sx, sy]);
    }

    function setDirection(dir) {
        direction = dir;
        moving = true;
    }

    p.keyPressed = function () {
        if (p.keyCode === 32 || p.keyCode === 191) { addShot(); }
        if (p.keyCode === 37) { setDirection(3); }
        if (p.keyCode === 38) { setDirection(0); }
        if (p.keyCode === 39) { setDirection(1); }
        if (p.keyCode === 40) { setDirection(2); }
    }

    p.mousePressed = function () {
        addShot();
    }

    function updateRocket() {
        if (p.keyIsPressed) {
            if (moving) {
                if (direction === 0) {
                    rocket.y -= rocket.speed;
                } else if (direction === 1) {
                    rocket.x += rocket.speed;
                } else if (direction === 2) {
                    rocket.y += rocket.speed;
                } else if (direction === 3) {
                    rocket.x -= rocket.speed;
                } else {
                }
            }
        } else {
            moving = false;
        }
        if (gameStarted && tilting) {
            rocket.x += Math.round(tiltSpeed / 3);
        }
        if (gameStarted) {
            updateAsteroids();
            drawAsteroids(p, asteroids);
            p.textSize(p.width * 0.009 + 10);
            p.fill(255, 255, 255);
            p.text(score, 0.98 * p.width - 30, 0.05 * p.height);
        }
        if (rocket.x < -1 * rocket.width) {
            rocket.x = p.width;
        } else if (rocket.x >= p.width + rocket.width) {
            rocket.x = -1 * rocket.width;
        }

        if (rocket.y + rocket.width > p.height) {
            rocket.y = p.height - rocket.width;
        } else if (rocket.y < 0) {
            rocket.y = 0;
        }
        shots.map((shot) => shot[1] -= shotUpdate);
        flame = !flame;
    }

    function updateExplosion() {
        if (explosionPresent) {
            explosionWidth += 10;
            drawExplosion(p, explosionX, explosionY, explosionWidth);
            p.fill(255, 255, 255);
            p.text(score, 0.98 * p.width - 30, 0.05 * p.height);
        }
    }

    p.draw = () => {
        p.background(13, 61, 90);
        checkCollisons();
        updateRocket();
        updateExplosion();
        // updateBoids(boids, boidState);
        offTheMap();
        drawRocket(p, rocket, flame);
        drawShots(p, shots);
        // drawBoids(p, boids);
        gameCounter += 1;
    }
}