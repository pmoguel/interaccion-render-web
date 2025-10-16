import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

// --- HTML Elements ---
const canvas = document.getElementById('solar-system');
const toggleButton = document.getElementById('toggle-camera');
const infoBox = document.getElementById('free-camera-info');
const speedButtons = document.querySelectorAll('.speed-btn');
const visibilityToggles = document.querySelectorAll('.toggle-btn');
const uiContainer = document.querySelector('.ui-container'); // Get the main UI container

// --- Global State ---
let simulationSpeed = 1.0;
let customElapsedTime = 0;

// --- Scene Setup ---
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// 1. Enable shadows on the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows

// --- Camera Setup ---
const orbitCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// UPDATED: Changed the starting camera position for a lower, horizon-like view
orbitCamera.position.set(0, 10, 60);
const freeCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
freeCamera.position.set(0, 10, 50);
let activeCamera = orbitCamera;

// --- Controls Setup ---
const orbitControls = new OrbitControls(orbitCamera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.05;
orbitControls.maxDistance = 95;

const freeCameraState = { moveForward: false, moveBackward: false, moveLeft: false, moveRight: false, moveUp: false, moveDown: false, speed: 0.5, lookSpeed: 0.002 };

// --- Sun, Lights, Stars, etc. ---
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('https://raw.githubusercontent.com/nidorx/matcaps/master/1024/FBB43F_FBE993_FB552E_FCDD65.png');
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);
const pointLight = new THREE.PointLight(0xfeffb3, 500, 300);
pointLight.position.set(0, 0, 0);
// 2. Make the light cast shadows
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2048; // Higher resolution for sharper shadows
pointLight.shadow.mapSize.height = 2048;
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0x404040, 0.9);
scene.add(ambientLight);
const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) { positions[i * 3] = (Math.random() - 0.5) * 200; positions[i * 3 + 1] = (Math.random() - 0.5) * 200; positions[i * 3 + 2] = (Math.random() - 0.5) * 200; }
starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, sizeAttenuation: true });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);
const asteroidBelt = new THREE.Group();
const asteroidCount = 700;
const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
for (let i = 0; i < asteroidCount; i++) { const asteroidGeometry = new THREE.DodecahedronGeometry(Math.random() * 0.15 + 0.05, 0); const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial); const angle = Math.random() * Math.PI * 2; 
const radius = Math.random() * 5 + 35; 
const x = Math.cos(angle) * radius; const z = Math.sin(angle) * radius; const y = (Math.random() - 0.5) * 1; asteroid.position.set(x, y, z); asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI); 
// 3. Make asteroids cast and receive shadows
asteroid.castShadow = true; asteroid.receiveShadow = true;
asteroidBelt.add(asteroid); }
scene.add(asteroidBelt);

