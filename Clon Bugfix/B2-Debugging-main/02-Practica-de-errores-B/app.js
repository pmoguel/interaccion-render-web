/* Práctica 02. */
console.log('02. Práctica de errores B.');

// "Debuggeando el rebote"
// 🧩 Hay errores de tipo, sintaxis, referencia y lógica.


// Tamaño del canvas
const canvas = document.getElementById("lienzo");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

// Propiedades de la pelota
let ball = {
    x: 1000,
    y: 100,
    radius: 30,
    color: "#f00",
    speedX: 3,
    speedY: 2
};

// Función para dibujar la pelota
function drawBall() {
    ctx.beginPath();
    ctx.fillStyle = ball.color;
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

// Función para actualizar la posición
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Movimiento de la pelota
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Rebote en los bordes
    if (ball.x > canvas.width || ball.x < 0) {
    ball.speedX *= -1;
    } else if (ball.y > canvas.height) {
    ball.speedY = ball.speedY * -1;
    }

    drawBall();
    requestAnimationFrame(update);
}

// Ejecutar animación
update();