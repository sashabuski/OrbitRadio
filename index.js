import * as THREE from 'three';

const stationsList = [];
const particleIndexMap = new Map(); // Stores index-to-station mapping
let particleGeometry;
// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x000000, 1);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
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

let circleGeometry = new THREE.CircleGeometry(2, 32);
let circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
let hoverCircle = new THREE.Mesh(circleGeometry, circleMaterial);
hoverCircle.visible = false;
scene.add(hoverCircle);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));




particleGeometry = new THREE.BufferGeometry();
   
console.log('particleGeometry:', particleGeometry);



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

  particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particles = new THREE.Points(particleGeometry, particleMaterial);
    sphereGroup.add(particles);
}                         

// Raycasting for click detection


function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(particles);

    if (intersects.length > 0) {
        console.log("daskjdha");
        const index = intersects[0].index; // Get the index of the clicked particle
        const station = particleIndexMap.get(index);
        if (station) {
            console.log('Clicked Station:', station);

            const material = station.material;
            console.log(material);

            if (material instanceof THREE.PointsMaterial) {
                console.log('Size before:', material.size);

                // Increase the size by 20%
                material.size *= 1.2;
    
                // Log the size after changing it
                console.log('Size after:', material.size);
            }
        }
    }
}

       

      camera.position.z = 15;

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
function onMouseMoveRaycast(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    raycaster.setFromCamera(mouse, camera);
    let positions;
  
    if (particleGeometry.attributes.position.array) {
        positions = particleGeometry.attributes.position.array;
    } else {
        console.log('particleGeometry.attributes.position.array is undefined');
    }
   
    let closestDistance = Infinity;
    let closestPoint = null;
    
    let particleWorldPosition = new THREE.Vector3();
  
    for (let i = 0; i < positions.length; i += 3) {
        particleWorldPosition.set(positions[i], positions[i + 1], positions[i + 2]);
        particleWorldPosition.applyMatrix4(particles.matrixWorld); // Convert to world coordinates
  
        let distance = raycaster.ray.distanceSqToPoint(particleWorldPosition); // Squared distance check
  
        if (distance < 0.5) { // Threshold for detecting a "hit"
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPoint = particleWorldPosition.clone();
            }
        }
    }
  
    if (closestPoint) {
        hoverCircle.position.copy(closestPoint);
        hoverCircle.visible = true;
    } else {
        hoverCircle.visible = false;
    }
}

  

function onMouseUp() {
    isDragging = false;
}

window.addEventListener('wheel', onWheel, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousemove', onMouseMoveRaycast, false);
window.addEventListener('mouseup', onMouseUp, false);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    camera.position.z += (targetZ - camera.position.z) * 0.05;
   
   if(hoverCircle.visible == false){
    sphereGroup.rotation.y += 0.001;
   }
    renderer.render(scene, camera);
}

fetchStationsFromLocal(500000);
animate();
