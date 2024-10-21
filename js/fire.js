window.addEventListener("resize", resizeCanvas, false);
window.addEventListener("DOMContentLoaded", onLoad, false);

window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

var canvas, ctx, w, h, particles = [], probability = 0.04,
    xPoint, yPoint;

function onLoad() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    resizeCanvas();

    window.requestAnimationFrame(updateWorld);
}

function resizeCanvas() {
    if (!!canvas) {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
}

function updateWorld() {
    update();
    paint();
    window.requestAnimationFrame(updateWorld);
}

function update() {
    if (particles.length < 500 && Math.random() < probability) {
        createFirework();
    }
    var alive = [];
    for (var i = 0; i < particles.length; i++) {
        if (particles[i].move()) {
            alive.push(particles[i]);
        }
    }
    particles = alive;
}




function paint() {
    ctx.globalCompositeOperation = 'source-over'; // Set to default operation.

    // Clear the canvas to remove the previous frame.
    ctx.clearRect(0, 0, w, h); // Clear the canvas.

    ctx.globalAlpha = 0.0; // Set global alpha to 0.0 (invisible).

    // Fill the entire canvas with black, but it will be invisible due to globalAlpha = 0.0.
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, w, h); // This effectively does nothing visually.

    ctx.globalCompositeOperation = 'lighter'; // Set to lighter for particle blending.

    // Draw the particles, they will blend together and with the background.
    for (var i = 0; i < particles.length; i++) {
        particles[i].draw(ctx); // Draw particles.
    }

    // Reset globalAlpha to 1.0 for any future drawings.
    ctx.globalAlpha = 5.0; // Reset to fully opaque.

    // Reset the composite operation to avoid affecting future drawings.
    ctx.globalCompositeOperation = 'source-over';
}
function createFirework() {
    xPoint = Math.random() * (w - 200) + 100;
    yPoint = Math.random() * (h - 200) + 100;
    var nFire = Math.random() * 50 + 100;
    var c = "rgb(" + (~~(Math.random() * 200 + 55)) + ","
        + (~~(Math.random() * 200 + 55)) + "," + (~~(Math.random() * 200 + 55)) + ")";
    for (var i = 0; i < nFire; i++) {
        var particle = new Particle();
        particle.color = c;
        var vy = Math.sqrt(25 - particle.vx * particle.vx);
        if (Math.abs(particle.vy) > vy) {
            particle.vy = particle.vy > 0 ? vy : -vy;
        }
        particles.push(particle);
    }
}

function Particle() {
    this.w = this.h = Math.random() * 5 + 1;

    this.x = xPoint - this.w / 2;
    this.y = yPoint - this.h / 2;

    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;

    this.alpha = Math.random() * .5 + .5;

    this.color;
}

Particle.prototype = {
    gravity: 0.02,
    move: function () {
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        this.alpha -= 0.01;
        if (this.x <= -this.w || this.x >= screen.width ||
            this.y >= screen.height ||
            this.alpha <= 0) {
            return false;
        }
        return true;
    },
    draw: function (c) {
        c.save();
        c.beginPath();

        c.translate(this.x + this.w / 5, this.y + this.h / 5);
        c.arc(0, 0, this.w, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.globalAlpha = this.alpha;

        c.closePath();
        c.fill();
        c.restore();
    }
} 