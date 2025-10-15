const canvas = document.getElementById("lienzo");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(canvas);

const ctx = canvas.getContext('2d');

ctx.beginPath();
ctx.strokeStyle = "#665522";
ctx.lineWidth = 6;
ctx.fillStyle = "#00ffff";

// Dimensiones rectangulo
ctx.rect((canvas.width/2)-150, (canvas.height/2)-50, 300, 100);
ctx.stroke();

// Línea vertical en el centro
ctx.beginPath();
ctx.moveTo(canvas.width / 2, 0);
ctx.lineTo(canvas.width / 2, canvas.height);
ctx.strokeStyle = "#ff0000";
ctx.lineWidth = 2;
ctx.stroke();

// Línea horizontal en el centro
ctx.beginPath();
ctx.moveTo(0, canvas.height / 2);
ctx.lineTo(canvas.width, canvas.height / 2);
ctx.strokeStyle = "#ff00ff";
ctx.lineWidth = 2;
ctx.stroke();