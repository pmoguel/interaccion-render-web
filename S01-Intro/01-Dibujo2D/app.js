//1. Obtener referencia del canvas.
const canvas = document.getElementById("lienzo");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(canvas);

//2. definir si es 2d o 3d.
const ctx = canvas.getContext("2d");

//3. Definir los estilos de la linea.
ctx.strokeStyle = "#ff0000";
ctx.lineWidth = 2;

//4. definir los puntos que hacen la linea.
//ctx.moveTo(50, 50);
ctx.moveTo(190,144);
ctx.lineTo(390,144);

ctx.moveTo(500,144);
ctx.lineTo(700,144);

//5. Renderizar la linea.
ctx.stroke();

//6. Definir estilos de rectangulo.
ctx.strokeStyle = "#00ff00";
ctx.lineWidth = 6;

//7. Definir el rectangulo.
//ctx.rect(x, y, width, height);
ctx.rect(450, 10, 300, 600);

//8. Renderizar el rectangulo.
// ctx.fill();
ctx.stroke();


//Sintaxis para el circulo
ctx.beginPath(); // Iniciar un nuevo camino

//9. Estilos del circulo.
ctx.strokeStyle = "#0000ff";
ctx.fillStyle = "#00ffff";

//10. Definir el circulo.
//ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
ctx.ellipse(50, 150, 30, 130, 0, 0, Math.PI *1.5);

//11. Renderizar el circulo.
ctx.fill();
ctx.stroke();