const orbits = [], planetMeshes = [], moonOrbits = [], orbitLines = [];
const planetsData = [
    { name: 'Planet 1', color: 0x4a90e2, size: 1.2, distance: 14.4, speed: 0.5, rotationSpeed: 0.4, axialTilt: 0.1, eccentricity: 0.95, moons: [{ color: 0xaaaaaa, size: 0.3, distance: 2, speed: 2.0 }] },
    { name: 'Planet 2', color: 0xd0021b, size: 0.8, distance: 21.6, speed: 0.3, rotationSpeed: 0.6, axialTilt: -0.05, eccentricity: 1.0 },
    { name: 'Planet 3', color: 0xf5a623, size: 2, distance: 30, speed: 0.15, rotationSpeed: 0.2, axialTilt: 0.2, eccentricity: 0.9, rings: { innerRadius: 2.5, outerRadius: 4 } },
    { name: 'Planet 4', color: 0x2ecc71, size: 1.5, distance: 42, speed: 0.1, rotationSpeed: 0.3, axialTilt: 0.3, eccentricity: 1.0, moons: Array.from({ length: 12 }, () => ({ color: 0xeeeeee, size: Math.random() * 0.1 + 0.05, distance: Math.random() * 1.5 + 2.0, speed: Math.random() * 2.0 + 1.0 })) },
    { name: 'Planet 5', color: 0x9b59b6, size: 0.9, distance: 50, speed: 0.08, rotationSpeed: 0.5, axialTilt: -0.15, eccentricity: 0.85, moons: [{ color: 0xdddddd, size: 0.25, distance: 2.5, speed: 1.8 }] }
];
planetsData.forEach(planetInfo => { const pGeom = new THREE.SphereGeometry(planetInfo.size, 32, 32); const pMat = new THREE.MeshStandardMaterial({ color: planetInfo.color }); const pMesh = new THREE.Mesh(pGeom, pMat); pMesh.rotation.x = planetInfo.axialTilt; pMesh.rotationSpeed = planetInfo.rotationSpeed; 
// 3. Make planets cast and receive shadows
pMesh.castShadow = true; pMesh.receiveShadow = true;
planetMeshes.push(pMesh); if (planetInfo.rings) { const ringGeom = new THREE.RingGeometry(planetInfo.rings.innerRadius, planetInfo.rings.outerRadius, 64); const ringMat = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, transparent: true, opacity: 0.6 }); const ringMesh = new THREE.Mesh(ringGeom, ringMat); ringMesh.rotation.x = Math.PI / 2; 
// 3. Make rings cast and receive shadows
ringMesh.castShadow = true; ringMesh.receiveShadow = true;
pMesh.add(ringMesh); } const oGroup = new THREE.Group(); oGroup.rotation.x = (Math.random() - 0.5) * 0.3; oGroup.rotation.z = (Math.random() - 0.5) * 0.3; oGroup.scale.z = planetInfo.eccentricity; if (planetInfo.moons) { planetInfo.moons.forEach(moonInfo => { const mGeom = new THREE.SphereGeometry(moonInfo.size, 16, 16); const mMat = new THREE.MeshStandardMaterial({ color: moonInfo.color }); const mMesh = new THREE.Mesh(mGeom, mMat); 
// 3. Make moons cast and receive shadows
mMesh.castShadow = true; mMesh.receiveShadow = true;
const mOGroup = new THREE.Group(); mOGroup.speed = moonInfo.speed; mOGroup.startAngle = Math.random() * Math.PI * 2; mOGroup.rotation.y = mOGroup.startAngle; mMesh.position.x = moonInfo.distance; mOGroup.add(mMesh); pMesh.add(mOGroup); moonOrbits.push(mOGroup); }); } const points = []; const segments = 128; for (let i = 0; i <= segments; i++) { const theta = (i / segments) * Math.PI * 2; points.push(new THREE.Vector3(Math.cos(theta) * planetInfo.distance, 0, Math.sin(theta) * planetInfo.distance)); } const oGeom = new THREE.BufferGeometry().setFromPoints(points); const oMat = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.5, gapSize: 0.25, }); const oLine = new THREE.Line(oGeom, oMat); oLine.computeLineDistances(); orbitLines.push(oLine); oGroup.add(oLine); oGroup.speed = planetInfo.speed; oGroup.startAngle = Math.random() * Math.PI * 2; oGroup.rotation.y = oGroup.startAngle; pMesh.position.x = planetInfo.distance; oGroup.add(pMesh); scene.add(oGroup); orbits.push(oGroup); });

// --- Initial Visibility Setup ---
stars.visible = false;
asteroidBelt.visible = false;
moonOrbits.forEach(m => m.visible = false);
orbitLines.forEach(o => o.visible = false);

