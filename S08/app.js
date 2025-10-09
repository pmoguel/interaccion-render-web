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

const orbits = [];

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

    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = (Math.random() - 0.5) * 0.3;
    orbitGroup.rotation.z = (Math.random() - 0.5) * 0.3;

    // --- Create the dotted line trajectory ---
    const points = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * planetInfo.distance, 0, Math.sin(theta) * planetInfo.distance));
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineDashedMaterial({
        color: 0xffffff,
        dashSize: 0.5,
        gapSize: 0.25,
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitLine.computeLineDistances(); // This is crucial for dashed lines to render
    orbitGroup.add(orbitLine);
    // --- End of trajectory code ---

    orbitGroup.speed = planetInfo.speed;
    orbitGroup.startAngle = Math.random() * Math.PI * 2;
    orbitGroup.rotation.y = orbitGroup.startAngle;

    planetMesh.position.x = planetInfo.distance;
    orbitGroup.add(planetMesh);
    
    scene.add(orbitGroup);
    orbits.push(orbitGroup);
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    orbits.forEach(orbit => {
        orbit.rotation.y = elapsedTime * orbit.speed + orbit.startAngle;
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

