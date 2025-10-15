///// ESTUDIANTES AQUÍ
    const PORTAL_SIZE = 4;
    const PORTAL_SPEED = 5;
    var portalColor = "#ff6633";
    var portalPatterns = [
        './assets/tiles/Craters/Craters 13 - 512x512.png',
        './assets/tiles/Milky/Milky 12 - 512x512.png',
        './assets/tiles/Streak/Streak 4 - 512x512.png',
        './assets/tiles/Swirl/Swirl 1 - 512x512.png',
        './assets/tiles/Swirl/Swirl 10 - 512x512.png',
        './assets/tiles/Swirl/Swirl 11 - 512x512.png',
        './assets/tiles/Super Perlin/Super Perlin 13 - 512x512.png',
        './assets/tiles/Super Perlin/Super Perlin 14 - 512x512.png',
    ];
    var patternIndex = Math.round( Math.random() * (portalPatterns.length - 1) );
    // patternIndex = 5;
    var selectedPattern = portalPatterns[patternIndex];
    



///// No se preocupen demasiado por lo que hay debajo todavía, lo entenderemos poco a poco durante el semestre.

// Shaders
const planeVertexShader = `
varying vec2 vUv;

void main()
{
    vec3 pos = position;

    float radialGradient = length(uv - 0.5);
    float fadeCircleMask = (1. - radialGradient);
    fadeCircleMask = smoothstep(0.3, 1., fadeCircleMask);
    fadeCircleMask *= 0.25;

    pos.z += fadeCircleMask;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
}
`;

const planeFragmentShader = `
#define PI 3.1415926535897932384626433832795

uniform sampler2D tMap;
uniform vec3 uColor;
uniform float uAnimate;
varying vec2 vUv;

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

vec2 uvToPolar(vec2 uv) {
    // Step 1: Translate UV to center
    vec2 centeredUV = uv - 0.5;
    
    // Step 2: Calculate radius
    float radius = length(centeredUV); // sqrt(centeredUV.x^2 + centeredUV.y^2)

    // Step 3: Calculate angle (in radians)
    float angle = atan(centeredUV.y, centeredUV.x); // Range: [-PI, PI]

    // Optional: Normalize the angle to [0, 1]
    angle = (angle + PI) / (2.0 * PI); // Range: [0, 1]

    // Return polar coordinates (radius, normalized angle)
    return vec2(radius, angle);
}

vec2 uvToPolarFlowing(vec2 uv, float time) {
  // Step 1: Translate UV to center
    vec2 centeredUV = uv - 0.5;
    
    // Step 2: Calculate radius
    float radius = length(centeredUV); // sqrt(centeredUV.x^2 + centeredUV.y^2)

    // Step 2.1: add time offset to make it flow
    radius += time;

    // Step 3: Calculate angle (in radians)
    float angle = atan(centeredUV.y, centeredUV.x); // Range: [-PI, PI]

    // Optional: Normalize the angle to [0, 1]
    angle = (angle + PI) / (2.0 * PI); // Range: [0, 1]

    // Return polar coordinates (radius, normalized angle)
    return vec2(radius, angle);
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main()
{
    float speed = 0.7;

    vec2 uv = uvToPolarFlowing(vUv, -uAnimate * speed);
    vec2 uv2 = rotate(vUv, 30. + (uAnimate * -1.), vec2(0.5));
    uv2 = uvToPolarFlowing(uv2, -uAnimate * (speed * 1.25));

    vec4 texel = texture2D(tMap, uv);
    vec4 texel2 = texture2D(tMap, uv2);
    texel *= texel2;
    texel *= 2.;

    float radialGradient = length(vUv - 0.5);
    float radialMask = 1. - radialGradient;
    radialMask += 0.05;
    // radialMask = pow(radialMask, 6.);
    texel *= radialMask;

    float centerMask = smoothstep(0.0, 0.08, radialGradient);
    texel *= centerMask;

    // texel = vec4(1. - step(texel.r, 0.1));
    texel = vec4(smoothstep(0.15, (cos(uAnimate * 5.) * 0.3) + 0.7, texel.r));

    float alpha = texel.r;

    // vec3 purple = vec3(0.37, 0.22, 0.51);
    texel *= (sin(uAnimate * 20.) * 0.05) + 0.05;
    vec3 colorOverlay = uColor;
    texel.rgb += colorOverlay;

    float centerGlowStrength = 1. - radialGradient;
    float centerGlowStrength2 = smoothstep(0.6, 1.15, centerGlowStrength);
    centerGlowStrength = smoothstep(0.75, 1., centerGlowStrength);
    centerGlowStrength = pow(centerGlowStrength + 0.1, 3.);
    vec3 centerGlow = colorOverlay * centerGlowStrength;
    centerGlow += pow(centerGlowStrength2 + 0.2, 4.);

    texel.rgb += centerGlow;
    alpha += centerGlowStrength2;

    float fadeCircleMask = (1. - radialGradient);
    fadeCircleMask = smoothstep(0.5, .7, fadeCircleMask);

    alpha *= fadeCircleMask;

    // gl_FragColor = vec4(centerGlow, centerGlowStrength);
    gl_FragColor = vec4(texel.rgb, alpha);
    // gl_FragColor = vec4(fadeCircleMask);
}
`;


// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Texture loader
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(selectedPattern);
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.generateMipmaps = false;

const img = document.createElement('img');
img.src = selectedPattern;
img.alt = 'Pattern selected via JavaScript.';
img.style.width = '150px';
img.style.display = 'block';
img.style.position = 'absolute';
img.style.bottom = '0';
img.style.left = '0';
document.body.appendChild(img);


// plane
const geometry = new THREE.PlaneGeometry(PORTAL_SIZE, PORTAL_SIZE);
const material = new THREE.ShaderMaterial({
    vertexShader: planeVertexShader,
    fragmentShader: planeFragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
        tMap: { value: texture },
        uColor: { value: new THREE.Color(portalColor) },
        uAnimate: { value: 0 },
    }
});
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 5;

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime(); // in seconds

    plane.position.y = Math.sin(elapsedTime) * 0.25;

    material.uniforms.uAnimate.value = elapsedTime * (0.1 * PORTAL_SPEED);

    renderer.render(scene, camera);
}
animate();

function resizeCanvas() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', resizeCanvas);