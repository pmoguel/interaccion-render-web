import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('solar-system'),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 30;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('https://raw.githubusercontent.com/nidorx/matcaps/master/1024/FBB43F_FBE993_FB552E_FCDD65.png');

const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);

const pointLight = new THREE.PointLight(0xffffff, 500, 300);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.9);
scene.add(ambientLight);

const planets = [];

const planetsData = [
    { color: 0x4a90e2, size: 1.2, distance: 12, speed: 0.5 },
    { color: 0xd0021b, size: 0.8, distance: 18, speed: 0.3 },
    { color: 0xf5a623, size: 2, distance: 25, speed: 0.15 },
    { color: 0x2ecc71, size: 1.5, distance: 32, speed: 0.1 },
    { color: 0x9b59b6, size: 0.9, distance: 38, speed: 0.08 }
];

planetsData.forEach(planetInfo => {
    const planetGeometry = new THREE.SphereGeometry(planetInfo.size, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({ color: planetInfo.color });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

    planetMesh.distance = planetInfo.distance;
    planetMesh.speed = planetInfo.speed;

    const randomAngle = Math.random() * Math.PI * 2;
    // Store the random starting angle on the mesh itself
    planetMesh.startAngle = randomAngle;

    // Set the initial position using the random angle
    planetMesh.position.x = Math.cos(randomAngle) * planetInfo.distance;
    planetMesh.position.z = Math.sin(randomAngle) * planetInfo.distance;

    scene.add(planetMesh);
    planets.push(planetMesh);
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    planets.forEach(planet => {
        // Calculate the angle of rotation based on time AND the initial random angle
        const currentAngle = elapsedTime * planet.speed + planet.startAngle;
        planet.position.x = Math.cos(currentAngle) * planet.distance;
        planet.position.z = Math.sin(currentAngle) * planet.distance;
    });

    controls.update();

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

