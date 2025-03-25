import * as THREE from 'three';

const stationsList = [];
const singleStationsList = [];
const particleIndexMap = new Map();
const cityParticleIndexMap = new Map();  // Stores index-to-station mapping
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
scene.background = new THREE.Color(0xE9E9E9);
// Load Earth texture
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('map2.jpg');


const geometry = new THREE.SphereGeometry(100, 40, 40); // radius, width segments, height segments
const wireframe = new THREE.WireframeGeometry(geometry);

// Create a line material for the wireframe
const material = new THREE.LineBasicMaterial({ color: 0xbbc5fc, opacity: 0.2,  // Set opacity (range: 0 to 1)
    transparent: true });

// Create a mesh for the wireframe lines
const line = new THREE.LineSegments(wireframe, material);
sphereGroup.add(line);

let circleGeometry = new THREE.CircleGeometry(2, 32);
let circleMaterial = new THREE.MeshBasicMaterial({
    color: 0x5967c0,  // Set color
    transparent: false,  // Make sure it's not transparent
    alphaTest: 0,  // Remove alphaTest or set to a lower value if needed
});
let hoverCircle = new THREE.Mesh(circleGeometry, circleMaterial);
hoverCircle.visible = false;
scene.add(hoverCircle);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));




particleGeometry = new THREE.BufferGeometry();
   
//console.log('particleGeometry:', particleGeometry);



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

let particles;
let cityParticles; // Reference to the particle system

// Add stations as particleslet particles;
let cityParticleSystems = []; // Array to hold multiple particle systems

// Add stations as particles
function addStationsAsParticles() {
    if (stationsList.length === 0) return;

    const clusters = [];
    const visited = new Set();
    const singleStationsList = [];

    // Function to calculate distance between two lat/lon points (Haversine formula)
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in km
        const dLat = THREE.MathUtils.degToRad(lat2 - lat1);
        const dLon = THREE.MathUtils.degToRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(THREE.MathUtils.degToRad(lat1)) * Math.cos(THREE.MathUtils.degToRad(lat2)) *
                  Math.sin(dLon / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(a)); // Distance in km
    }

    // Group nearby stations
    for (let i = 0; i < stationsList.length; i++) {
        if (visited.has(i)) continue;
        let cluster = [stationsList[i]];
        visited.add(i);

        for (let j = 0; j < stationsList.length; j++) {
            if (i !== j && !visited.has(j)) {
                const d = getDistance(stationsList[i].geo_lat, stationsList[i].geo_long, 
                                      stationsList[j].geo_lat, stationsList[j].geo_long);
                if (d < 30) { // 50km radius
                    cluster.push(stationsList[j]);
                    visited.add(j);
                }
            }
        }
       
        if (cluster.length > 1) {
             console.log(cluster.length);
            
            clusters.push(cluster);
        } else {
            singleStationsList.push(cluster[0]);
        }
    }

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/circle.png');

    // Small station particles
    const singlePositions = new Float32Array(singleStationsList.length * 3);
    const singleParticleGeometry = new THREE.BufferGeometry();

    for (let i = 0; i < singleStationsList.length; i++) {
        const { geo_lat, geo_long } = singleStationsList[i];
        const position = latLonToCartesian(geo_lat, geo_long, 100.1);

        singlePositions[i * 3] = position.x;
        singlePositions[i * 3 + 1] = position.y;
        singlePositions[i * 3 + 2] = position.z;

        particleIndexMap.set(i, singleStationsList[i]); // Store index-to-station mapping
    }

    singleParticleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(singlePositions, 3));

    const smallParticleMaterial = new THREE.PointsMaterial({
        map: particleTexture,
        size: 0.9,
        transparent: true,
        alphaTest: 0.5,
        color: new THREE.Color(0x5967c0), // Color for particles
    emissive: new THREE.Color(0x5967c0), // Ensure particles glow with the same color
    blending: THREE.MultiplyBlending,
    });

    particles = new THREE.Points(singleParticleGeometry, smallParticleMaterial);
    sphereGroup.add(particles);

    // Create city particle systems based on cluster size
    const clusterGroups = new Map();
    const minSize = 1;
    const maxSize = 3;
    const maxStations = 100;
    for (let cluster of clusters) {
       
        const sizeCategory = minSize + (Math.min(cluster.length, maxStations) / maxStations) * (maxSize - minSize);
       
        if (!clusterGroups.has(sizeCategory)) {
            clusterGroups.set(sizeCategory, []);
        }
        clusterGroups.get(sizeCategory).push(cluster[0]); // Use first station in cluster
    }

    for (let [sizeCategory, clusterPoints] of clusterGroups) {
        const cityPositions = new Float32Array(clusterPoints.length * 3);
        const cityParticleGeometry = new THREE.BufferGeometry();

        for (let i = 0; i < clusterPoints.length; i++) {
            const { geo_lat, geo_long } = clusterPoints[i];
            const cityPosition = latLonToCartesian(geo_lat, geo_long, 100.1);

            cityPositions[i * 3] = cityPosition.x;
            cityPositions[i * 3 + 1] = cityPosition.y;
            cityPositions[i * 3 + 2] = cityPosition.z;

            particleIndexMap.set(i, clusterPoints[i]); // Store index-to-cluster mapping
        }

        cityParticleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(cityPositions, 3));

        const cityParticleMaterial = new THREE.PointsMaterial({
            map: particleTexture,
            size: sizeCategory , // Scale size dynamically
            transparent: true,
            alphaTest: 0.5,
            color: new THREE.Color(0x5967c0), // Color for particles
    emissive: new THREE.Color(0x5967c0), // Ensure particles glow with the same color
    blending: THREE.MultiplyBlending,
        });

        const cityParticleSystem = new THREE.Points(cityParticleGeometry, cityParticleMaterial);
        cityParticleSystems.push(cityParticleSystem);
        sphereGroup.add(cityParticleSystem);
    }
}

