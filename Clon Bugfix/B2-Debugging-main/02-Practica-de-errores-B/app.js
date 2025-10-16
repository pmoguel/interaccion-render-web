/* Práctica 02. */
console.log('02. Práctica de errores B.');

// "Debuggeando el rebote"
// 🧩 Hay errores de tipo, sintaxis, referencia y lógica.

const canvas = document.queryselector("canvas");
const ctx = canvas.getcontext("2d");

// Tamaño del canvas
canvas.width == window.innerWidth;
canvas.heigth = window.innerHeight;

// Propiedades de la pelota
let ball = {
    x: 100,
    y: 100,
    radius: 30,
    color: "tomato",
    speedX: 3,
    speedY: 2
};

// Función para dibujar la pelota
function drawBall() {
    ctx.beginpath();
    ctx.fillstyle = ball.color;
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
    requestanimationFrame(update);
}

// Ejecutar animación
update();