import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// GSAP is imported but not yet used.
import gsap from 'gsap';

// 1. Basic Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('solar-system'),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Initial camera position
camera.position.z = 30;

// --- CAMERA CONTROLS ---
// Initialize OrbitControls, linking the camera and the canvas
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // This adds a smooth "friction" or "inertia" effect
controls.dampingFactor = 0.05;

// --- TEXTURE LOADER ---
const textureLoader = new THREE.TextureLoader();
// Load the specific matcap texture you chose
const matcapTexture = textureLoader.load('https://raw.githubusercontent.com/nidorx/matcaps/master/1024/FBB43F_FBE993_FB552E_FCDD65.png');

// 2. Sun Creation
// Geometry: a sphere
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
// Material: Using MeshMatcapMaterial with your texture
const sunMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
// Mesh: the combination of geometry and material
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);

// 3. Add Sun to Scene
scene.add(sunMesh);

// 4. Light Creation
// A point light so the sun emits light
// UPDATED: Intensity dramatically increased from 5 to 20 for a very bright effect
const pointLight = new THREE.PointLight(0xffffff, 250, 300);
pointLight.position.set(0, 0, 0); // Light is in the same position as the sun
scene.add(pointLight);

// An ambient light to illuminate the scene uniformly
// UPDATED: Intensity slightly increased to 0.3
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

// --- 5. Planet Creation ---

// Array to hold the planet mesh objects for easy access later
const planets = [];

// Data for our planets [color, size, orbital radius, orbital speed]
const planetsData = [
    { color: 0x4a90e2, size: 1.2, distance: 12, speed: 0.5 },  // Blue planet
    { color: 0xd0021b, size: 0.8, distance: 18, speed: 0.3 },  // Red planet
    { color: 0xf5a623, size: 2, distance: 25, speed: 0.15 }  // Orange/Gas planet
];

// Loop through the data to create each planet
planetsData.forEach(planetInfo => {
    const planetGeometry = new THREE.SphereGeometry(planetInfo.size, 32, 32);
    // We use MeshStandardMaterial so planets are affected by the PointLight
    const planetMaterial = new THREE.MeshStandardMaterial({ color: planetInfo.color });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

    // --- Add custom properties to the mesh object ---
    planetMesh.distance = planetInfo.distance;
    planetMesh.speed = planetInfo.speed;

    // Set an initial position based on its distance
    planetMesh.position.x = planetInfo.distance;

    // Add the planet to the scene
    scene.add(planetMesh);
    // Add the mesh to our array for the animation step
    planets.push(planetMesh);
});


// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    // This is required for the damping/inertia on the controls to work
    controls.update();

    renderer.render(scene, camera);
}

animate();

// --- RESIZE HANDLER ---
// Adjust canvas and camera if the window size changes
window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