// Raycasting for click detection

function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check all particle systems (particles and cityParticleSystems)
    const allParticles = [particles, ...cityParticleSystems]; // Combine single and city particle systems

    for (let system of allParticles) {
        const intersects = raycaster.intersectObject(system);

        if (intersects.length > 0) {
            const index = intersects[0].index; // Get the index of the clicked particle
            const station = particleIndexMap.get(index);
            if (station) {
                console.log('Clicked Station:', station);
                const material = station.material;

                if (material instanceof THREE.PointsMaterial) {
                    console.log('Size before:', material.size);
                    material.size *= 1.2; // Increase size to indicate selection
                    console.log('Size after:', material.size);
                }

                // Load the audio stream from the station URL
                if (station.url) {
                    const audioPlayer = document.getElementById("audioPlayer");
                    const streamSource = document.getElementById("streamSource");
                    const text = document.getElementById("track-name");
                    text.textContent = station.name;
                    streamSource.src = station.url;  // Set the station URL as the source
                    audioPlayer.load();             // Load the new stream URL
                    audioPlayer.play();             // Optionally, start playing automatically
                    console.log('Now playing stream from:', station.url);
                }
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
}function onMouseMoveRaycast(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let closestDistance = Infinity;
    let closestPoint = null;

    // Check all particle systems (particles and cityParticleSystems)
    const allParticles = [particles, ...cityParticleSystems]; // Combine single and city particle systems

    for (let system of allParticles) {
        let positions;
        if (system.geometry.attributes.position.array) {
            positions = system.geometry.attributes.position.array;
        } else {
            console.log('No positions found for particle system');
            continue;
        }

        let particleWorldPosition = new THREE.Vector3();

        for (let i = 0; i < positions.length; i += 3) {
            particleWorldPosition.set(positions[i], positions[i + 1], positions[i + 2]);
            particleWorldPosition.applyMatrix4(system.matrixWorld); // Convert to world coordinates

            let distance = raycaster.ray.distanceSqToPoint(particleWorldPosition); // Squared distance check

            if (distance < 0.5) { // Threshold for detecting a "hit"
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestPoint = particleWorldPosition.clone();
                }
            }
        }
    }

    if (closestPoint) {
        hoverCircle.position.copy(closestPoint);
        hoverCircle.position.z +=1;
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
