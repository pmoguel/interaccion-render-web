import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

// --- HTML Elements ---
const canvas = document.getElementById('solar-system');
const toggleButton = document.getElementById('toggle-camera');
const infoBox = document.getElementById('free-camera-info');

// --- Scene Setup ---
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// --- Camera Setup ---
// 1. Orbit Camera (original)
const orbitCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
orbitCamera.position.z = 30;

// 2. Free Camera (new)
const freeCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
freeCamera.position.set(0, 10, 50);

let activeCamera = orbitCamera; // Start with the orbit camera

// --- Controls Setup ---
const orbitControls = new OrbitControls(orbitCamera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.05;

const freeCameraState = {
    moveForward: false, moveBackward: false, moveLeft: false,
    moveRight: false, moveUp: false, moveDown: false,
    speed: 0.5,
    lookSpeed: 0.002
};

// --- Sun, Lights, Stars, etc. (No changes here) ---
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('https://raw.githubusercontent.com/nidorx/matcaps/master/1024/FBB43F_FBE993_FB552E_FCDD65.png');
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);
const pointLight = new THREE.PointLight(0xfeffb3, 500, 300);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0x404040, 0.9);
scene.add(ambientLight);
const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, sizeAttenuation: true });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);
const asteroidBelt = new THREE.Group();
const asteroidCount = 700;
const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
for (let i = 0; i < asteroidCount; i++) {
    const asteroidGeometry = new THREE.DodecahedronGeometry(Math.random() * 0.15 + 0.05, 0);
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 4 + 32;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (Math.random() - 0.5) * 1;
    asteroid.position.set(x, y, z);
    asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    asteroidBelt.add(asteroid);
}
scene.add(asteroidBelt);
const orbits = [], planetMeshes = [], moonOrbits = [];
const planetsData = [{ color: 0x4a90e2, size: 1.2, distance: 14.4, speed: 0.5, rotationSpeed: 0.4, moons: [{ color: 0xaaaaaa, size: 0.3, distance: 2, speed: 2.0 }] }, { color: 0xd0021b, size: 0.8, distance: 21.6, speed: 0.3, rotationSpeed: 0.6 }, { color: 0xf5a623, size: 2, distance: 30, speed: 0.15, rotationSpeed: 0.2, moons: [{ color: 0xcccccc, size: 0.4, distance: 3, speed: 1.5 }, { color: 0xbbbbbb, size: 0.2, distance: 4.5, speed: 1.0 }] }, { color: 0x2ecc71, size: 1.5, distance: 38.4, speed: 0.1, rotationSpeed: 0.3, moons: Array.from({ length: 12 }, () => ({ color: 0xeeeeee, size: Math.random() * 0.1 + 0.05, distance: Math.random() * 1.5 + 2.0, speed: Math.random() * 2.0 + 1.0 })) }, { color: 0x9b59b6, size: 0.9, distance: 45.6, speed: 0.08, rotationSpeed: 0.5, moons: [{ color: 0xdddddd, size: 0.25, distance: 2.5, speed: 1.8 }] }];
planetsData.forEach(planetInfo => { const planetGeometry = new THREE.SphereGeometry(planetInfo.size, 32, 32); const planetMaterial = new THREE.MeshStandardMaterial({ color: planetInfo.color }); const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial); planetMesh.rotationSpeed = planetInfo.rotationSpeed; planetMeshes.push(planetMesh); const orbitGroup = new THREE.Group(); orbitGroup.rotation.x = (Math.random() - 0.5) * 0.3; orbitGroup.rotation.z = (Math.random() - 0.5) * 0.3; if (planetInfo.moons) { planetInfo.moons.forEach(moonInfo => { const moonGeometry = new THREE.SphereGeometry(moonInfo.size, 16, 16); const moonMaterial = new THREE.MeshStandardMaterial({ color: moonInfo.color }); const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial); const moonOrbitGroup = new THREE.Group(); moonOrbitGroup.speed = moonInfo.speed; moonOrbitGroup.startAngle = Math.random() * Math.PI * 2; moonOrbitGroup.rotation.y = moonOrbitGroup.startAngle; moonMesh.position.x = moonInfo.distance; moonOrbitGroup.add(moonMesh); planetMesh.add(moonOrbitGroup); moonOrbits.push(moonOrbitGroup); }); } const points = []; const segments = 128; for (let i = 0; i <= segments; i++) { const theta = (i / segments) * Math.PI * 2; points.push(new THREE.Vector3(Math.cos(theta) * planetInfo.distance, 0, Math.sin(theta) * planetInfo.distance)); } const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points); const orbitMaterial = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.5, gapSize: 0.25, }); const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial); orbitLine.computeLineDistances(); orbitGroup.add(orbitLine); orbitGroup.speed = planetInfo.speed; orbitGroup.startAngle = Math.random() * Math.PI * 2; orbitGroup.rotation.y = orbitGroup.startAngle; planetMesh.position.x = planetInfo.distance; orbitGroup.add(planetMesh); scene.add(orbitGroup); orbits.push(orbitGroup); });

