console.log('main.js');

// 01. Renderizar 1 imagen.
/*
1. Crear etiqueta <img> virtual.
2. Cargar imagen desde una fuente (src).
3. Definir su estilo / apariencia (CSS).
    ancho / alto.
    posición (x / y).


4. Agregarla al <Documento>.
5. Agrupar estas instrucciones en una función.
*/

const img = document.createElement("img");
img.src = "./assets/p1.jpg";
img.style.width = "227px";
img.style.height = "150px";
img.style.top = "50px";
img.style.left = "50px";
img.style.position = "absolute";
document.body.appendChild(img);

// 02. Renderizar “n” imágenes.
// 03. Posicionarlas según el mouse.
// 04. Mostrarlas en ciclo.
// 05. Desaparecerlas después de “x” tiempo.
// 06. Hacer su animación de salida.
// 07. Hacer su animación de entrada.
// 08. Renderizarlas cada “x” distancia.
// 09. Renderizarlas adelante y atrás de cada letra.