// --- Event Listeners ---
toggleButton.addEventListener('click', () => { if (activeCamera === orbitCamera) { activeCamera = freeCamera; orbitControls.enabled = false; toggleButton.textContent = 'Orbit Camera'; infoBox.classList.remove('hidden'); canvas.requestPointerLock(); } else { activeCamera = orbitCamera; orbitControls.enabled = true; toggleButton.textContent = 'Free Camera'; infoBox.classList.add('hidden'); document.exitPointerLock(); } });
const onKey = (e, isDown) => { switch (e.code) { case 'KeyW': freeCameraState.moveForward = isDown; break; case 'KeyS': freeCameraState.moveBackward = isDown; break; case 'KeyA': freeCameraState.moveLeft = isDown; break; case 'KeyD': freeCameraState.moveRight = isDown; break; case 'KeyQ': freeCameraState.moveDown = isDown; break; case 'KeyE': freeCameraState.moveUp = isDown; break; } };
document.addEventListener('keydown', (e) => onKey(e, true));
document.addEventListener('keyup', (e) => onKey(e, false));
const euler = new THREE.Euler(0, 0, 0, 'YXZ');
document.addEventListener('mousemove', (e) => { if (document.pointerLockElement === canvas) { euler.setFromQuaternion(freeCamera.quaternion); euler.y -= e.movementX * freeCameraState.lookSpeed; euler.x -= e.movementY * freeCameraState.lookSpeed; euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x)); freeCamera.quaternion.setFromEuler(euler); } });
speedButtons.forEach(button => { button.addEventListener('click', () => { simulationSpeed = parseFloat(button.dataset.speed); speedButtons.forEach(btn => btn.classList.remove('active')); button.classList.add('active'); }); });

visibilityToggles.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.target;
        let isVisible;
        const toggleVisibility = (collection) => {
            const currentlyVisible = collection[0] ? collection[0].visible : false;
            collection.forEach(item => item.visible = !currentlyVisible);
            return !currentlyVisible;
        };
        switch (target) {
            case 'stars': stars.visible = !stars.visible; isVisible = stars.visible; break;
            case 'planets': isVisible = toggleVisibility(planetMeshes); break;
            case 'moons': isVisible = toggleVisibility(moonOrbits); break;
            case 'orbits': isVisible = toggleVisibility(orbitLines); break;
            case 'asteroids': asteroidBelt.visible = !asteroidBelt.visible; isVisible = asteroidBelt.visible; break;
        }
        button.classList.toggle('active', isVisible);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        uiContainer.classList.toggle('hidden');
    }
});

// --- Initialize Button States on Load ---
visibilityToggles.forEach(button => {
    const target = button.dataset.target;
    let isVisible;
    switch (target) {
        case 'stars': isVisible = stars.visible; break;
        case 'planets': isVisible = planetMeshes.length > 0 ? planetMeshes[0].visible : true; break;
        case 'moons': isVisible = moonOrbits.length > 0 ? moonOrbits[0].visible : true; break;
        case 'orbits': isVisible = orbitLines.length > 0 ? orbitLines[0].visible : true; break;
        case 'asteroids': isVisible = asteroidBelt.visible; break;
    }
    button.classList.toggle('active', isVisible);
});


// --- Update & Animation Loop ---
const clock = new THREE.Clock();
function updateFreeCamera() { if (freeCameraState.moveForward) freeCamera.translateZ(-freeCameraState.speed); if (freeCameraState.moveBackward) freeCamera.translateZ(freeCameraState.speed); if (freeCameraState.moveLeft) freeCamera.translateX(-freeCameraState.speed); if (freeCameraState.moveRight) freeCamera.translateX(freeCameraState.speed); if (freeCameraState.moveUp) freeCamera.translateY(freeCameraState.speed); if (freeCameraState.moveDown) freeCamera.translateY(-freeCameraState.speed); }

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();
    customElapsedTime += deltaTime * simulationSpeed;

    asteroidBelt.rotation.y = customElapsedTime * 0.05;
    orbits.forEach(o => { o.rotation.y = customElapsedTime * o.speed + o.startAngle; });
    planetMeshes.forEach(p => { p.rotation.y = customElapsedTime * p.rotationSpeed; });
    moonOrbits.forEach(m => { m.rotation.y = customElapsedTime * m.speed + m.startAngle; });
    if (activeCamera === freeCamera) { updateFreeCamera(); } else { orbitControls.update(); }
    renderer.render(scene, activeCamera);
}
animate();

window.addEventListener('resize', () => { orbitCamera.aspect = window.innerWidth / window.innerHeight; orbitCamera.updateProjectionMatrix(); freeCamera.aspect = window.innerWidth / window.innerHeight; freeCamera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(window.devicePixelRatio); });

