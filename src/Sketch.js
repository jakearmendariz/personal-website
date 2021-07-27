/**
 * Terrible code because I copied it from stuff I wrote in 2018 (first year of code)
 */
const drawRocket = (p, x, y, flame) => {
  const r = 160;
  const g = 1;
  const b = 70;
  const rocket_height = p.windowHeight * 0.085;
  const rocket_width = rocket_height*(50 / 175);
   //shaded p.rectangle
  p.fill(220, 220, 220);
  p.rect(x, y, rocket_width, rocket_height);
  p.fill(200, 200, 200);
  p.rect(x, y, rocket_width / 6, rocket_height);
  p.fill(180, 180, 180);
  p.rect(x + rocket_width / 3, y, (rocket_width * 2) / 3, rocket_height);
  p.fill(130, 130, 130);
  p.rect(x + (rocket_width * 2) / 3, y, (rocket_width * 1) / 3, rocket_height);
  //wings and tip
  p.fill(r, g, b);
  p.triangle(x,y,x + rocket_width / 2,y - rocket_height * (7 / 16),x + rocket_width,y);
  p.ellipse(x + rocket_width / 2, y + rocket_height * 0.01, rocket_width, rocket_height * 0.2);
  p.fill(r + 20, g + 20, b + 20);
  p.triangle(x,y + rocket_height,x - rocket_width / 2,y + rocket_height,x,y + rocket_height / 4);
  p.fill(r, g, b);
  p.triangle(x + (3 / 2) * rocket_width,y + rocket_height,x + rocket_width,y + rocket_height,x + rocket_width,y + rocket_height / 4);
  p.triangle(x + rocket_width / 3,y + rocket_height,x + rocket_width * (2 / 3),y + rocket_height,x + rocket_width / 2,y + rocket_height / 4);

  // flame
  if(flame) {
    p.fill(255, 100, 10);
    p.triangle(x,y + rocket_height,x + rocket_width,y + rocket_height,x + rocket_width / 2,y + rocket_height * (9 / 6));
    p.fill(210, 230, 0);
    p.triangle(x + rocket_width / 4,y + rocket_height,x + rocket_width - rocket_width / 4,y + rocket_height,x + rocket_width / 2,y + rocket_height * (8 / 6));
  } else {
    p.fill(255, 100, 10);
    p.triangle(x,y + rocket_height,x + rocket_width,y + rocket_height,x + rocket_width / 2,y + rocket_height * (11 / 6));
    p.fill(210, 230, 0);
    p.triangle(x + rocket_width / 4,y + rocket_height,x + rocket_width - rocket_width / 4,y + rocket_height,x + rocket_width / 2,y + rocket_height * (10 / 6));
  }
}

const drawShots = (p, shots) => {
    // console.log(shots);
    p.fill(255, 238, 0);
    for (let i = 0; i < shots.length; i++) {
      p.rect(shots[i][0], shots[i][1], 6, 20);
    }
}

export default function sketch(p){
    let canvas;
    let direction, moving, tilting;
    let x, y;
    let ROCKET_SPEED;
    let ROCKET_HEIGHT;
    let ROCKET_WIDTH;
    let shots;
    let flame;
    let tiltSpeed;

    p.setup = () => {
      canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      p.noStroke();
      direction = 0;
      moving = false;
      tilting = false;
      tiltSpeed = 0;
      x = p.windowWidth/2;
      y = p.windowHeight*(3/4);
      ROCKET_SPEED = 0.010 * p.windowWidth;
      ROCKET_HEIGHT = p.windowHeight * 0.085;
      ROCKET_WIDTH = ROCKET_HEIGHT*(50 / 175);
      shots = [];
      flame = false;

      // device orientation
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', onOrientationChange);  
      }
    }

    function onOrientationChange(e) {
        let alpha = e.alpha;
        let beta = e.beta;
        let gamma = e.gamma;
        if(gamma == 0) {
            tilting = false;
        } else {
            
            tilting = true;
            tiltSpeed = e.gamma;
        }
        console.log(alpha + " " + beta + " " + gamma);
    }
      

    function addShot() {
        console.log("added shot")
        let sx = Math.round(x + ROCKET_WIDTH / 2) - 3;
        let sy = Math.round(y - ROCKET_HEIGHT * (1 / 2));
        shots.push([sx,sy]);
    }

    function setDirection(dir){
        direction = dir;
        moving = true;
    }

    p.keyPressed = function() {
        if (p.keyCode === 32 || p.keyCode == 191) {addShot();}
        if (p.keyCode === 37) {setDirection(3);}
        if (p.keyCode === 38) {setDirection(0);}
        if (p.keyCode === 39) {setDirection(1);}
        if (p.keyCode === 40) {setDirection(2);}
    }

    p.mousePressed = function() {
        addShot();
    }

    function updateRocket() {
        if(p.keyIsPressed) {
            if(moving) {
                if (direction === 0) {
                    y -= ROCKET_SPEED;
                } else if (direction === 1) {
                    x += ROCKET_SPEED;
                } else if (direction === 2) {
                    y += ROCKET_SPEED;
                } else if (direction === 3) {
                    x -= ROCKET_SPEED;
                } else {
                }
            }
        } else {
            moving = false;
        }
        if(tilting) {
            x += tiltSpeed/2;
        }
        if (x < -1 * ROCKET_WIDTH) {
            x = p.width;
        } else if (x >= p.width + ROCKET_WIDTH) {
            x = -1 * ROCKET_WIDTH;
        }
    
        if (y + ROCKET_HEIGHT > p.height) {
            y = p.height - ROCKET_HEIGHT;
        } else if (y < 0) {
            y = 0;
        }
        for (let i = 0; i < shots.length; i++) {
            shots[i][1] -= 0.015*p.height;
            if (shots[i][1] < 0 ) {
                shots.splice(i, 1);
            }
        }
        flame = !flame;
    }

    p.draw = () => {
        p.background(13,61,90);
        // p.background(10, 10, 20);
        updateRocket()
        drawRocket(p, x, y, flame);
        drawShots(p, shots);
    }
}