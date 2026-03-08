import React, { useState, useRef } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import { Boid, BoidState, updateBoids } from './Boids.js';

function makeSketch(paramsRef) {
    return function sketch(p) {
        let boids, boidState;
        let rocket, direction, moving, tilting, tiltSpeed;
        let shots, shotUpdate, flame;
        let orientationPermissionRequested = false;

        class Rocket {
            constructor(x, y, w, h) {
                this.x = x;
                this.y = y;
                this.speed = 0.010 * w;
                this.height = h * 0.1;
                this.width = this.height * (45 / 175);
            }
        }

        // ── Draw helpers ────────────────────────────────────────────────────
        const drawRocketBase = (r) => {
            p.fill(220, 220, 220); p.rect(r.x, r.y, r.width, r.height);
            p.fill(200, 200, 200); p.rect(r.x, r.y, r.width / 6, r.height);
            p.fill(180, 180, 180); p.rect(r.x + r.width / 3, r.y, (r.width * 2) / 3, r.height);
            p.fill(130, 130, 130); p.rect(r.x + (r.width * 2) / 3, r.y, r.width / 3, r.height);
        };

        const drawWingsAndTip = (r) => {
            const [rv, g, b] = [160, 1, 70];
            p.fill(rv, g, b);
            p.triangle(r.x, r.y, r.x + r.width / 2, r.y - r.height * (6 / 16), r.x + r.width, r.y);
            p.ellipse(r.x + r.width / 2, r.y + r.height * 0.01, r.width, r.height * 0.2);
            p.fill(rv + 20, g + 20, b + 20);
            p.triangle(r.x, r.y + r.height, r.x - r.width / 2, r.y + r.height, r.x, r.y + r.height / 4);
            p.fill(rv, g, b);
            p.triangle(r.x + (3 / 2) * r.width, r.y + r.height, r.x + r.width, r.y + r.height, r.x + r.width, r.y + r.height / 4);
            p.triangle(r.x + r.width / 3, r.y + r.height, r.x + r.width * (2 / 3), r.y + r.height, r.x + r.width / 2, r.y + r.height / 4);
        };

        const drawFlames = (r, fl) => {
            if (fl) {
                p.fill(255, 100, 10);
                p.triangle(r.x, r.y + r.height, r.x + r.width, r.y + r.height, r.x + r.width / 2, r.y + r.height * (9 / 6));
                p.fill(210, 230, 0);
                p.triangle(r.x + r.width / 4, r.y + r.height, r.x + r.width - r.width / 4, r.y + r.height, r.x + r.width / 2, r.y + r.height * (8 / 6));
            } else {
                p.fill(255, 100, 10);
                p.triangle(r.x, r.y + r.height, r.x + r.width, r.y + r.height, r.x + r.width / 2, r.y + r.height * (11 / 6));
                p.fill(210, 230, 0);
                p.triangle(r.x + r.width / 4, r.y + r.height, r.x + r.width - r.width / 4, r.y + r.height, r.x + r.width / 2, r.y + r.height * (10 / 6));
            }
        };

        const drawBoid = (boid) => {
            const size = p.width * 0.015;
            const angle = Math.atan2(boid.dy, boid.dx);
            const cos = (a) => Math.cos(angle + a);
            const sin = (a) => Math.sin(angle + a);
            p.fill(255, 60, 60);
            p.beginShape();
            p.vertex(boid.x + cos(0) * size,              boid.y + sin(0) * size);               // front tip
            p.vertex(boid.x + cos(Math.PI * 0.75) * size, boid.y + sin(Math.PI * 0.75) * size);  // left wing
            p.vertex(boid.x + cos(Math.PI) * size * 0.35, boid.y + sin(Math.PI) * size * 0.35);  // back notch
            p.vertex(boid.x + cos(-Math.PI * 0.75) * size,boid.y + sin(-Math.PI * 0.75) * size); // right wing
            p.endShape(p.CLOSE);
        };

        // ── Boids ────────────────────────────────────────────────────────────
        function spawnOffScreen() {
            const r = Math.random();
            let x, y, dx, dy;
            const halfHeight = p.windowHeight * 0.5;
            if (r < 0.6) {
                x = Math.random() * p.windowWidth; y = -20;
                dx = (Math.random() - 0.5) * 2;
                dy = Math.random() * 2 + 1;
            } else if (r < 0.8) {
                x = p.windowWidth + 20; y = Math.random() * halfHeight;
                dx = -(Math.random() * 2 + 1);
                dy = (Math.random() - 0.5) * 2;
            } else {
                x = -20; y = Math.random() * halfHeight;
                dx = Math.random() * 2 + 1;
                dy = (Math.random() - 0.5) * 2;
            }
            return new Boid(x, y, dx, dy);
        }

        function spawnBoids() {
            const { numBoids, separation, cohesion, alignment, visualRange } = paramsRef.current;
            boidState = new BoidState(separation, cohesion, alignment, visualRange, p.windowWidth, p.windowHeight);
            boids = Array.from({ length: numBoids }, spawnOffScreen);
        }

        // ── Device orientation ────────────────────────────────────────────────
        function onOrientationChange(e) {
            tilting = e.gamma !== 0;
            tiltSpeed = e.gamma;
        }

        function requestOrientationPermission() {
            if (orientationPermissionRequested) return;
            orientationPermissionRequested = true;
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(state => { if (state === 'granted') window.addEventListener('deviceorientation', onOrientationChange); })
                    .catch(console.error);
            }
        }

        // ── Setup ────────────────────────────────────────────────────────────
        p.setup = () => {
            p.createCanvas(p.windowWidth, p.windowHeight);
            p.noStroke();
            direction = 0; moving = false; tilting = false; tiltSpeed = 0;
            rocket = new Rocket(p.windowWidth / 2, p.windowHeight * 0.75, p.windowWidth, p.windowHeight);
            shots = [];
            shotUpdate = 0.015 * p.height;
            flame = false;
            spawnBoids();

            if (typeof DeviceOrientationEvent === 'undefined' || typeof DeviceOrientationEvent.requestPermission !== 'function') {
                window.addEventListener('deviceorientation', onOrientationChange);
            }
        };

        // ── Input ────────────────────────────────────────────────────────────
        p.keyPressed = () => {
            if (p.keyCode === 32 || p.keyCode === 191) {
                requestOrientationPermission();
                const sx = Math.round(rocket.x + rocket.width / 2) - 3;
                const sy = Math.round(rocket.y - rocket.height / 2);
                shots.push([sx, sy]);
            }
            if (p.keyCode === 37) { direction = 3; moving = true; }
            if (p.keyCode === 38) { direction = 0; moving = true; }
            if (p.keyCode === 39) { direction = 1; moving = true; }
            if (p.keyCode === 40) { direction = 2; moving = true; }
        };

        p.mousePressed = () => {
            requestOrientationPermission();
            const sx = Math.round(rocket.x + rocket.width / 2) - 3;
            const sy = Math.round(rocket.y - rocket.height / 2);
            shots.push([sx, sy]);
        };

        p.touchStarted = () => {
            requestOrientationPermission();
            const sx = Math.round(rocket.x + rocket.width / 2) - 3;
            const sy = Math.round(rocket.y - rocket.height / 2);
            shots.push([sx, sy]);
            return false;
        };

        // ── Draw loop ─────────────────────────────────────────────────────────
        p.draw = () => {
            const params = paramsRef.current;

            // Sync boid state params each frame
            boidState.separation = params.separation;
            boidState.cohesion = params.cohesion;
            boidState.alignment = params.alignment;
            boidState.visualRange = params.visualRange;
            boidState.speedLimit = params.speedLimit;
            if (boids.length !== params.numBoids) {
                boids = Array.from({ length: params.numBoids }, spawnOffScreen);
            }

            p.background(13, 61, 90);

            // Update rocket
            if (p.keyIsPressed && moving) {
                if (direction === 0) rocket.y -= rocket.speed;
                else if (direction === 1) rocket.x += rocket.speed;
                else if (direction === 2) rocket.y += rocket.speed;
                else if (direction === 3) rocket.x -= rocket.speed;
            } else {
                moving = false;
            }
            if (tilting) rocket.x += Math.round(tiltSpeed / 3);
            if (rocket.x < -rocket.width) rocket.x = p.width;
            else if (rocket.x >= p.width + rocket.width) rocket.x = -rocket.width;
            if (rocket.y + rocket.width > p.height) rocket.y = p.height - rocket.width;
            else if (rocket.y < 0) rocket.y = 0;

            // Update shots
            for (let i = shots.length - 1; i >= 0; i--) {
                shots[i][1] -= shotUpdate;
                if (shots[i][1] < 0) shots.splice(i, 1);
            }

            // Check shot-boid collisions — replace hit boid with a new one
            const boidHitRadius = p.width * 0.015;
            for (let i = boids.length - 1; i >= 0; i--) {
                for (let j = shots.length - 1; j >= 0; j--) {
                    const dx = shots[j][0] - boids[i].x;
                    const dy = shots[j][1] - boids[i].y;
                    if (Math.sqrt(dx * dx + dy * dy) < boidHitRadius) {
                        shots.splice(j, 1);
                        boids[i] = spawnOffScreen();
                        break;
                    }
                }
            }

            updateBoids(boids, boidState);

            // Draw
            flame = !flame;
            boids.forEach(drawBoid);
            drawRocketBase(rocket);
            drawWingsAndTip(rocket);
            drawFlames(rocket, flame);
            p.fill(255, 238, 0);
            shots.forEach(s => p.rect(s[0], s[1], 6, 20));
        };
    };
}