// --- Event Listeners for Camera Toggling and Controls ---
toggleButton.addEventListener('click', () => {
    if (activeCamera === orbitCamera) {
        activeCamera = freeCamera;
        orbitControls.enabled = false;
        toggleButton.textContent = 'Orbit Camera';
        infoBox.classList.remove('hidden');
        // Lock pointer for look controls
        canvas.requestPointerLock();
    } else {
        activeCamera = orbitCamera;
        orbitControls.enabled = true;
        toggleButton.textContent = 'Free Camera';
        infoBox.classList.add('hidden');
        document.exitPointerLock();
    }
});

// Free Camera Keyboard Controls
const onKey = (e, isDown) => {
    switch (e.code) {
        case 'KeyW': freeCameraState.moveForward = isDown; break;
        case 'KeyS': freeCameraState.moveBackward = isDown; break;
        case 'KeyA': freeCameraState.moveLeft = isDown; break;
        case 'KeyD': freeCameraState.moveRight = isDown; break;
        case 'KeyQ': freeCameraState.moveDown = isDown; break;
        case 'KeyE': freeCameraState.moveUp = isDown; break;
    }
};
document.addEventListener('keydown', (e) => onKey(e, true));
document.addEventListener('keyup', (e) => onKey(e, false));

// Free Camera Mouse Look Controls
const euler = new THREE.Euler(0, 0, 0, 'YXZ');
document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === canvas) {
        euler.setFromQuaternion(freeCamera.quaternion);
        euler.y -= e.movementX * freeCameraState.lookSpeed;
        euler.x -= e.movementY * freeCameraState.lookSpeed;
        euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
        freeCamera.quaternion.setFromEuler(euler);
    }
});

// --- Update Functions ---
const clock = new THREE.Clock();

function updateFreeCamera() {
    if (freeCameraState.moveForward) freeCamera.translateZ(-freeCameraState.speed);
    if (freeCameraState.moveBackward) freeCamera.translateZ(freeCameraState.speed);
    if (freeCameraState.moveLeft) freeCamera.translateX(-freeCameraState.speed);
    if (freeCameraState.moveRight) freeCamera.translateX(freeCameraState.speed);
    if (freeCameraState.moveUp) freeCamera.translateY(freeCameraState.speed);
    if (freeCameraState.moveDown) freeCamera.translateY(-freeCameraState.speed);
}

// --- Main Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Scene animations (planets, asteroids, etc.)
    asteroidBelt.rotation.y = elapsedTime * 0.05;
    orbits.forEach(o => { o.rotation.y = elapsedTime * o.speed + o.startAngle; });
    planetMeshes.forEach(p => { p.rotation.y = elapsedTime * p.rotationSpeed; });
    moonOrbits.forEach(m => { m.rotation.y = elapsedTime * m.speed + m.startAngle; });
    
    // Update the active camera's controls
    if (activeCamera === freeCamera) {
        updateFreeCamera();
    } else {
        orbitControls.update();
    }
    
    renderer.render(scene, activeCamera);
}
animate();

// --- Resize Handler ---
window.addEventListener('resize', () => {
    // Update both cameras
    orbitCamera.aspect = window.innerWidth / window.innerHeight;
    orbitCamera.updateProjectionMatrix();
    freeCamera.aspect = window.innerWidth / window.innerHeight;
    freeCamera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

