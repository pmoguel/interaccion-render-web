console.log("Sesion 03. Ejercicio 01.")

//1. Referencia a <canvas>
const canvas = document.getElementById("lienzo");
console.log(canvas);

//2. Definimos contexto
const ctx = canvas.getContext("2d");
console.log(ctx);

//3. Definir resolucion
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//4. Instrucciones para dibujar un circulo
ctx.beginPath();
ctx.strokeStyle = "green";
ctx.lineWidth = 10;
ctx.ellipse(100, 100, 60, 60, 0, 0, Math.PI * 2);
ctx.stroke();   

//5. Agrupar en una funcion
// con parametros para dibujar circulos en diferentes posiciones
// sin repetir todo el codigo
function dibujarCirculo(x, y){
    ctx.beginPath();
ctx.strokeStyle = "green";
ctx.lineWidth = 10;
ctx.ellipse(x, y, 60, 60, 0, 0, Math.PI * 2);
ctx.stroke();   
}

dibujarCirculo(200, 200);
dibujarCirculo(300, 300);
dibujarCirculo(400, 400);

//6. Escuchar el evento de mousemove para dibujar circulos
window.addEventListener("mousemove", function(eventData){
    dibujarCirculo(eventData.x, eventData.y);
});