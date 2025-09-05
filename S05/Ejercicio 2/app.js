console.log("Sesion 05: Ejercicio 02: Geometrías");
console.log(THREE);

//configurar <canvas>.
const canvas = document.getElementById("lienzo");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//creamos nuestros elementos básicos:
//Escena, Cámara, Mesh, Renderer.
//Escena
const scene = new THREE.Scene();

//Cámara
//const camera = new THREE.Camera(fov, aspectRatio, near, far)
const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);

//Mesh
////Geometría
const geometry = new THREE.TorusKnotGeometry();
////Material
const material = new THREE.MeshToonMaterial({
   flatShading: true,
   specular: "white",
   shininess: 100,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
mesh.position.z = -5;
mesh.rotation.x = 60;

//Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(canvas.width, canvas.height);

// Dar instruccion de renderizar o imprimir nuestro elemento
renderer.render(scene, camera);

// Tip para animar nuestro mesh:
function animate() {
   requestAnimationFrame(animate);

   mesh.rotation.x += 0.01;
   mesh.rotation.y += 0.01;

   renderer.render(scene, camera);
}
animate();

// Tip para agregar luces a nuestra escena:
const topLight = new THREE.PointLight("seagreen", 100, 100);
topLight.position.y = 5;
scene.add(topLight);

const frontLight = new THREE.PointLight("teal", 10, 100);
frontLight.position.set(3,1,3);
scene.add(frontLight);
