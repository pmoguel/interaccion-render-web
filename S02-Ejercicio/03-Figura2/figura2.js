const canvas = document.getElementById('lienzo');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.style.overflowX = 'hidden';

const ctx = canvas.getContext('2d');

const cols = 1;
const rows = 11;

// Make circles bigger
const radius = Math.min(canvas.width, canvas.height) / 6;

const gap = radius * 0.2;

const centerX = canvas.width / 2;

const startY = (canvas.height - (rows * radius *0.2 + (rows - 1) * gap)) / 2 + radius;

ctx.strokeStyle = 'red';
ctx.lineWidth = 3;

for (let row = 0; row < rows; row++) {
    const y = startY + row * (gap);
    ctx.beginPath();
    ctx.arc(centerX, y, radius, 0, Math.PI * 2);
    ctx.stroke();
}


//1. Escuchar que el mouse se mueva
window.addEventListener("mousemove", function (eventData) {
    console.log("Hola X:", eventData.x);
    console.log("Hola Y:", eventData.y);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.strokeStyle = '#red';
// ctx.ellipse(x,y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
ctx.beginPath();
ctx.strokeStyle = 'darkorange';
ctx.ellipse(eventData.x, eventData.y, radius, radius, 0, 0, Math.PI * 2);
ctx.stroke();
//ctx.strokeStyle = 'seagreen';
for (let row = 0; row < rows; row++) {
    const y = startY + row * (gap);
    ctx.beginPath();
    ctx.strokeStyle = 'seagreen';
    ctx.arc(centerX, y, radius, 0, Math.PI * 2);
    ctx.stroke();
}
});
// window.addEventListener("mousedown", function (eventData) {
//     console.log("Mouse down");
//     ctx.fillStyle = 'black';
//     ctx.strokeStyle = 'pink';
//     for (let row = 0; row < rows; row++) {
//     const y = startY + row * (gap);
//     ctx.beginPath();
//     ctx.arc(centerX, y, radius, 0, Math.PI * 2);
//     ctx.stroke();
//     }
//     ctx.beginPath();
// ctx.ellipse(eventData.x, eventData.y, radius, radius, 0, 0, Math.PI * 2);
// ctx.stroke();
// });

// window.addEventListener("mouseup", function (eventData) {
//     console.log("Mouse up");
//         //ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = 'black';

//     ctx.strokeStyle = 'red';

//     ctx.fillStyle = 'black';
//     for (let row = 0; row < rows; row++) {
//     const y = startY + row * (gap);
//     ctx.beginPath();
//     ctx.arc(centerX, y, radius, 0, Math.PI * 2);
//     ctx.stroke();
//     }
//     ctx.beginPath();
// ctx.ellipse(eventData.x, eventData.y, radius, radius, 0, 0, Math.PI * 2);
// ctx.stroke();
// });

//1. Crear la referencia a nuestro boton de HTML
const boton = document.getElementById("boton");
console.log(boton);
//2. Agregar un "event listener" a ese boton
boton.addEventListener("mousedown", function(){
//definimos estilos
ctx.fillStyle = 'salmon';
//iniciamos trazo
ctx.beginPath();
//definimos que figura
ctx.rect(50,100,300,50);
//renderizamos
ctx.fill();

});
  //2.1 En el event listener vamos a renderizar de nuevo con otro color