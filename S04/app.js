console.log("Sesion 04. Ejericio 1: Configuracion Escena 3D");
console.log(THREE);

// Definir nuestro canvas
const canvas = document.getElementById("lienzo");
//const ctx = canvas.getContext("webgl");


// Definir variables del tamaño de la ventana
var width = window.innerWidth;
var height = window.innerHeight;

// Actualizamos la resolucion del canvas
canvas.width = width;
canvas.height = height;

// Codigo para configurar la escena
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const mesh = new THREE.Mesh(
   new THREE.SphereGeometry(),
   new THREE.MeshBasicMaterial({ color: "#ff6600", wireframe: true })
);

// Agregar nuestro objeto a la escena
scene.add(mesh);

//Mover nuestro mesh en la escena
mesh.position.z = -5;

//Renderizar lo que ve la camara
renderer.render(scene, camera);