import * as THREE from 'three'
import gsap from 'gsap';
console.log(gsap);
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
object1.position.x = -0.8;

const object2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.8, 0.8),
    new THREE.MeshBasicMaterial({ color: '#00ff66', wireframe: true })
);
object2.position.x = 0.8;

scene.add(object1, object2);

// Array of objects for easier management
const objects = [object1, object2];

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
    
    // 1. Primero, calcula la posición del puntero y lanza el raycaster
    pointer.x = (event.clientX / sizes.width) * 2 - 1
    pointer.y = - (event.clientY / sizes.height) * 2 + 1
    
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(objects)
    
    // 2. AHORA, comprueba si el clic golpeó algo
    if(intersects.length) {
        // SÍ se hizo clic en un objeto
        
        // Cambia los colores
        object1.material.color = new THREE.Color("#ffff00");
        object2.material.color = new THREE.Color("#00fff0");
        
        // Y aplica la animación al objeto específico que se clickeó
        const clickedObject = intersects[0].object
        gsap.to(clickedObject.rotation, { 
            y: clickedObject.rotation.y + Math.PI * 4, // 720°
            duration: 2,
            ease: "power2.out"
        })
    }
    else {
        object1.material.color = new THREE.Color("#ff6600");
        object2.material.color = new THREE.Color("#00ff66");
    }
})

const objectsToTest = [object1]
const objectsToTest2 = [object2]

/**
 * Animate
 */
const clock = new THREE.Clock();

// --- Variable para el hover ---
// (Esta sección no estaba en tu código, pero es necesaria
// si quieres que el "click" y el "hover" funcionen bien juntos)
let currentIntersect = null; 

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update raycaster
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(objects)

    // Lógica de HOVER (escalado)
    if(intersects.length) {
        // Si hay una intersección, guárdala
        currentIntersect = intersects[0];
        gsap.to(currentIntersect.object.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.3 })
    }
    else {
        // Si no hay intersección...
        if(currentIntersect) {
            // ...pero SÍ había una guardada, significa que el mouse se fue.
            // La devolvemos a su escala original.
            gsap.to(currentIntersect.object.scale, { x: 1, y: 1, z: 1, duration: 0.3 })
        }
        // Y limpiamos la variable
        currentIntersect = null;
    }
    
    // (Tu lógica de escalado anterior hacía que los objetos
    // se encogieran y crecieran constantemente. Esta nueva
    // lógica es más estable).

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 2) * 0.1;
    object2.position.y = Math.cos(elapsedTime * 2) * 0.1;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();