const SLIDER_CONFIG = [
    { key: 'numBoids',   label: 'Boids',       min: 2,     max: 60,   step: 1,      decimals: 0 },
    { key: 'separation', label: 'Separation',  min: 0.001, max: 0.15, step: 0.001,  decimals: 3 },
    { key: 'cohesion',   label: 'Cohesion',    min: 0.001, max: 0.02, step: 0.0005, decimals: 4 },
    { key: 'alignment',  label: 'Alignment',   min: 0.001, max: 0.15, step: 0.001,  decimals: 3 },
    { key: 'visualRange',label: 'Visual Range',min: 30,    max: 400,  step: 5,      decimals: 0 },
    { key: 'speedLimit', label: 'Speed',       min: 0.5,   max: 10,   step: 0.5,    decimals: 1 },
];

const DEFAULTS = {
    numBoids: 20,
    separation: 0.05,
    cohesion: 0.005,
    alignment: 0.05,
    visualRange: 150,
    speedLimit: 3,
};

const BoidsPage = () => {
    const [params, setParams] = useState(DEFAULTS);
    const paramsRef = useRef(params);
    paramsRef.current = params;

    const [sketch] = useState(() => makeSketch(paramsRef));

    const update = (key, value) => setParams(prev => ({ ...prev, [key]: Number(value) }));

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <P5Wrapper sketch={sketch} />
            <div style={{
                position: 'absolute', bottom: 24, right: 24,
                background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
                padding: '16px 20px', borderRadius: '10px',
                color: 'rgb(232,232,232)', minWidth: '220px',
                fontFamily: 'monospace', fontSize: '13px',
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '15px' }}>Boids</div>
                {SLIDER_CONFIG.map(({ key, label, min, max, step, decimals }) => (
                    <div key={key} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                            <span>{label}</span>
                            <span>{Number(params[key]).toFixed(decimals)}</span>
                        </div>
                        <input
                            type="range" min={min} max={max} step={step}
                            value={params[key]}
                            onChange={e => update(key, e.target.value)}
                            style={{ width: '100%', cursor: 'pointer' }}
                        />
                    </div>
                ))}
                <button
                    onClick={() => setParams({ ...DEFAULTS })}
                    style={{
                        marginTop: '6px', width: '100%', padding: '5px',
                        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)',
                        color: 'white', borderRadius: '5px', cursor: 'pointer', fontFamily: 'monospace',
                    }}
                >
                    reset defaults
                </button>
            </div>
        </div>
    );
};

export default BoidsPage;
