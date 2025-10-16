/* 05. Errores 3D. */
console.log('05. Errores 3D.');
//console.log(THREE);

// --- ESCENA, CÁMARA Y RENDERER ---

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var rotationSpeed = 0.05;

camera.position.z = 5;

// --- LUCES ---
const ambientLight = new THREE.AmbientLight(0x0000ff, 0.1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xff0000, 1);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);

// --- OBJETOS ---
const cubeGeo = new THREE.BoxGeometry();
const cubeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
scene.add(cube);

const sphereGeo = new THREE.SphereGeometry(1.5, 32, 32);
const sphereMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

// --- INTERACCIÓN CON MOUSE ---
let mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
});

// --- ANIMACIÓN ---
function animate() {
    requestAnimationFrame(animate);

    // Rotaciones
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    sphere.rotation.y += rotationSpeed;

    // Movimiento de la esfera según mouse
    sphere.position.x = mouse.x * 5;
    sphere.position.y = mouse.y * 5;

    renderer.render(scene, camera);
}

animate();

/*
1. Arreglar el orden de los scripts en el HTML.
2. Corregir la luz
3. Corregir la camara para no aplastar el cubo
*/