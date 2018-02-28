let bullets = [];
let map;
let tanks = [];

let armor = 0;
let kills = 0;
let lives = 3;
let pl;
let wave = 1;

let ts = 48;

let avgFPS = 0;
let numFPS = 0;

let showFPS = false;
let showHitboxes = false;


/*
 * Other functions
 */

// Calculate FPS and FPS average and update sidebar with it
function calcFPS() {
    let fps = frameRate();
    avgFPS += (fps - avgFPS) / ++numFPS;

    document.getElementById('fps').innerHTML = 'FPS: ' + fps.toFixed(1);
    document.getElementById('avgfps').innerHTML = 'Avg. FPS: ' + avgFPS.toFixed(1); 
}

// Update game status on sidebar
function updateStatus() {
    document.getElementById('wave').innerHTML = 'Wave ' + wave;
    document.getElementById('lives').innerHTML = 'Lives: ' + lives + '/3';
    document.getElementById('armor').innerHTML = 'Armor: ' + armor;
    document.getElementById('kills').innerHTML = 'Kills: ' + kills;
}


/*
 * Main p5.js functions
 */

function setup() {
    let div = document.getElementById('game');
    let canvas = createCanvas(div.offsetWidth, div.offsetHeight);
    canvas.parent(div);
    resizeCanvas(div.offsetWidth, div.offsetHeight, true);

    let tiles = [];
    for (let x = 0; x < 48; x++) {
        tiles[x] = [];
        for (let y = 0; y < 32; y++) {
            if (x === 0 || y === 0 || x === 47 || y === 31) {
                tiles[x][y] = ['wall'];
            } else {
                tiles[x][y] = ['concrete'];
            }
        }
    }
    map = new Map(tiles);

    for (let i = 0; i < 10; i++) {
        let p = map.randomPos();
        tanks.push(new Tank(p.x, p.y));
    }

    let c = map.center();
    pl = new Tank(c.x, c.y, TANK.player1);
}

function draw() {
    background(0);

    // Update game status
    if (showFPS) calcFPS();
    updateStatus();

    // Draw map
    translate(width/2 - pl.pos.x, height/2 - pl.pos.y);
    map.display();

    // Player movement
    controls();

    let entities = bullets.concat([pl]).concat(tanks);
    for (let i = entities.length - 1; i >= 0; i--) {
        let e = entities[i];
        e.act();
        if (e.dead) entities.splice(i, 1);
    }
}


/*
 * User input functions
 */

function controls() {
    // W or up arrow
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
        pl.speed = lerp(pl.speed, pl.maxSpeed, 0.05);
    }

    // A or left arrow
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
        pl.angle -= pl.angSpeed;
    }

    // S or down arrow
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
        pl.speed = lerp(pl.speed, -pl.maxSpeed, 0.05);
    }

    // D or right arrow
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
        pl.angle += pl.angSpeed;
    }

    // Aim barrel according to adjusted mouse position
    let m = createVector(mouseX + pl.pos.x - width/2, mouseY + pl.pos.y - height/2);
    pl.gunAngle = m.sub(pl.pos).heading() - pl.angle;
}

function keyPressed() {
    if (key === 'F') {
        showFPS = !showFPS;
        if (!showFPS) {
            document.getElementById('fps').innerHTML = '';
            document.getElementById('avgfps').innerHTML = '';
        }
    }
    if (key === 'H') showHitboxes = !showHitboxes;
}

function keyReleased() {
    // W or S or up or down arrow
    if (keyCode === 87 || keyCode === 83 || keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
        pl.speed = 0;
    }
}
