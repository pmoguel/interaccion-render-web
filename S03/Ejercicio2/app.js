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
ctx.strokeStyle = "pink";
ctx.lineWidth = 10;
ctx.ellipse(100, 100, 60, 60, 0, 0, Math.PI * 2);
ctx.stroke();   

//5. Agrupar en una funcion
// con parametros para dibujar circulos en diferentes posiciones
// sin repetir todo el codigo
function dibujarCirculo(x, y){
    ctx.beginPath();
ctx.strokeStyle = "pink";
ctx.lineWidth = 10;
ctx.ellipse(x, y, 60, 60, 0, 0, Math.PI * 2);
ctx.stroke();   
}

dibujarCirculo(200, 200);
dibujarCirculo(300, 300);
dibujarCirculo(400, 400);


const circulo = {
    colorLinea: "seagreen",
    grosorLinea: 20,
    radio: 100,
    rotacion: 0,
    anguloInicial: 0,
    anguloFinal: Math.PI * 2,
    x: 50,
    y: 400,
    dibujar: function(x,y) {
        ctx.beginPath();
        ctx.strokeStyle = "ciruclo.colorLinea;";
        ctx.lineWidth = circulo.grosorLinea;
        ctx.ellipse(x, y, circulo.radio, circulo.radio, circulo.anguloInicial, circulo.anguloInicial, circulo.anguloFinal);
        ctx.stroke();   
    }
}

circulo.dibujar(500, 500);

window.addEventListener("mousedown", function(eventData){
    circulo.dibujar(eventData.clientX, eventData.clientY);
})