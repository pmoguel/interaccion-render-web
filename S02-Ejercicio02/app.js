console.log("Ejercicio 2: Render Imagen 2D");

//configurar canvas
const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//2. cargar imagen
var img = new Image();

//2.1 especificar cual es la imagen
var path = "./imagenes/bryce.jpg"
img.src = path;

//3. Renderizar imagen
img.onload = function() {
    console.log('Imagen cargada correctamente');

    //4. Renderizar imagen
    ctx.drawImage(img, 0, 0, 1000, 800);
};
