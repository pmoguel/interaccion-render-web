import * as THREE from 'three'
import gsap from 'gsap';
/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshBasicMaterial({ color: '#ff6600', wireframe: true })
);

scene.add(object1);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

// Mouse move handler
window.addEventListener('mousemove', (event) => {
    // Convert mouse position to normalized device coordinates
    pointer.x = (event.clientX / sizes.width) * 2 - 1
    pointer.y = - (event.clientY / sizes.height) * 2 + 1
})

// Mouse click handler
window.addEventListener('click', (event) => {
    // Convert mouse position to normalized device coordinates
    pointer.x = (event.clientX / sizes.width) * 2 - 1
    pointer.y = - (event.clientY / sizes.height) * 2 + 1
    
    // Update raycaster with current mouse position
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObject(object1)
    
    if(intersects.length) {
        // Animate rotation 720° (2 full rotations) on Y axis
        gsap.to(object1.rotation, { 
            y: object1.rotation.y + Math.PI * 4, // 720° = 4π radianes
            duration: 2,
            ease: "power2.out"
        })
    }
})

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update raycaster
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObject(object1)

    if(intersects.length) {
        // Mouse enter
        gsap.to(object1.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.3 })
    } else {
        // Mouse leave
        gsap.to(object1.scale, { x: 1, y: 1, z: 1, duration: 0.3 })
    }

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 2) * 0.1;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();