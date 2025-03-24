import * as THREE from 'three';

const latitudes = [];
const longitudes = [];
let stationsList = [];

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x000000, 1); // Set a solid black background
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit device pixel ratio for better performance

// Create a group to rotate the sphere and point together
const sphereGroup = new THREE.Group();
scene.add(sphereGroup);

// Load Earth texture
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('map2.jpg'); // Replace with the correct path to your texture

// Create sphere with texture
const sphereGeometry = new THREE.SphereGeometry(100, 64, 64);
const sphereMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

sphereGroup.add(sphere);

// Add lighting for better visibility
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // Soft ambient light
scene.add(ambientLight);

// Function to convert latitude and longitude to Cartesian coordinates
function latLonToCartesian(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}
 // Declare globally to store station data

// Optimized fetching and rendering of stations with InstancedMesh
async function fetchStationsFromLocal(limit = 500) {
    try {
        const response = await fetch('./stations.json'); // Adjust path if necessary
        const stations = await response.json();

        const filteredStations = stations.filter(station => station.geo_lat && station.geo_long);
        stationsList = filteredStations.slice(0, limit); // Store in global variable

        stationsList.forEach(station => {
            latitudes.push(station.geo_lat);
            longitudes.push(station.geo_long);
        });

        console.log('Latitudes:', latitudes);
        console.log('Longitudes:', longitudes);
        console.log('Limited Stations:', stationsList);

        // Using InstancedMesh to optimize rendering
       
    } catch (error) {
        console.error('Error fetching local stations:', error);
    }
}

// Call the function to fetch 500 stations
fetchStationsFromLocal(500);

// Wait for the DOM to load before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("top-button");

    button.addEventListener("click", () => {
        if (stationsList.length > 0) {
            console.log(stationsList[0]);

            // Get the position of the station in 3D space
            const pointPosition = latLonToCartesian(stationsList[0].geo_lat, stationsList[0].geo_long, 100);
            
            // Create point geometry (small sphere)
            const pointGeometry = new THREE.SphereGeometry(0.25, 24, 24);
            const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const point = new THREE.Mesh(pointGeometry, pointMaterial);
            point.position.copy(pointPosition);
            sphereGroup.add(point);
            rotateGlobeToFace(stationsList[0].geo_lat, stationsList[0].geo_long);

        
        } else {
            console.log("Stations list is empty or not loaded yet.");
        }
    });
});



function rotateGlobeToFace(lat, lon, duration = 1000) {
    // Convert lat/lon to Cartesian coordinates (on sphere surface)
    const targetPosition = latLonToCartesian(lat, lon, 100).normalize();

    // The default "front" of the globe in its local space
    const currentForward = new THREE.Vector3(0, 0, 1); // Default front-facing direction

    // Compute quaternion rotation from front direction to target point
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(currentForward, targetPosition);

    // Apply rotation to the sphere group smoothly
    const startQuaternion = sphereGroup.quaternion.clone();
    const startTime = performance.now();

    function animateRotation(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1); // Clamp progress between 0 and 1

        // Interpolate rotation using quaternion slerp
        sphereGroup.quaternion.slerpQuaternions(startQuaternion, quaternion, progress);

        if (progress < 1) {
            requestAnimationFrame(animateRotation);
        }
    }

    requestAnimationFrame(animateRotation);
}


// Set camera position
camera.position.z = 230;

// Variables for zooming
let targetZ = camera.position.z;
let zoomSpeed = 0.01 * camera.position.z / 40;

// Variables for drag-to-rotate
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Handle Mouse Wheel for Zooming
function onWheel(event) {
    targetZ += event.deltaY * zoomSpeed;
    targetZ = Math.max(130, Math.min(230, targetZ));
}

// Handle Mouse Down for Drag Start
function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
}

// Handle Mouse Move for Dragging
function onMouseMove(event) {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    // Rotate the sphere based on mouse movement
    sphereGroup.rotation.y += deltaX * 0.002;
    sphereGroup.rotation.x += deltaY * 0.002;

    previousMousePosition = { x: event.clientX, y: event.clientY };
}

// Handle Mouse Up to Stop Dragging
function onMouseUp() {
    isDragging = false;
}

// Add event listeners for mouse wheel and mouse drag
window.addEventListener('wheel', onWheel, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mouseup', onMouseUp, false);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Smoothly interpolate camera position to targetZ
    camera.position.z += (targetZ - camera.position.z) * 0.05;

    sphereGroup.rotation.y += 0.001; // Rotate sphere continuously
    renderer.render(scene, camera);
}

animate();
