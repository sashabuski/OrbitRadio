import * as THREE from 'three';

const stationsList = [];
const particleIndexMap = new Map(); // Stores index-to-station mapping

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x000000, 1);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const sphereGroup = new THREE.Group();
scene.add(sphereGroup);

// Load Earth texture
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('map2.jpg');
const sphereGeometry = new THREE.SphereGeometry(100, 64, 64);
const sphereMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.visible = false;
sphereGroup.add(sphere);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// Convert latitude & longitude to 3D coordinates
function latLonToCartesian(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

// Fetch station data
async function fetchStationsFromLocal(limit = 500000) {
    try {
        const response = await fetch('./stations.json'); 
        const stations = await response.json();
        const filteredStations = stations.filter(station => station.geo_lat && station.geo_long);
        stationsList.push(...filteredStations.slice(0, limit));
        addStationsAsParticles(); // Call function after fetching data
    } catch (error) {
        console.error('Error fetching local stations:', error);
    }
}

let particles; // Reference to the particle system

// Add stations as particles
function addStationsAsParticles() {
    if (stationsList.length === 0) return;

    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(stationsList.length * 3);

    for (let i = 0; i < stationsList.length; i++) {
        const { geo_lat, geo_long } = stationsList[i];
        const position = latLonToCartesian(geo_lat, geo_long, 100.1);

        positions[i * 3] = position.x;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z;

        particleIndexMap.set(i, stationsList[i]); // Store index-to-station mapping
    }

    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/circle.png');

    const particleMaterial = new THREE.PointsMaterial({
        map: particleTexture,
        size: 0.9,
        transparent: true,
        alphaTest: 0.5,
        blending: THREE.AdditiveBlending
        
    });

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles = new THREE.Points(particleGeometry, particleMaterial);
    sphereGroup.add(particles);
}                         

// Raycasting for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
console.log("daskjdha");
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(particles);

    if (intersects.length > 0) {
        const index = intersects[0].index; // Get the index of the clicked particle
        const station = particleIndexMap.get(index);
        if (station) {
            console.log('Clicked Station:', station);
        }
    }
}

window.addEventListener('click', onClick, false);

// Camera & Interaction Setup
camera.position.z = 230;
let targetZ = camera.position.z;
let zoomSpeed = 0.01 * camera.position.z / 40;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function onWheel(event) {
    targetZ += event.deltaY * zoomSpeed;
    targetZ = Math.max(130, Math.min(230, targetZ));
}

function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseMove(event) {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    sphereGroup.rotation.y += deltaX * 0.002;
    sphereGroup.rotation.x += deltaY * 0.002;

    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseUp() {
    isDragging = false;
}

window.addEventListener('wheel', onWheel, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mouseup', onMouseUp, false);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    sphereGroup.rotation.y += 0.001;
    renderer.render(scene, camera);
}

fetchStationsFromLocal(500000);
animate();
