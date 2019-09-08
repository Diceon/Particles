var canvas = document.querySelector('#grid');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

var fps = 60;
var paused = false;
var startTime, now, then, elapsed;
var fpsInterval = 1000 / fps;

var particleCount = 100;
var particleMinSize = 2;
var particleMaxSize = 5;
var particleMinVelocity = -3;
var particleMaxVelocity = 3;
var particleConnection = 150;

var particles;
var mouse = {
    x: -particleConnection,
    y: -particleConnection,
}

function getRandomInt(min, max, includeZero = true) {
    let result;
    do result = Math.floor(Math.random() * (max - min) + min)
    while (includeZero === false && result === 0);
    return result;
}

function getDistance(particle1, particle2) {
    return Math.sqrt(((particle2.x - particle1.x) * (particle2.x - particle1.x)) + ((particle2.y - particle1.y) * (particle2.y - particle1.y)));
}

function drawLine(particleOne, particleTwo, distance) {
    ctx.globalAlpha = 1 - (distance / particleConnection);
    ctx.beginPath();
    ctx.moveTo(particleOne.x, particleOne.y);
    ctx.lineTo(particleTwo.x, particleTwo.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function updateParticles() {
    particles.forEach(p => {

        // X Update
        if (p.x + p.sx < 0 || p.x + p.sx > canvas.width) {
            p.sx = -p.sx;
        }

        p.x += p.sx;

        // Y Update
        if (p.y + p.sy < 0 || p.y + p.sy > canvas.height) {
            p.sy = -p.sy;
        }

        p.y += p.sy;

    });
}

function drawParticles() {
    for (let p in particles) {
        ctx.beginPath();
        ctx.arc(particles[p].x, particles[p].y, particles[p].size, 0, Math.PI * 2);
        ctx.fill();
    };
}

function drawLines() {
    for (let p in particles) {

        let nearby = particles.filter(n => {
            if (particles[p] == n) return;

            let distance = getDistance(particles[p], n)
            if (distance < particleConnection) {
                drawLine(particles[p], n, distance)
                return n;
            }
        });

        let distance = getDistance(particles[p], mouse);
        if (distance < particleConnection) {
            drawLine(particles[p], mouse, distance)
        }

    };
}

document.onmousemove = (mouse) => {
    if (mouse.clientX > 0 && mouse.clientX < canvas.width
        && mouse.clientY > 0 && mouse.clientY < canvas.height) {
        this.mouse.x = mouse.clientX;
        this.mouse.y = mouse.clientY;
    } else {
        this.mouse.x = -particleConnection;
        this.mouse.y = -particleConnection;
    }
};

document.onmousedown = (mouse) => {
    if (mouse.button == 0) {
        paused = !paused;
    }
}

function init() {
    particles = [];

    // Populating particle array
    for (let i = 0; i < particleCount; i++) {
        let particleSize = getRandomInt(particleMinSize, particleMaxSize, false);
        let particleVelocity = getRandomInt(particleMinVelocity, particleMaxVelocity, false);

        particles.push({
            x: getRandomInt(particleSize, canvas.width - particleSize),
            y: getRandomInt(particleSize, canvas.height - particleSize),
            sx: particleVelocity,
            sy: particleVelocity,
            size: particleSize
        });
    }

    then = Date.now();
    window.requestAnimationFrame(update);
}

function update(timestamp) {
    if (!paused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        now = Date.now();
        elapsed = now - then;

        if (elapsed > fpsInterval) {
            then = now;

            updateParticles();
        }

        drawParticles();
        drawLines();
    }

    window.requestAnimationFrame(update);
}

init();
