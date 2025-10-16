/* 03. Más ejemplos de errores. */
console.log('03. Más ejemplos de errores.');

// --- CONFIGURACIÓN ---
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 300;

// Creamos la pelota
let ball = createBall();

// --- VARIABLES GLOBALES ---
let gravity = 0.2;
let speed = { x: 2, y: 0 };

function createBall() {
    const b = {
        x: 250,
        y: 50,
        radius: 20,
        color: 'tomato',
    };
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
}

function updateBall() {
    ball.y += speed.y;
    ball.x += speed.x;
    speed.y += gravity;

    // Rebote en el piso
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        speed.y *= -0.8;
    }

    // Rebote en los lados
    if (ball.x > canvas.width - ball.radius || ball.x < ball.radius) {
        speed.x *= -1;
    }
}

function animate() {
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    updateBall();
    drawBall();
    requestAnimationFrame(animate);
}

animate();