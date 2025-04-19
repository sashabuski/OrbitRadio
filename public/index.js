import * as THREE from 'three';
import { countryNames } from './countries.js';

let stationsMaster = [];
let title = true;
let currentTab = "home";
const maxCameraZ = 230;
let firstsong = true;
let dragged = false;
let isRotatingToTarget = false;
let targetQuaternion = new THREE.Quaternion();
let outerposition;
let pulseVisible = false;
let currentlistitem;
let genreListActive = false;
let currentStationIndex;
const audioPlayer = new Audio();
audioPlayer.volume = 0.5;
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
let isHoveringTooltip = false; 
let favorites;
const geometry = new THREE.SphereGeometry(98, 40, 40); // radius, width segments, height segments
const wireframe = new THREE.WireframeGeometry(geometry);
let hoverCircleSize = 2;
// Create a line material for the wireframe
const material = new THREE.LineBasicMaterial({ color: 0xbbc5fc, opacity: 0.2,  // Set opacity (range: 0 to 1)
    transparent: true });



    let targetPosition;  
// Create a mesh for the wireframe lines
const line = new THREE.LineSegments(wireframe, material);
sphereGroup.add(line);
let currentStation;
let circleGeometry = new THREE.CircleGeometry(hoverCircleSize, 32);
let circleMaterial = new THREE.MeshBasicMaterial({

 
    color: 0x5967c0,  // Set color
    transparent: false,  // Make sure it's not transparent
    alphaTest: 0,  // Remove alphaTest or set to a lower value if needed
});
let hoverCircle = new THREE.Mesh(circleGeometry, circleMaterial);
hoverCircle.visible = false;
scene.add(hoverCircle);
let markerPosition;
// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));
const volumeSlider = document.getElementById("volume-slider");
let firstStation = 1;

const markerGroup = new THREE.Group();
scene.add(markerGroup);




const markerGeometry1 = new THREE.SphereGeometry(1, 16, 16); // radius, width segments, height segments
const markerWireframe1 = new THREE.WireframeGeometry(markerGeometry1);

// Create a line material for the wireframe
const markerMaterial1 = new THREE.LineBasicMaterial({ color: 0x6d78d4, opacity: 0.2,  // Set opacity (range: 0 to 1)
    transparent: true });

// Create a mesh for the wireframe lines
const marker1 = new THREE.LineSegments(markerWireframe1, markerMaterial1);
scene.add(marker1);



const markerGeometry2 = new THREE.SphereGeometry(1.5, 16, 16); // radius, width segments, height segments
const markerWireframe2 = new THREE.WireframeGeometry(markerGeometry2);

// Create a line material for the wireframe
const markerMaterial2 = new THREE.LineBasicMaterial({ color: 0x7a74d1, opacity: 0.2,  // Set opacity (range: 0 to 1)
    transparent: true });

// Create a mesh for the wireframe lines
const marker2 = new THREE.LineSegments(markerWireframe2, markerMaterial2);
scene.add(marker2);



const markerGeometry3 = new THREE.SphereGeometry(2.2, 16, 16); // radius, width segments, height segments
const markerWireframe3 = new THREE.WireframeGeometry(markerGeometry3);

// Create a line material for the wireframe
const markerMaterial3 = new THREE.LineBasicMaterial({ color: 0x8670cd, opacity: 0.2,  // Set opacity (range: 0 to 1)
    transparent: true });

// Create a mesh for the wireframe lines
const marker3 = new THREE.LineSegments(markerWireframe3, markerMaterial3);
scene.add(marker3);







  
const geometry0 = new THREE.SphereGeometry(0.1, 32, 32);
const material0 = new THREE.MeshBasicMaterial({
  color: 0x8670cd,
  wireframe: true,
  transparent: true,
  opacity: 1,
  depthWrite: false
});
const sphere0 = new THREE.Mesh(geometry0, material0);
//  sphere0.position.y = yPos;
scene.add(sphere0);





const geometry1 = new THREE.SphereGeometry(0.1, 32, 32);
const material1 = new THREE.MeshBasicMaterial({
  color: 0x6d78d4,
  wireframe: true,
  transparent: true,
  opacity: 0,
  depthWrite: false
});
const sphere1 = new THREE.Mesh(geometry1, material1);
//  sphere1.position.y = yPos;
scene.add(sphere1);
material0.opacity = 0;
material1.opacity = 0;


markerGroup.add(marker1);
markerGroup.add(marker2);
markerGroup.add(marker3);
markerGroup.add(sphere0);
markerGroup.add(sphere1);
let isDragging;

const markerGeometry4 = new THREE.SphereGeometry(3.1, 16, 16); // radius, width segments, height segments
const markerWireframe4 = new THREE.WireframeGeometry(markerGeometry4);

// Create a line material for the wireframe
const markerMaterial4 = new THREE.LineBasicMaterial({ color: 0x916cc7, opacity: 0.2,  // Set opacity (range: 0 to 1)
    transparent: true });

// Create a mesh for the wireframe lines
const marker4 = new THREE.LineSegments(markerWireframe4, markerMaterial4);
//scene.add(marker4);

markerMaterial1.opacity = 0;
markerMaterial2.opacity = 0;
markerMaterial3.opacity = 0;
markerMaterial4.opacity = 0;

const wireframeMaterialBlue = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Blue wireframe

// Define the geometry for a cube (vertices of a cube)
const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
let preMuteValue;
// Convert the cube's geometry into edges for the wireframe effect
const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);

// Create a line object from the edges geometry and apply the wireframe material
const wireframeCubeObject = new THREE.LineSegments(cubeEdges, wireframeMaterialBlue);

wireframeCubeObject.visible  = false;
scene.add(wireframeCubeObject);
// Add the wireframe cube to the scene
//sphereGroup.add(wireframeCubeObject);

const particleTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/circle.png');

const particleMaterial = new THREE.PointsMaterial({
    map: particleTexture,
    size: 0.9,
    color: 0x6D78D4,
    transparent: true,
    alphaTest: 0.5,
    
});



const text = document.getElementById("station-name");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const volumeBtn = document.getElementById("volume-btn");


playBtn.src = "audioplayericons/blank.svg";
playBtn.classList.add("disabledPlay");
particleGeometry = new THREE.BufferGeometry();
   
//console.log('particleGeometry:', particleGeometry);




 // Create the central sphere (representing the atom's nucleus)
 const nucleusGeometry = new THREE.SphereGeometry(1, 20, 20);
 const nucleusMaterial = new THREE.MeshPhongMaterial({ color: 0x4c54ac, shininess: 50 });
 const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);

 const numElectrons = 6;
        const orbitRadius = 1;
        let electronAngle = 0;
        const electronGeometry = new THREE.SphereGeometry(0.9, 10, 10);
        const redMaterial = new THREE.MeshPhongMaterial({ color: 0xbe5b8d });



        const electrons = [];
        for (let i = 0; i < numElectrons; i++) {
            const electron = new THREE.Mesh(electronGeometry, redMaterial);
            electrons.push(electron);
        }

        // Create an atom group (nucleus + electrons)
        const atomGroup = new THREE.Group();
        atomGroup.add(nucleus);
        
        electrons.forEach(electron => atomGroup.add(electron));
        scene.add(atomGroup);
        atomGroup.visible = false;

        function getMostRecentStation() {
            const HISTORY_KEY = "stationHistory";
            const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        
            return history[0] || null; // return null if there's no history
        }
      



        document.addEventListener("DOMContentLoaded", () => {

        const recentStation = getMostRecentStation();
        currentStation = recentStation;
        updatePlayer(currentStation);
toggleButtonVisibility();
        updateFavoritesList(); 
            highlightListItem();
            wrangleHeart();
        if (recentStation) {
            console.log("Most recent station:", recentStation.name);
        } else {
            console.log("No station history found.");
        }});



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

function showLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 500); // Match the CSS transition duration
  }
  

// Fetch station data
async function fetchStationsFromAPI(limit = 500000) {
    
    showLoadingOverlay();
    try {
        const response = await fetch('https://orbitradio.onrender.com/stations'); // Fetch from API
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        stationsMaster = await response.json();
        const filteredStations = stationsMaster.filter(stationsMaster => stationsMaster.state);

        stationsList.push(...filteredStations.slice(0, limit));
        addStationsAsParticles(); // Call function after fetching data
       await dataLoaded();
        console.log(`Loaded ${filteredStations.length} stations.`);
    } catch (error) {
        console.error('Error fetching stations from API:', error);
    }finally{
        hideLoadingOverlay();
    }
}

async function dataLoaded(){
    await getLocalStations();
}


let particles;
let cityParticles; // Reference to the particle system

// Add stations as particleslet particles;
let cityParticleSystems = []; // Array to hold multiple particle systems

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

    

  particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particles = new THREE.Points(particleGeometry, particleMaterial);
    sphereGroup.add(particles);
}   


function showTab(tabNumber) {
    // Hide all tab content
    
    switch (tabNumber) {
        case 1:
            currentTab = "favourites";
            break;
        case 2:
            currentTab = "search";
            break;
        case 3:
            currentTab = "home";
            break;
        case 4:
            currentTab = "tags";
            break;
        case 5:
            currentTab = "discover";
            break;
        default:
            currentTab = "unknown";
    }
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById('tab-' + tabNumber).classList.remove('hidden');

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Add active class to the clicked tab
    const selectedTab = tabs[tabNumber - 1];
    selectedTab.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll('.tab-button').forEach((button, index) => {
        button.addEventListener('click', () => showTab(index + 1));
    });
showTab(3);
});
document.addEventListener("DOMContentLoaded", () => {
    // Function to show the content of the selected tab
   

    // Dragging functionality
    const box = document.getElementById('draggable-box');
    const dragHandle = document.getElementById('drag-handle');
    let isBoxDragging = false, offsetX, offsetY;

    if (box && dragHandle) {
        dragHandle.addEventListener('mousedown', (e) => {
            isBoxDragging = true;
            offsetX = e.clientX - box.getBoundingClientRect().left;
            offsetY = e.clientY - box.getBoundingClientRect().top;
            box.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isBoxDragging) return;
            let x = e.clientX - offsetX, y = e.clientY - offsetY;
            box.style.left = `${Math.max(0, Math.min(x, window.innerWidth - box.offsetWidth))}px`;
            box.style.top = `${Math.max(0, Math.min(y, window.innerHeight - box.offsetHeight))}px`;
        });

        document.addEventListener('mouseup', () => isBoxDragging = false);
    }

    // Resizing functionality
    const resizer = document.getElementById('resizer');
    let isResizing = false, startWidth, startHeight, startX, startY;

    if (resizer) {
        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;

    // Force positioning to keep top-left fixed during resize
    const rect = box.getBoundingClientRect();
    box.style.left = `${rect.left}px`;
    box.style.top = `${rect.top}px`;
    box.style.position = 'absolute';

    startWidth = box.offsetWidth;
    startHeight = box.offsetHeight;
    startX = e.clientX;
    startY = e.clientY;
    e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            // Calculate new dimensions
            let newWidth = startWidth + e.clientX - startX;
            let newHeight = startHeight + e.clientY - startY;
          
            // Set min/max limits
            const minWidth = 247;  // Set your desired min width
            const maxWidth = 600;  // Set your desired max width
            const minHeight = 250; // Set your desired min height
            const maxHeight = 700; // Set your desired max height
          
            // Apply limits
            newWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
            newHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);
          
            // Apply new sizes
            box.style.width = `${newWidth}px`;
            box.style.height = `${newHeight}px`;
        });

        document.addEventListener('mouseup', () => isResizing = false);
    }
});














// Assume these are the global variables that hold the current stream and station info


 // Create an audio player instance





// Elements




function updatePlayer(station) {
    const box = document.querySelector('.loadFailedBox');
    box.classList.remove('show');
    box.classList.add('hide');

    sphere1.visible = false;
    sphere0.visible = false;

// 🔁 New way: Use station geo_lat and geo_long to position markers
const direction = latLonToCartesian(station.geo_lat, station.geo_long, 1).normalize();
const baseDistance = 102.05;

const basePosition = direction.clone().multiplyScalar(baseDistance);
wireframeCubeObject.position.copy(basePosition);
marker1.position.copy(basePosition);
marker2.position.copy(direction.clone().multiplyScalar(baseDistance * 1.03));
marker3.position.copy(direction.clone().multiplyScalar(baseDistance * 1.07));

targetPosition = direction.clone().multiplyScalar(baseDistance * 1.07);
outerposition = direction.clone().multiplyScalar(baseDistance * 5.07);

sphere0.position.copy(direction.clone().multiplyScalar(baseDistance * 1.145));
sphere1.position.copy(direction.clone().multiplyScalar(baseDistance * 1.145));

markerMaterial1.opacity = 0;
markerMaterial2.opacity = 0;
markerMaterial3.opacity = 0;


sphereGroup.add(wireframeCubeObject);
sphereGroup.add(atomGroup);
sphereGroup.add(marker1);
sphereGroup.add(marker2);
sphereGroup.add(marker3);
sphereGroup.add(sphere0);
sphereGroup.add(sphere1);

fadeInMarkers();
startmarkerFlashing();







    updateStationHistory(station);
    getMostRecentStations();
    // Build text content
    let textContent = station.state
        ? `${station.name} - ${station.state}, ${station.country}`
        : `${station.name} - ${station.country}`;
    
    updatePlayerText(textContent);

    // Show loading animation
    document.getElementById("loadinganimation").style.display = "block";

    // Update the audio player
    audioPlayer.src = station.url;
    audioPlayer.load();
  if(!firstsong){
    audioPlayer.play(); 
}

 

    // Wait until the audio is ready to play
    audioPlayer.oncanplay = () => {
        sphere1.visible = true;
        sphere0.visible = true;
        



        const targetDirection = latLonToCartesian(station.geo_lat, station.geo_long, 1).normalize();
        const currentRotation = new THREE.Quaternion().copy(sphereGroup.quaternion);
        targetDirection.applyQuaternion(currentRotation);

        const forward = new THREE.Vector3(0, 0, 1);
        const rotationAxis = new THREE.Vector3().crossVectors(targetDirection, forward).normalize();
        const angle = Math.acos(Math.min(Math.max(targetDirection.dot(forward), -1), 1));

        if (angle > 0.0001) {
            const rotateQuat = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle);
            targetQuaternion = sphereGroup.quaternion.clone().premultiply(rotateQuat);
            isRotatingToTarget = true;
        }







        pulseVisible = true;

        if(pulseVisible){
            // Initial animations
            expandAndFade(sphere1);
            gsap.delayedCall(1.5, () => {
            expandAndFade(sphere1);
            });
            }
        if(pulseVisible){
        
            //console.log("AREWEHEREORNOT");
      
        }

        document.getElementById("loadinganimation").style.display = "none";
        
       
        playBtn.classList.remove("disabledPlay");
        nextBtn.classList.remove("disabledPlay");
        prevBtn.classList.remove("disabledPlay");        
        playBtn.classList.remove("disabledPlay2");
        

        stopmarkerFlashing();
       // toggleMarker4Flashing();
       if(firstsong){
        playBtn.src = "audioplayericons/play.svg";
        }
        else{
            playBtn.src = "audioplayericons/pause.svg";
        }

    };

    // Optional: handle error case
    audioPlayer.onerror = () => {
        document.getElementById("loadinganimation").style.display = "none";
        const box = document.querySelector('.loadFailedBox');
    
        // Use a small delay to ensure styles are applied before transition
        setTimeout(() => {
            box.classList.remove('hide');  
          box.classList.add('show');
        }, 100);
        stopmarkerFlashing();
        playBtn.src = "audioplayericons/play.svg";
    };
}


// Play/Pause toggle  
/*function togglePlay() {
   
    console.log("dhasgdkjashd"+currentStation);
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.src = "audioplayericons/pause.svg"; // Assuming you have a pause icon
    } else {
        audioPlayer.pause();
        playBtn.src = "audioplayericons/play.svg";
    }
}*/
const loadingIcon = document.getElementById('loadinganimation');

function togglePlay() {
    
    if (audioPlayer.paused) {
       
       firstsong = false;
        loadingIcon.style.display = 'block';
        audioPlayer.play();
        //toggleMarker4Flashing();
        playBtn.src = "audioplayericons/pause.svg";
       
        audioPlayer.onplaying = () => {
            loadingIcon.style.display = 'none';
           
        };
       
        audioPlayer.onerror = () => {
            loadingIcon.style.display = 'none';
            alert('Error loading the stream.');
        };
    } else {
        audioPlayer.pause();
       // toggleMarker4Flashing();
        playBtn.src = "audioplayericons/play.svg";
    }
}


// Next Station
function nextStation() {
    playBtn.src = "audioplayericons/blank.svg";
    playBtn.classList.add("disabledPlay2");
    const next = particleIndexMap.get(currentStationIndex+1);
    updatePlayer(next);
    currentStation = next;
    updateFavoritesList(); 
    toggleButtonVisibility();
    wrangleHeart();
    
    currentStationIndex++;

}

// Previous Station
function prevStation() {
    playBtn.src = "audioplayericons/blank.svg";
    playBtn.classList.add("disabledPlay2");
    const prev = particleIndexMap.get(currentStationIndex-1);
    updatePlayer(prev);
    currentStation = prev;
    updateFavoritesList(); 
    toggleButtonVisibility();
    wrangleHeart();
    
    currentStationIndex--;



}

// Volume Control (Example of mute/unmute or volume adjustment)
function toggleVolume() {
    if (audioPlayer.muted) {
       // console.log("audioPlayer.sound: "+audioPlayer.muted);
        audioPlayer.muted = false;
       // console.log("1");
      
        volumeSlider.value = preMuteValue;
        volumeSlider.style.background = `linear-gradient(to right, rgba(164,177,255, 1) ${volumeSlider.value}%, #ccc ${volumeSlider.value}%)`;
        volumeBtn.classList.remove('muted'); 
        // Normal volume icon
    } else {

       // console.log("audioPlayer.sound: "+audioPlayer.muted);
        audioPlayer.muted = true;
        
        preMuteValue = volumeSlider.value;
      // console.log("2"); 
       volumeSlider.value = 0;
        volumeSlider.style.background = `linear-gradient(to right, rgba(164,177,255, 1) ${volumeSlider.value}%, #ccc ${volumeSlider.value}%)`;
        volumeBtn.classList.add('muted');
    }
}

// Initialize the first station


// Add event listeners to buttons
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextStation);
prevBtn.addEventListener("click", prevStation);
volumeBtn.addEventListener("click", toggleVolume);




//HISTORY
function updateStationHistory(newStation) {
    if (!newStation || !newStation.name) return;

    const HISTORY_KEY = "stationHistory";

    // Get existing history or initialize
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

    // Remove if station already exists (prevent duplicates)
    history = history.filter(station => station.name !== newStation.name);

    // Add new station to the start of the list (most recent first)
    history.unshift(newStation);

    // Limit history to 10 entries
    if (history.length > 10) {
        history = history.slice(0, 10);
    }

    // Save back to localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}



function getMostRecentStations(count = 5) {
    const history = JSON.parse(localStorage.getItem("stationHistory")) || [];
    const recentStations = history.slice(0, count); 
    const tab3List = document.querySelector('#tab-3 .recentlyplayedlist');
    tab3List.innerHTML = '';

    recentStations.forEach(station => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-item");
    

        listItem.addEventListener("click", () => {
            playBtn.src = "audioplayericons/blank.svg";
            updatePlayer(station);
            currentStation = station;
            if(currentlistitem){
            currentlistitem.style.backgroundColor = "";
            currentlistitem.style.color = "";
            }
            toggleButtonVisibility();
            //revealHeart(listItem);
            listItem.style.backgroundColor = "#6D78D4";
            listItem.style.color = "#d896ed";
            currentlistitem = listItem;
            const removeButton = listItem.querySelector('.remove-btn');
           
           
           
            updateFavoritesList(); 
            highlightListItem();
            wrangleHeart();
        });
        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("border-container");
    
        const textWrapper = document.createElement("div");
    
        const stationName = document.createTextNode(station.name);
        textWrapper.appendChild(stationName);
    
        const locationText = document.createElement("h2");
        locationText.classList.add("locationtext");
        if(station.state){
            locationText.textContent = `${station.state}, ${station.country}`;
           }else{
            locationText.textContent = `${station.country}`;
           }
        textWrapper.appendChild(locationText);
    
        contentWrapper.appendChild(textWrapper);
        listItem.appendChild(contentWrapper);
       
        if(currentStation){
            if(currentStation.changeuuid == station.changeuuid){
                listItem.style.backgroundColor = "#6D78D4";
                listItem.style.color = "#d896ed";
            }
        }
       

        tab3List.appendChild(listItem);
    });
    // Most recent stations are at the start
}

getMostRecentStations();












// Raycasting for click detection
function onClick(event) {
    
    if (dragged) return;
    
    pulseVisible = false;
    material0.opacity = 0;
    material1.opacity = 0;

    console.log("onClick");

    const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
    if (!(hoveredElement instanceof HTMLCanvasElement)) {
        return;
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    let closestPoint = null;
    let closestDistance = Infinity;

    raycaster.setFromCamera(mouse, camera);

    const allParticles = [particles, ...cityParticleSystems];

    for (let system of allParticles) {
        const intersects = raycaster.intersectObject(system);

        if (intersects.length > 0) {
            const index = intersects[0].index;
            const station = particleIndexMap.get(index);
            currentStationIndex = index;

            if (!isDragging) {
                

                if (station) {
                    console.log('Clicked Station:', station);
                    firstsong = false;
                    const material = station.material;
                    if (material instanceof THREE.PointsMaterial) {
                        material.size *= 1.2;
                    }

                    if (station.url) {
                        playBtn.src = "audioplayericons/blank.svg";
                        playBtn.classList.add("disabledPlay2");
                        updatePlayer(station);
                        currentStation = station;
                        updateStationHistory(currentStation);
                        getMostRecentStations();
                        toggleButtonVisibility();
                        updateFavoritesList();
                        wrangleHeart();

                        
                    }
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

let previousMousePosition = { x: 0, y: 0 };

function onWheel(event) {
    if (event.target.tagName == "CANVAS"){
        targetZ += event.deltaY * zoomSpeed;
        targetZ = Math.max(105, Math.min(230, targetZ));
        updateDynamicScale();
    }
  
}

let boxclick = false;

function onMouseDown(event) {
    isDragging = true;

    dragged = false;
   // console.log("mousedown:" + isDragging);
    const canvas = renderer.domElement;
    
    // Check if the clicked element is NOT the box or the drag handle
    if (event.target === canvas) {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
    
    // Check if the clicked element is the floating-box div
    const floatingBox = document.querySelector('.floating-box');
  
    // console.log("floating-box "+JSON.stringify(floatingBox));
   // console.log("Event target:", event.target);  // Logs the entire DOM element
//console.log("Event target class:", event.target.className);  // Logs the class of the element
//console.log("Event target id:", event.target.id);  // Logs the id if available
//console.log("Event target tagName:", event.target.tagName);

    
    if (event.target.tagName != "CANVAS") {
        boxclick = true;
       // console.log("floating-box "+floatingBox);
    } else {
        boxclick = false;
    }
}



function onMouseMove(event) {
    if (!isDragging) return;
    if (isDragging && !boxclick){

        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
        hoverCircle.visible = false;
        isRotatingToTarget = false;
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    const distanceScale = (camera.position.z - 130) / (230 - 130); // Normalized from 0 to 1
    const rotationSpeed = 0.002 * (0.3 + 0.7 * distanceScale);
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        dragged = true; // Mark as dragged if moved enough
    }
    sphereGroup.rotation.y += deltaX * rotationSpeed;
    sphereGroup.rotation.x += deltaY * rotationSpeed;

    previousMousePosition = { x: event.clientX, y: event.clientY };
}
}

function onMouseMoveRaycast(event) {
    
    const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
    if (!(hoveredElement instanceof HTMLCanvasElement)) {
      //  console.log('Not hovering over the canvas!');
        // Do something when NOT hovering over canvas
      } else {
       // console.log('Hovering over the canvas!');
        // Do something when hovering
    
   
   
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    const button = document.getElementById("tooltip-btn");
    const tooltip = document.getElementById("tooltip");
    const nameText = document.getElementById("track-name");
    raycaster.setFromCamera(mouse, camera);
    let closestDistance = Infinity;
    let closestPoint = null;
   
    
    // Check all particle systems (particles and cityParticleSystems)
    const allParticles = [particles, ...cityParticleSystems]; // does this  Combine single and city particle systems
    if(!isDragging){
    for (let system of allParticles) {

        if (system && system.geometry && system.geometry.attributes.position) {
            const intersects = raycaster.intersectObject(system);
            

       if (intersects.length > 0) {
            const index = intersects[0].index; // Get the index of the clicked particle
            const station = particleIndexMap.get(index);
            if (station) {
                nameText.style.animation = 'none';

// Force reflow/repaint (this ensures the change is applied)
nameText.offsetHeight;  // Trigger a reflow (read a property)

nameText.style.animationDelay = '2s';
nameText.style.animation = 'scrollText 15s linear infinite';


                if(station.state){
                    nameText.textContent = station.name+" - "+station.state+", "+station.country;
                }else{
                    nameText.textContent = station.name+" - "+station.country;
                
                }

                
                   // console.log('asdasdasda:');
            } 
        }
        } else {
            //console.log('Skipping invalid system:', system);
        }



        let positions;
       
       if(system){
        if (system.geometry.attributes.position.array) {
            positions = system.geometry.attributes.position.array;
        } 
    }else {
           // console.log('No positions found for particle system');
            continue;
        }

        let particleWorldPosition = new THREE.Vector3();

        for (let i = 0; i < positions.length; i += 3) {
            particleWorldPosition.set(positions[i], positions[i + 1], positions[i + 2]);
            particleWorldPosition.applyMatrix4(system.matrixWorld); // Convert to world coordinates

            let distance = raycaster.ray.distanceSqToPoint(particleWorldPosition); // Squared distance check

            const distanceScale = (camera.position.z - 130) / (230 - 130); // 0 to 1
            const hoverThreshold = 1 * (0.2 + 0.7 * distanceScale); // Smaller when zoomed in
            
            if (distance < hoverThreshold) {
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestPoint = particleWorldPosition.clone();
                }
            }
        }
    }

    if (closestPoint) {
        markerPosition= closestPoint;
        
        document.body.style.cursor = 'pointer';
       
        hoverCircle.position.copy(closestPoint);
        hoverCircle.position.z;
        hoverCircle.visible = true;
        const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let offsetX = -326;  // Default horizontal offset
    let offsetY = -55; // Default vertical offset

    // Check which half of the screen the cursor is on
    if (event.clientX > screenWidth / 2) {
        // Right half of the screen
        offsetX = 10; // Adjust horizontal offset for the right side
        offsetY = -55; // Optionally adjust vertical offset for the right side
    } else {
        // Left half of the screen
        offsetX = -306; // Default or change it to your preference for the left side
        offsetY = -55; // Optionally adjust for the left side
    }
  
        tooltip.style.left = `${event.pageX + offsetX}px`;
        tooltip.style.top = `${event.pageY + offsetY}px`;
        tooltip.style.visibility = "visible";
        startScrolling2();
        tooltip.style.opacity = "1";
    } else {


        document.body.style.cursor = 'default';
        if(event.target.tagName != "INPUT")
        {
        //document.body.style.cursor = 'default';
        } 
        hoverCircle.visible = false;
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    }


    tooltip.addEventListener("mouseenter", () => {
       // console.log("jhiji");
        isHoveringTooltip = true;
      });
  
      tooltip.addEventListener("mouseleave", () => {
        isHoveringTooltip = false;
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
      });

    }
}
}

  

function onMouseUp() {
    console.log("isDragging: "+isDragging);
    isDragging = false;
    console.log("isDragging: "+isDragging);
    
}


window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Optionally adjust pixel ratio again
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('wheel', onWheel, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousemove', onMouseMoveRaycast, false);
window.addEventListener('mouseup', onMouseUp, false);

// Animation Loop


function updateDynamicScale() {
    const scaleFactor = camera.position.z / maxCameraZ;

    // Animate with GSAP to new scale
    gsap.to(marker1.scale, { x: scaleFactor, y: scaleFactor, z: scaleFactor, duration: 0.3 });
    gsap.to(marker2.scale, { x: scaleFactor, y: scaleFactor, z: scaleFactor, duration: 0.3 });
    gsap.to(marker3.scale, { x: scaleFactor, y: scaleFactor, z: scaleFactor, duration: 0.3 });
   // gsap.to(sphere0.scale, { x: scaleFactor, y: scaleFactor, z: scaleFactor, duration: 0.3 });
   // gsap.to(sphere1.scale, { x: scaleFactor, y: scaleFactor, z: scaleFactor, duration: 0.3 });
}


function animate() {
    requestAnimationFrame(animate);
    camera.position.z += (targetZ - camera.position.z) * 0.1;
   
    const minScale = 0.1;  // How small it gets at closest zoom
const maxScale = 1.0;  // Full size at max zoom (230)
const zoomRange = maxCameraZ - 105; // your min zoom is 105

const normalizedZoom = (camera.position.z - 105) / zoomRange; // 0 (close) to 1 (far)
const scaleFactor = minScale + (maxScale - minScale) * normalizedZoom;

markerGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

//console.log("previuos:" + previousscrollposition);
//console.log(contentDiv.scrollTop);
   // console.log(sphere0.visible);
   
   if (!hoverCircle.visible && !isRotatingToTarget) {
    const distanceScale = (camera.position.z - 130) / (230 - 130); // Normalized 0 to 1
    const autoRotateSpeed = 0.001 * (0.1 + 0.7 * distanceScale);   // Slower when zoomed in
    sphereGroup.rotation.y += autoRotateSpeed;
}

if (isRotatingToTarget) {
    sphereGroup.quaternion.slerp(targetQuaternion, 0.08); // Smooth interpolation
    const angleToTarget = sphereGroup.quaternion.angleTo(targetQuaternion);
    if (angleToTarget < 0.001) {
        sphereGroup.quaternion.copy(targetQuaternion);
        isRotatingToTarget = false;
    }
}

   const minSize = 0.2;
   const maxSize = 0.8;

   // Get the camera's Z position (assuming movement along the Z-axis)
  
   const angleIncrement = (2 * Math.PI) / numElectrons;

   electrons.forEach((electron, i) => {
       let electronX, electronY, electronZ;

       // Modifying electron orbits
       if (i % 3 === 0) {
           electronX = orbitRadius * Math.cos(electronAngle + i * angleIncrement);
           electronY = orbitRadius * Math.sin(electronAngle + i * angleIncrement);
           electronZ = 0;
       } else if (i % 4 === 0) {
           electronX = 0;
           electronY = orbitRadius * Math.sin(electronAngle + i * angleIncrement);
           electronZ = orbitRadius * Math.cos(electronAngle + i * angleIncrement);
       } else {
           electronX = orbitRadius * Math.sin(electronAngle + i * angleIncrement);
           electronY = 0;
           electronZ = orbitRadius * Math.cos(electronAngle + i * angleIncrement);
       }

       electron.position.set(electronX, electronY, electronZ);
       electron.rotation.y = electronAngle + i * angleIncrement;
    });


    electronAngle += 0.1;

    // Move the entire atom group (nucleus + electrons) along the X-axis
  

   // Normalize the camera position to a 0-1 range
   let t = (camera.position.z - 110) / (230 - 130);

   // Interpolate size between minSize and maxSize
   particleMaterial.size = minSize + t * (maxSize - minSize);


   const minSizeHover = 0.2;
   const maxSizeHover = 2;

   // Get the camera's Z position (assuming movement along the Z-axis)
  

  
   
   // Normalize the camera position to a 0-1 range


   // Interpolate size between minSize and maxSize
   let newCircleSize = minSizeHover + t * (maxSizeHover - minSizeHover);
   hoverCircle.geometry.dispose();
   hoverCircle.geometry = new THREE.CircleGeometry(newCircleSize, 32);
    renderer.render(scene, camera);
}




let loopTimeout;



function startScrolling2() {
    const textElement = document.getElementById("track-name");
    const container = document.getElementById("name-text");

    const textWidth = textElement.offsetWidth; 
    const containerWidth = container.offsetWidth;

    // Clear any existing timeout to prevent looping when it shouldn't
    clearTimeout(loopTimeout);

    if (textWidth <= containerWidth) {
        // If text fits, center it, remove animation & padding
        container.style.justifyContent = "center";
        textElement.style.animation = "none";
        textElement.style.transform = "translateX(0%)";
        textElement.style.paddingLeft = "0px"; // Remove padding
        return;
    }

    // If text is too long, remove centering, enable scrolling & add padding
    container.style.justifyContent = "flex-start";
    textElement.style.paddingLeft = "5px"; // Add padding

    const distance = textWidth + containerWidth; 
    const speed = 50; // Pixels per second
    const duration = distance / speed; 

    // Clear any existing animation
    textElement.style.animation = "none";
    textElement.offsetHeight; // Force reflow (triggers reapplication of animation)
    
    // First animation (with 2s delay)
    textElement.style.animation = `firstScroll ${duration}s linear forwards`;
    textElement.style.animationDelay = "2s";

    loopTimeout = setTimeout(() => {
        // Start the loop animation only after the first scroll completes
        textElement.style.animation = `loopScroll ${duration}s linear infinite`;
    }, (duration + 2) * 1000); // First animation time + 2s delay
}

function updateTooltipText(newText) {
    const textElement = document.getElementById("track-name");
    textElement.innerText = newText; // Update the text

    // Restart the animation after text update
    startScrolling2();
}
window.onload = startScrolling2;
window.onresize = startScrolling2;





function startScrolling1() {
    const textElement = document.getElementById("station-name");
    const container = document.getElementById("audio-text");

    const textWidth = textElement.offsetWidth; 
    const containerWidth = container.offsetWidth;

    // Clear any existing timeout to prevent looping when it shouldn't
    clearTimeout(loopTimeout);

    if (textWidth <= containerWidth) {
        // If text fits, center it, remove animation & padding
        container.style.justifyContent = "center";
        textElement.style.animation = "none";
        textElement.style.transform = "translateX(0%)";
        textElement.style.paddingLeft = "0px"; // Remove padding
        return;
    }

    // If text is too long, remove centering, enable scrolling & add padding
    container.style.justifyContent = "flex-start";
    textElement.style.paddingLeft = "20px"; // Add padding

    const distance = textWidth + containerWidth; 
    const speed = 50; // Pixels per second
    const duration = distance / speed; 

    // Clear any existing animation
    textElement.style.animation = "none";
    textElement.offsetHeight; // Force reflow (triggers reapplication of animation)
    
    // First animation (with 2s delay)
    textElement.style.animation = `firstScroll ${duration}s linear forwards`;
    textElement.style.animationDelay = "2s";

    loopTimeout = setTimeout(() => {
        // Start the loop animation only after the first scroll completes
        textElement.style.animation = `loopScroll ${duration}s linear infinite`;
    }, (duration + 2) * 1000); // First animation time + 2s delay
}

function updatePlayerText(newText) {
    const textElement = document.getElementById("station-name");
    textElement.innerText = newText; // Update the text

    // Restart the animation after text update
    startScrolling1();
}

window.onload = startScrolling1;
window.onresize = startScrolling1;



/**
 * HOMEPAGE
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */async function getLocalStations() {
    const stationList = document.querySelector('#tab-3 .list');
    let localSearchResults;
    const localloadingspinner = document.getElementById("local-loading-spinner");
    localloadingspinner.style.display = "block";

    try {
        const locationResponse = await fetch('https://ipinfo.io?token=103b79e365df36');
        const locationData = await locationResponse.json();
        const countrycode = locationData.country;
     //   document.getElementById('country').textContent = countrycode;

        localSearchResults = stationsMaster
            .filter(station =>
                station.url &&
                station.countrycode === countrycode
            )
            .filter((station, index, self) =>
                index === self.findIndex(s => s.name === station.name)
            );

        if (localSearchResults.length === 0) {
            const li = document.createElement('li');
            li.textContent = "No stations found for this genre.";
            stationList.appendChild(li);
        } else {
            loadLocalStations(localSearchResults);
        }

    } catch (error) {
        console.error("Error fetching genre stations:", error);
       // document.getElementById('country').textContent = 'Could not determine your country.';
    } finally {
        localloadingspinner.style.display = "none";
    }
}


function loadLocalStations(localSearchResults) {
    const tab3List = document.querySelector('#tab-3 .list');
    tab3List.innerHTML = ''; // Clear previous results
    const localloadingspinner = document.getElementById("local-loading-spinner");
    // Shuffle the array and take 10 random stations
    const shuffled = localSearchResults.sort(() => 0.5 - Math.random());
    const selectedStations = shuffled.slice(0, 10);

    selectedStations.forEach(station => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-item");
    
      
      
        listItem.addEventListener("click", () => {
            playBtn.src = "audioplayericons/blank.svg";
            updatePlayer(station);
            currentStation = station;
            
            firstsong = false;
            if(currentlistitem){
            currentlistitem.style.backgroundColor = "";
            currentlistitem.style.color = "";
            }
            toggleButtonVisibility();
            updateFavoritesList(); 
            listItem.style.backgroundColor = "#6D78D4";
            listItem.style.color = "#d896ed";
            currentlistitem = listItem;
            highlightListItem();
            wrangleHeart();
           // revealHeart(listItem);
        });
        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("border-container");
    
        const textWrapper = document.createElement("div");
    
        const stationName = document.createTextNode(station.name);
        textWrapper.appendChild(stationName);
    
        const locationText = document.createElement("h2");
        locationText.classList.add("locationtext");
        if(station.state){
            locationText.textContent = `${station.state}, ${station.country}`;
           }else{
            locationText.textContent = `${station.country}`;
           }
        textWrapper.appendChild(locationText);
    
        contentWrapper.appendChild(textWrapper);
        listItem.appendChild(contentWrapper);


        if(currentStation){
            if(currentStation.changeuuid == station.changeuuid){
                listItem.style.backgroundColor = "#6D78D4";
                listItem.style.color = "#d896ed";
            }
        }
        tab3List.appendChild(listItem);
    });

    localloadingspinner.style.display = "none";

  
    
}



getLocalStations();






function revealHeart(listItem){
    console.log("Jeessica");
    const removeButton = listItem.querySelector('.remove-btn');
    
    //removeButton.display.height = 50;
    removeButton.classList.add("revealHeart");
   
    console.log(removeButton);
    console.log(removeButton.classList);
}
/*FAVOURITES 
*
*
*
*
*
*/
function updateFavoritesList() {
    favorites = getFavoriteStations(); // Retrieve favorite stations from localStorage or cookies
    const favoritesList = document.querySelector("#tab-1 .list");

    favoritesList.innerHTML = ''; // Clear the existing list before updating

    favorites.forEach(station => {
        if (station && station.name && station.state && station.country) {
            const listItem = document.createElement("li");
            listItem.classList.add("list-item");

            listItem.addEventListener("click", () => {
                if (currentlistitem) {
                    currentlistitem.style.backgroundColor = "";
                    currentlistitem.style.color = "";
                }

                playBtn.src = "audioplayericons/blank.svg";
                updatePlayer(station);
                currentStation = station;
                updateFavoritesList();

                highlightListItem();
                toggleButtonVisibility();
                wrangleHeart();
                firstsong = false;
            });

            // Wrapper for styling
            const contentWrapper = document.createElement("div");
            contentWrapper.classList.add("border-container");

            const textWrapper = document.createElement("div");
            const stationName = document.createTextNode(station.name);
            textWrapper.appendChild(stationName);

            const locationText = document.createElement("h2");
            locationText.classList.add("locationtext");
            locationText.textContent = station.state
                ? `${station.state}, ${station.country}`
                : station.country;

            textWrapper.appendChild(locationText);

            // Remove ("X") button with heart SVG
            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-btn");
            removeButton.addEventListener("click", (event) => {
                event.stopPropagation(); // Don't trigger list-item click
                removeFavorite(station);
            });

            const svgNS = "http://www.w3.org/2000/svg";
            const heartSvg = document.createElementNS(svgNS, "svg");
            heartSvg.setAttribute("class", "heart-svg2");
            heartSvg.setAttribute("viewBox", "0 0 24 24");
            heartSvg.setAttribute("width", "18");
            heartSvg.setAttribute("height", "18");

            const heartPath = document.createElementNS(svgNS, "path");
            heartPath.setAttribute("d", "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 \
            2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 \
            16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 \
            11.54L12 21.35z");
           // heartPath.setAttribute("fill", "rgba(109, 120, 212, 0.95)"); // ✅ Fixed missing )

            heartSvg.appendChild(heartPath);
            removeButton.appendChild(heartSvg);

            contentWrapper.appendChild(textWrapper);
            contentWrapper.appendChild(removeButton);
            listItem.appendChild(contentWrapper);
            favoritesList.appendChild(listItem);

            // ✅ Apply current station styles *after* insertion
            if (currentStation && station.name === currentStation.name) {
                // Force reflow to allow transition to work
                void removeButton.offsetWidth;

                removeButton.style.opacity = 1;
                removeButton.style.pointerEvents = "all";

                listItem.style.backgroundColor = "#6D78D4";
                listItem.style.color = "#d896ed";
            }
        }
    });
}



// Function to remove a favorite station
function removeFavorite(stationToRemove) {
    if (!stationToRemove || !stationToRemove.name) {
        console.error("Invalid station data:", stationToRemove); // Debug log if station data is invalid
        return; // Exit early if the station data is invalid
    }

    let favorites = getFavoriteStations(); // Get current favorites
    
    //console.log("Current favorites:", favorites);
    favorites = favorites.filter(station => station.name !== stationToRemove.name); // Remove the station
   // console.log("future Current favorites:", favorites);
    saveFavoriteStations(favorites);  // Save updated favorites back to storage (cookie/localStorage)
    updateFavoritesList(); 
    wrangleHeart(); // Re-render the updated list
}

// Save updated favorites to localStorage (or use cookies)
function saveFavoriteStations(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));  // Save to localStorage
}

// Retrieve favorite stations from localStorage (or cookies)
function getFavoriteStations() {
    let favoriteStations = localStorage.getItem("favorites");
    return favoriteStations ? JSON.parse(favoriteStations) : [];
}

// Function to save favorite stations to localStorage

// Function to handle heart button click
function handleHeartClick(event) {
    updateFavoritesList();


    let isFavorite; // Flag to track if currentStation is in favorites

    for (let i = 0; i < favorites.length; i++) {
       // console.log("da324234s");
      
        if (favorites[i].name === currentStation.name) {
           
           // console.log(i+"fav: " + JSON.stringify(favorites[i]));
          //  console.log(i+"current: " + JSON.stringify(currentStation));
           
            isFavorite = true;
            break; // Exit loop early once we find a match
        }
    }
    
    
  

    favorites = getFavoriteStations();

    // Check if the station is already in the favorites
    if (!isFavorite) {
        favorites.push(currentStation);  // Add station to favorites
        saveFavoriteStations(favorites);  // Save updated favorites
       // console.log(`${currentStation} added to favorites`);
        updateFavoritesList();
       let heartButton = event.target.parentElement.parentElement;
      // console.log("okwhat is this"+event.target.parentElement.parentElement)
        updateHeartButton(heartButton, true); // Change heart to red
    } else {
        removeFavorite(currentStation);
        //console.log("wokywokoakwokw");
        updateHeartButton(heartButton, false); 
        

    }
}


function highlightListItem() {
    const searchList = document.querySelectorAll("#tab-2 .list li");
    const recentList = document.querySelectorAll('#tab-3 .recentlyplayedlist li');
    const localList = document.querySelectorAll('#tab-3 .list li');
    const genreList = document.querySelectorAll('#genreStationList li');

    const allListItems = [...searchList, ...recentList, ...localList, ...genreList];

    allListItems.forEach(listItem => {
        // Get the inner div (the one that has the station name text + h2)
        const containerDiv = listItem.querySelector(".border-container > div");

        // Clone the node to remove the h2 from the copy
        const cloned = containerDiv.cloneNode(true);
        const h2 = cloned.querySelector("h2");
        if (h2) cloned.removeChild(h2);

        const stationName = cloned.textContent.trim();

        if (stationName === currentStation.name.trim()) {
            listItem.style.backgroundColor = "#6D78D4";
            listItem.style.color = "#d896ed";
        } else {
            if (listItem.style.backgroundColor === "rgb(109, 120, 212)" &&
                listItem.style.color === "rgb(216, 150, 237)") {
                listItem.style.backgroundColor = "";
                listItem.style.color = "";
            }
        }
    });
}



function wrangleHeart() {
    let button = document.getElementById("favorite-btn");

    // Log the objects using JSON.stringify() to see their content
    //console.log("fav: " + JSON.stringify(favorites));
    //console.log("current: " + JSON.stringify(currentStation));

    let isFavorite; // Flag to track if currentStation is in favorites

for (let i = 0; i < favorites.length; i++) {
   // console.log("da324234s");
  
    if (favorites[i].name === currentStation.name) {
       
       // console.log(i+"fav: " + JSON.stringify(favorites[i]));
      //  console.log(i+"current: " + JSON.stringify(currentStation));
      // //
        isFavorite = true;
        break; // Exit loop early once we find a match
    }
}

    if (isFavorite) {
        if (!button.classList.contains('filled')) {
            button.classList.toggle('filled');
            
        }
//
       // console.log("das");
    } else {
        if (button.classList.contains('filled')) {
            button.classList.toggle('filled');
            
           // console.log("here");
        }
       // console.log("dasasda");
    }
}



function updateHeartButton(button, isFavorite) {
    if (isFavorite) {
        button.classList.add('favorite');
        if (!button.classList.contains('filled')) {
           
           
            button.classList.toggle('filled');
            button.classList.add('filled');
           
           // console.log("here1");
        }
        
    } else {
        button.classList.remove('favorite');
        if (button.classList.contains('filled')) {
            button.classList.toggle('filled');
            //console.log("here2");
        }
    }
}

// Add event listeners to all heart buttons
document.querySelectorAll(".heart-btn").forEach(button => {
    button.addEventListener("click", handleHeartClick);
   // button.addEventListener("click", fillHeart);
});



//function fillHeart(event) {
  //  event.currentTarget.classList.toggle('filled');
//}

// Display favorites when the page loads
window.onload = function() {
    updateFavoritesList();  // Update the list
    // Update heart buttons for existing favorites
    document.querySelectorAll(".heart-btn").forEach(button => {
        const station = button.getAttribute("data-station");
        let favorites = getFavoriteStations();
        if (favorites.includes(station)) {
            updateHeartButton(button, true);  // Mark as favorite
        }
    });
}
//console.log("ahahhahaHAAHAH current station "+currentStation);
// or someVar = 'test'; to check when it's not undefined

// Function to toggle visibility based on the variable's state
function toggleButtonVisibility() {
    const button = document.getElementById("favorite-btn");

    // Check if the variable is undefined
    if (typeof currentStation === 'undefined') {
        button.disabled = true;
        button.classList.add('disabled'); // Fades out
    } else {
        button.disabled = false; 
        button.classList.remove('disabled'); // Fades in
    }
}

// Call the function to update button visibility




volumeSlider.addEventListener("input", () => {
    audioPlayer.volume = volumeSlider.value / 100;
    if (volumeSlider.value == 0){
       // console.log("3");
       
        volumeBtn.classList.add('muted');
    }else{
        audioPlayer.muted = false;
        preMuteValue =  audioPlayer.volume;
        //console.log("4");
        volumeBtn.classList.remove('muted');
    }
});
//clearAllCookies();

function fadeInMarkers() {
    const markers = [markerMaterial1, markerMaterial2, markerMaterial3, markerMaterial4];
    let delay = 0;

    markers.forEach((material, index) => {
        setTimeout(() => {
            let opacity = 0;
            const fadeSpeed = 0.02;
            function animateFadeIn() {
                opacity += fadeSpeed;
                if (opacity >= 0.5) {
                    opacity = 0.5;
                }
                material.opacity = opacity;
                if (opacity < 0.5) {
                    requestAnimationFrame(animateFadeIn);
                }
            }
            animateFadeIn();
        }, delay);
        delay += 70; // Increase delay for each marker (500ms delay between markers)
    });
}


let markerFlashing = false;
        let flashTimeout = null;
        const markers = [marker1, marker2, marker3, marker4];
const materials = [markerMaterial1, markerMaterial2, markerMaterial3, markerMaterial4];

function flash(index = 0) {
    if (!markerFlashing) return;

    gsap.to(materials[index], {
        opacity: 0.3,
        duration: 0.08,
        yoyo: true,
        repeat: 1
    });

    gsap.to(markers[index].scale, {
        x: 1.3,
        y: 1.3,
        z: 1.3,
        duration: 0.08,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
        onComplete: () => {
            const nextIndex = (index + 1) % markers.length;
            flashTimeout = setTimeout(() => flash(nextIndex), 30);
        }
    });
}

        function startmarkerFlashing() {
            markerFlashing = true;
            flash(); // begin the loop
        }

        function stopmarkerFlashing() {
            markerFlashing = false;
            clearTimeout(flashTimeout);
            // Reset all opacities to 1 instantly
            materials.forEach(mat => {
                gsap.killTweensOf(mat); // stop any active tweens
                mat.opacity = 0.6;
            });
        }




       
        // Marker 4 flash toggle logic
        let marker4Flashing = false;
        let marker4Timeout = null;

        function flashMarker4Loop() {
            if (!marker4Flashing) return;

            gsap.to(markerMaterial4, {
                opacity: 0.9,
                duration: 0.4,
                yoyo: true,
                ease: "power1.inOut",
                repeat: 1
            });

            gsap.to(marker4.scale, {
                x: 1.05,
                y: 1.05,
                z: 1.05,
                duration: 0.4,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
                onComplete: () => {
                    marker4Timeout = setTimeout(flashMarker4Loop, 400);
                }
            });


            const color = new THREE.Color(markerMaterial4.color.getHex());
            gsap.to(color, {
                r: 1,  
                g: 0.404, 
                b:  0.769,
                duration: 0.4,
                yoyo: true,
                repeat: 1,
                onUpdate: () => {
                    markerMaterial4.color.set(color); // Apply updated color
                },
                onComplete: () => {
                    if (marker4Flashing) {
                        marker4Timeout = setTimeout(flashMarker4Loop, 400); // Restart flash cycle
                    }
                }
            });
        }
        function toggleMarker4Flashing() {
            marker4Flashing = !marker4Flashing;

           

            if (marker4Flashing) {
                flashMarker4Loop();
            } else {
                clearTimeout(marker4Timeout);
                marker4.scale.set(1, 1, 1);
                markerMaterial4.opacity = 1;
                markerMaterial4.color.set(0x916cc7);
            }
        }


/**
 * SEARCH
 * 
 * 
 * 
 * 
 */

/** 
async function countTags() {
    try {
        // Fetch the list of stations from the server
        const response = await fetch("http://localhost:3000/stations");
        const stations = await response.json();

        // Filter stations that have a URL
        const stationsWithUrl = stations.filter(station => station.url);

        // Create an object to store tag counts and an array to preserve order of appearance
        const tagCounts = {};

        // Loop through each station with a URL and process its tags
        stationsWithUrl.forEach(station => {
            const tags = station.tags ? station.tags.split(",") : []; // Split tags by commas

            tags.forEach(tag => {
                // Clean up spaces and count the tags
                tag = tag.trim();
                if (tag) {
                    if (!tagCounts[tag]) {
                        tagCounts[tag] = 1;
                    } else {
                        tagCounts[tag]++;
                    }
                }
            });
        });

        // Convert the tagCounts object to an array of [tag, count] pairs
        const tagArray = Object.entries(tagCounts);

        // Sort the tags by count (most frequent first)
        tagArray.sort((a, b) => b[1] - a[1]);

        // Display the results in the console
        console.log(`${stationsWithUrl.length} stations searched`);
        tagArray.forEach(([tag, count]) => {
            console.log(`${tag}: ${count}`);
        });
    } catch (error) {
        console.error("Error fetching stations:", error);
    }
}

// Call the function when the page loads
countTags();

*/
function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }
  


let searchResults = [];
let renderedCount = 0;
const RESULTS_PER_BATCH = 20;

document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("search-box");
    if (searchBox) {
        searchBox.addEventListener("keyup", debounce(filterList, 250));
    }
});

const loadingSpinner = document.getElementById("loading-spinner");
const nothingFound = document.getElementById("nothingFound"); // moved out for reuse

async function filterList() {
    const query = document.getElementById("search-box").value.trim().toLowerCase();
    nothingFound.style.display = "none";

    if (!query) {
        // Search is empty
        searchResults = [];
        renderedCount = 0;
        updateSearchResults([]);
        loadingSpinner.style.display = "none";
        return;
    }

    loadingSpinner.style.display = "block";

    // Split query into individual words for AND-matching
    const words = query.split(/\s+/);

    // Filter using stationsMaster
    let filtered = stationsMaster.filter(station => {
        if (!station.url) return false;

        const haystack = `${station.name} ${station.state || ""} ${station.country || ""}`.toLowerCase();
        return words.every(word => haystack.includes(word));
    });

    // Remove duplicates by name
    searchResults = filtered.filter((station, index, self) =>
        index === self.findIndex(s => s.name === station.name)
    );

    if (searchResults.length === 0) {
        nothingFound.style.display = "flex";
        loadingSpinner.style.display = "none";
        updateSearchResults([]);
        return;
    }

    console.log("Filtered results:", searchResults);
    renderedCount = 0;
    updateSearchResults([]);
    loadMoreResults();

    loadingSpinner.style.display = "none";
}






function loadMoreResults() {
    const nextBatch = searchResults.slice(renderedCount, renderedCount + RESULTS_PER_BATCH);
    updateSearchResults(nextBatch, true);
    renderedCount += nextBatch.length;
}

function updateSearchResults(results, append = false) {
    console.log("updating search results");
    const searchList = document.querySelector("#tab-2 .list");

    if (!append) searchList.innerHTML = ''; // Only clear if not appending

    results.forEach(station => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-item");

        listItem.addEventListener("click", () => {
            playBtn.src = "audioplayericons/blank.svg";
            updatePlayer(station);
            currentStation = station;
            if(currentlistitem){
            currentlistitem.style.backgroundColor = "";
            currentlistitem.style.color = "";
            }
            toggleButtonVisibility();
            updateFavoritesList(); 
            listItem.style.backgroundColor = "#6D78D4";
            listItem.style.color = "#d896ed";
            currentlistitem = listItem;
            highlightListItem();
            wrangleHeart();
            //revealHeart(listItem);
            firstsong = false;
        });

        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("border-container");

        const textWrapper = document.createElement("div");

        const stationName = document.createTextNode(station.name);
        textWrapper.appendChild(stationName);

        const locationText = document.createElement("h2");
        locationText.classList.add("locationtext");
        if(station.state){
            locationText.textContent = `${station.state}, ${station.country}`;
           }else{
            locationText.textContent = `${station.country}`;
           }
        textWrapper.appendChild(locationText);

        contentWrapper.appendChild(textWrapper);
        listItem.appendChild(contentWrapper);
        
        if(currentStation){
         
            if(currentStation.changeuuid == station.changeuuid){
              // console.log("HERE1");
                listItem.style.backgroundColor = "#6D78D4";
                listItem.style.color = "#d896ed";
            }
        }
        searchList.appendChild(listItem);
    });
}



document.addEventListener('DOMContentLoaded', () => {
    const backbutton = document.getElementById('backbutton');
    backbutton.addEventListener('click', () => {
        console.log("onclick added?");
        genreBack();
    });
});



function genreBack() {
    const container = document.getElementById('genre-container');
    const backbutton = document.getElementById('backbutton');
    const content = document.querySelector(".content");
   

    backbutton.style.opacity = "0";
    backbutton.style.pointerEvents = "none";
      
      // Optionally remove it completely after fade
      setTimeout(() => {
        backbutton.style.display = "none";
      }, 300);
    container.style.transform = 'translateX(0%)';
    
    // Clear list if needed (e.g., clearing the list inside the container)
    const stationList = document.getElementById('genreStationList');
    stationList.innerHTML = '';  // Clears the list content
    firstStation = 1;
    genreListActive = false;
    content.scrollTop = 0;
}


const contentDiv = document.querySelector(".content");

contentDiv.addEventListener("scroll", () => {
    if (contentDiv.scrollTop + contentDiv.clientHeight >= contentDiv.scrollHeight - 5) {
       
       if(currentTab == "search"){
            loadMoreResults();
       }
       if(currentTab == "discover"){
       
        loadCountrySearchResults(title);
   }
        
    }
});
const loadingSpinner2 = document.getElementById("loading-spinner2");

const tags = [
    "Pop", "News", "Rock", "Classical", "Dance", "Oldies", "80'S", "Jazz", 
    "Electronic", "Country", "House", "Alternative", "Metal", "Gospel", "Soul", 
    "Indie", "Chillout", "Techno", "Sports", "Rap ambient", "Blues", "Disco", 
    "Funk", "Hiphop", "Reggae", "Breakcore"
];

const tagsListContainer = document.getElementById('genreList');

// Function to toggle menu and sublist display
let genreSearchResults = [];
let genreRenderedCount = 0;
const GENRE_RESULTS_PER_BATCH = 20;



async function showGenreStationList(selectedTag) {
    const container = document.getElementById('genre-container');
    const stationList = document.getElementById('genreStationList');
    const backbutton = document.getElementById('backbutton');
    const backbuttontext = document.getElementById('backbuttontext');
    const content = document.querySelector(".content");
    backbutton.style.display = "block";
    stationList.innerHTML = '';
    backbuttontext.textContent = selectedTag;
    container.style.transform = 'translateX(-50%)';
     
     
     setTimeout(() => {
        requestAnimationFrame(() => {
            backbutton.style.opacity = "1";
            backbutton.style.pointerEvents = "all";
          });
         }, 100);
         
     
     setTimeout(() => {
       // loadingSpinner2.style.display = "block";
    }, 300);
   // console.log("1");
    genreRenderedCount = 0;
    content.scrollTop = 0;
    genreListActive = true;

    try {
      //  const response = await fetch("http://localhost:3000/stations");
       // const stations = await response.json();
       // console.log("v2"+stations[2]);
        
        genreSearchResults = stationsMaster
    .filter(station =>
        station.url &&
        typeof station.tags === 'string' &&
        station.tags
            .split(',')
            .map(tag => tag.trim().toLowerCase())
            .includes(selectedTag.toLowerCase())
    )
    .filter((station, index, self) =>
        index === self.findIndex(s => s.name === station.name)
    );

       
    loadMoreGenreStations();
        

    } catch (error) {
        console.error("Error fetching genre stations:", error);
    } finally {
        loadingSpinner2.style.display = "none";
    }
}



function loadMoreGenreStations() {
    const stationList = document.getElementById('genreStationList');
    const nextBatch = genreSearchResults.slice(genreRenderedCount, genreRenderedCount + GENRE_RESULTS_PER_BATCH);
    //console.log("3");
   

    nextBatch.forEach(station => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-item");

        listItem.addEventListener("click", () => {
            playBtn.src = "audioplayericons/blank.svg";
            updatePlayer(station);
            currentStation = station;
            if(currentlistitem){
            currentlistitem.style.backgroundColor = "";
            currentlistitem.style.color = "";
            }
            toggleButtonVisibility();
            updateFavoritesList(); 
            listItem.style.backgroundColor = "#6D78D4";
            listItem.style.color = "#d896ed";
            currentlistitem = listItem;
            highlightListItem();
            wrangleHeart();
           // revealHeart(listItem);
            firstsong = false;
        });
       // console.log("4");
        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("border-container");

        const textWrapper = document.createElement("div");

        const stationName = document.createTextNode(station.name);
        textWrapper.appendChild(stationName);

        const locationText = document.createElement("h2");
        locationText.classList.add("locationtext");
       if(station.state){
        locationText.textContent = `${station.state}, ${station.country}`;
       }else{
        locationText.textContent = `${station.country}`;
       }
       
       
        textWrapper.appendChild(locationText);

if(firstStation == 1){
    listItem.classList.add("toplistmargin");
    firstStation = 0;
}

        contentWrapper.appendChild(textWrapper);
        listItem.appendChild(contentWrapper);


        if(currentStation){
            if(currentStation.changeuuid == station.changeuuid){
                listItem.style.backgroundColor = "#6D78D4";
                listItem.style.color = "#d896ed";
            }
        }
        stationList.appendChild(listItem);
    });
    document.getElementById("loading-spinner2").style.display = "none";
    document.getElementById("loading-spinner2").style.pointerEvents = "none"
    genreRenderedCount += nextBatch.length;
}


const genreContentDiv = document.querySelector(".content");

genreContentDiv.addEventListener("scroll", () => {
    if(currentTab == "tags"){
    if(genreListActive){
    if (
        genreContentDiv.scrollTop + genreContentDiv.clientHeight >= 
        genreContentDiv.scrollHeight - 5
    ) {
        
        loadMoreGenreStations();
    }
}
    }
});
// Function to generate the list items dynamically
function generateTagList() {
    tags.forEach(tag => {
        // Create list item
        const listItem = document.createElement('li');
        listItem.classList.add('list-item', 'genre');
        
        listItem.textContent = tag;

        // Create arrow using local SVG file
        const arrowSpan = document.createElement('span');
        arrowSpan.classList.add('arrow');
      
        const arrowImg = document.createElement('img');
        arrowImg.src = 'sidearrow.svg'; // adjust the path as needed
        arrowImg.alt = 'arrow';
        arrowImg.width = 16; // or whatever size fits
        arrowImg.height = 16;

        arrowSpan.appendChild(arrowImg);
        listItem.appendChild(arrowSpan);
        listItem.addEventListener('click', () => {
            showGenreStationList(tag);
        });
        // Add click event
       

        // Append to list
        tagsListContainer.appendChild(listItem);
    });
}


document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('countriesbutton').addEventListener('click', () => {
        title = false;
        document.getElementById("countrybackbuttontext").textContent = "Discover"
        const stationList = document.getElementById('panel2list');
        stationList.innerHTML = '';  // Clears the list content
        
        openCountryList();
     });

});

function openCountryList(){
    const countrybackbutton = document.getElementById("countrybackbutton");
    const countrybackbuttontext = document.getElementById("countrybackbuttontext");
   const container = document.getElementById("countriesContainer");
   
  
   setTimeout(() => {
    document.getElementById("country3list").style.display = "none";
  }, 300);

   
   container.style.transform = "translateX(-33.33%)"
   generateCountryList();
  // countrybackbuttontext.textContent = country;
   //content.scrollTop = 0;
   countrybackbutton.style.display = "block"; // or "block" depending on layout

   // Allow a slight delay if needed to ensure layout updates
   setTimeout(() => {
 requestAnimationFrame(() => {
     countrybackbutton.style.opacity = "1";
     countrybackbutton.style.pointerEvents = "all";
   });
  }, 100);
  
}

const countryListContainer = document.getElementById('panel2list');




/* 
function generateCountryList() {
    const sortedNames = countryNames.sort();

    sortedNames.forEach(country => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-item', 'genre');

        const capitalisedCountry = formatCountryName(country);

        // Create a wrapper for the left text (country name)
        const textSpan = document.createElement('span');
        textSpan.textContent = capitalisedCountry;
        listItem.appendChild(textSpan);

        // Calculate number of stations for this country
        const stationCount = stationsMaster.filter(station =>
            station.country.toLowerCase() === country.toLowerCase()
        ).length;

        // Create blue circle with number
        const circle = document.createElement('span');
        circle.classList.add('blue-circle');
        circle.textContent = stationCount;
        listItem.appendChild(circle);

        // Create arrow icon
        const arrowSpan = document.createElement('span');
        arrowSpan.classList.add('arrow');

        const arrowImg = document.createElement('img');
        arrowImg.src = 'sidearrow.svg';
        arrowImg.alt = 'arrow';
        arrowImg.width = 16;
        arrowImg.height = 16;

        arrowSpan.appendChild(arrowImg);
        listItem.appendChild(arrowSpan);

        // Click event
        listItem.addEventListener('click', () => {
            fetchStationsByCountry(country, false);
        });

        countryListContainer.appendChild(listItem);
    });
}

*/

function generateCountryList() {
    const sortedCountries = countryNames.sort((a, b) => 
        a.name.localeCompare(b.name)
    );

    sortedCountries.forEach(({ name, count }) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-item', 'countryspacing');

        const capitalisedCountry = formatCountryName(name);

        // Left side: Country name
        const textSpan = document.createElement('span');
        textSpan.textContent = capitalisedCountry;
        listItem.appendChild(textSpan);

        // Right side (circle and arrow)
        const rightSide = document.createElement('span');
        rightSide.classList.add('right-side');

        const circle = document.createElement('span');
        circle.classList.add('blue-circle');
        circle.textContent = count;
        rightSide.appendChild(circle);

        const arrowSpan = document.createElement('span');
        arrowSpan.classList.add('arrow');

        const arrowImg = document.createElement('img');
        arrowImg.src = 'sidearrow.svg';
        arrowImg.alt = 'arrow';
        arrowImg.width = 16;
        arrowImg.height = 16;

        arrowSpan.appendChild(arrowImg);
        rightSide.appendChild(arrowSpan);

        listItem.appendChild(rightSide);

        // Click event for fetching country stations
        listItem.addEventListener('click', () => {
            fetchStationsByCountry(name, false);
        });

        // Append to container
        countryListContainer.appendChild(listItem);
    });
}

let countrySearchResults = [];
let countryRenderedCount = 0;
const COUNTRY_RESULTS_PER_BATCH = 20;

let previousscrollposition; 

async function fetchStationsByCountry(country, title) {
   
    const countrybackbutton = document.getElementById("countrybackbutton");
    const countrybackbuttontext = document.getElementById("countrybackbuttontext");
    const container = document.getElementById("countriesContainer");
   
    const content = document.getElementById("content");
    
   // document.getElementById("country1list").style.display = "none";
    //document.getElementById("country2list").style.display = "none";
    



   if(!title){
   
    previousscrollposition = content.scrollTop;
    container.style.transform = "translateX(-66.66%)"
    setTimeout(() => {
        document.getElementById("panel2list").innerHTML = "";
       
        content.scrollTop = 0;
      }, 300);
    backhome = false;
   }else{

   
    container.style.transform = "translateX(-33.33%)" 
    setTimeout(() => {
        document.getElementById("country3list").style.display = "none";
        content.scrollTop = 0;
      }, 300);
   }
   
   
   
   countryRenderedCount = 0;
   countrybackbuttontext.textContent = formatCountryName(country);
   //content.scrollTop = 0;
   countrybackbutton.style.display = "block";
   setTimeout(() => {
    requestAnimationFrame(() => {
        countrybackbutton.style.opacity = "1";
        countrybackbutton.style.pointerEvents = "all";
      });
     }, 100);

   
   
   //countryListActive = true;
   
    try {
     
       // const response = await fetch("http://localhost:3000/stations");
      //  const stations = await response.json();
        console.log("0"+country);
        countrySearchResults = stationsMaster
            .filter(station =>
                station.url &&          
                station.country.toLowerCase().trim() === country.toLowerCase().trim()
            )
            .filter((station, index, self) =>
                index === self.findIndex(s => s.name === station.name)
            );
          //  console.log("1"+stations[0].country);


            if (countrySearchResults.length === 0) {
                console.log("nothing found");
            } else {
                loadCountrySearchResults(title);
                 // Load initial batch
            }
        
    } catch (error) {
        console.error("Error fetching stations:", error);
        return [];
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const countrybackbutton = document.getElementById('countrybackbutton');
    countrybackbutton.addEventListener('click', () => {
        console.log("onclick added?");
        countryBack();
    });
});



function scrollToCountry(countryName) {
    const container = document.querySelector('.content');
    const listItems = container.querySelectorAll('#panel2list .list-item');

    for (const item of listItems) {
        const text = item.querySelector('span')?.textContent?.trim().toLowerCase();
        if (text === countryName.toLowerCase()) {
            item.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            });
            break;
        }
    }
}




let backhome = true;

function countryBack() {
    const container = document.getElementById('countriesContainer');
    const countrybackbutton = document.getElementById('countrybackbutton');
    const backbuttontext = document.getElementById('countrybackbuttontext');
    const content = document.querySelector(".content");
  
   if(backhome){
    //document.getElementById("country1list").style.display = "block";
//document.getElementById("country2list").style.display = "block";
document.getElementById("country3list").style.display = "block";
    container.style.transform = 'translateX(0%)'; 
    content.scrollTop = 0;
    setTimeout(() => {
        document.getElementById("panel2list").innerHTML = "";
       
      }, 300);
     
     
      countrybackbutton.style.opacity = "0";
      countrybackbutton.style.pointerEvents = "none";
      
      // Optionally remove it completely after fade
      setTimeout(() => {
        countrybackbutton.style.display = "none";
      }, 300);
    countrySearchResults = [];
   }
   else{
    openCountryList();
       
    container.style.transform = 'translateX(-33.33%)';
   // content.scrollTop = 0;
    
        document.getElementById("panel3list").innerHTML = "";
      
      

     
   
        content.scrollTop = previousscrollposition;
     
    countrySearchResults = [];
   
    countrySearchResults
    backbuttontext.textContent = "Discover"
    backhome = true;
   
   }
   // backbutton.style.transform = 'translateX(0%)';
    // Clear list if needed (e.g., clearing the list inside the container)
   
   
   

}


function loadCountrySearchResults(title){
    
 
  
        const panel2list = document.getElementById('panel2list');
 
        const panel3list = document.getElementById('panel3list');
        console.log("2");
   
   
    const nextBatch = countrySearchResults.slice(countryRenderedCount, countryRenderedCount + COUNTRY_RESULTS_PER_BATCH);
   console.log(nextBatch);
   

    nextBatch.forEach(station => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-item");

        listItem.addEventListener("click", () => {
            playBtn.src = "audioplayericons/blank.svg";
            updatePlayer(station);
            currentStation = station;
            if(currentlistitem){
            currentlistitem.style.backgroundColor = "";
            currentlistitem.style.color = "";
            }
            toggleButtonVisibility();
            updateFavoritesList(); 
            listItem.style.backgroundColor = "#6D78D4";
            listItem.style.color = "#d896ed";
            currentlistitem = listItem;
            highlightListItem();
            wrangleHeart();
           // revealHeart(listItem);
            firstsong = false;
        });

        console.log("3");
       // console.log("4");
        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("border-container");

        const textWrapper = document.createElement("div");

        const stationName = document.createTextNode(station.name);
        textWrapper.appendChild(stationName);

        const locationText = document.createElement("h2");
        locationText.classList.add("locationtext");
       if(station.state){
        locationText.textContent = `${station.state}, ${station.country}`;
       }else{
        locationText.textContent = `${station.country}`;
       }
       
       
        textWrapper.appendChild(locationText);

if(firstStation == 1){
    listItem.classList.add("toplistmargin");
    firstStation = 0;
}

        contentWrapper.appendChild(textWrapper);
        listItem.appendChild(contentWrapper);


        if(currentStation){
            if(currentStation.changeuuid == station.changeuuid){
                listItem.style.backgroundColor = "#6D78D4";
                listItem.style.color = "#d896ed";
            }
        }
       
        if(title){
            panel2list.appendChild(listItem);
       }else{
            panel3list.appendChild(listItem);
       }
        
    });

    countryRenderedCount += nextBatch.length;
}



// Create two spheres



// Animation function using GSAP
function expandAndFade(sphere) {
// Reset scale and opacity
gsap.set(sphere.scale, { x: 0.1, y: 0.1, z: 0.1 });
sphere.material.opacity = 1;

// Animate scale and opacity
gsap.to(sphere.scale, {
  x: 50,
  y: 50,
  z: 50,
  duration: 3,
  ease: "circ.out"
});

gsap.to(sphere.material, {
  opacity:0,
  duration: 2.8,
  ease: "circ.out"
});
}

// Optional: Looping logic (if you want repeating pulse)
function loopPulse(sphere0, delay = 0) {


gsap.delayedCall(delay, () => {
  expandAndFade(sphere0);
  loopPulse(sphere0, 3); // Recursively pulse every 3 seconds
});

}



document.addEventListener("DOMContentLoaded", () => {
    loopPulse(sphere0, 0);
    loopPulse(sphere1, 1.5);
    sphere0.visible = false;
    sphere1.visible = false;
});

function formatCountryName(country) {
    const exceptions = ['of', 'and'];
    return country
        .toLowerCase()
        .split(' ')
        .map((word, index) => {
            if (exceptions.includes(word) && index !== 0) {
                return word;
            } else {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
        })
        .join(' ');
}

async function getCountryStations(country, header, list){ {
   
    



   // const localloadingspinner = document.getElementById("local-loading-spinner");
    //localloadingspinner.style.display = "block";
    header.textContent = formatCountryName(country);

    try {
      //  const response = await fetch("http://localhost:3000/stations");
      //  const stations = await response.json();

        const countrySearchResults = stationsMaster
            .filter(station =>
                station.url &&
                station.country.toLowerCase() === country.toLowerCase()
            )
            .filter((station, index, self) =>
                index === self.findIndex(s => s.name === station.name)
            );

        if (countrySearchResults.length === 0) {
            const li = document.createElement('li');
            li.textContent = "No stations found for this country.";
            list.appendChild(li);
        } else {
            loadCountryStations(countrySearchResults, list);
        }

    } catch (error) {
        console.error("Error fetching local stations:", error);
        const li = document.createElement('li');
        li.textContent = "An error occurred while fetching stations.";
        list.appendChild(li);
    } finally {
       // localloadingspinner.style.display = "none";
    }
}


}






function loadCountryStations(countrySearchResults, list) {
    
    list.innerHTML = ''; // Clear previous results
   // const localloadingspinner = document.getElementById("local-loading-spinner");
    // Shuffle the array and take 10 random stations
    const shuffled = countrySearchResults.sort(() => 0.5 - Math.random());
    const selectedStations = shuffled.slice(0, 5);

    selectedStations.forEach(station => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-item");
    
      
      
        listItem.addEventListener("click", () => {
            playBtn.src = "audioplayericons/blank.svg";
            updatePlayer(station);
            currentStation = station;
            
            firstsong = false;
            if(currentlistitem){
            currentlistitem.style.backgroundColor = "";
            currentlistitem.style.color = "";
            }
            toggleButtonVisibility();
            updateFavoritesList(); 
            listItem.style.backgroundColor = "#6D78D4";
            listItem.style.color = "#d896ed";
            currentlistitem = listItem;
            highlightListItem();
            wrangleHeart();
           // revealHeart(listItem);
        });
        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("border-container");
    
        const textWrapper = document.createElement("div");
    
        const stationName = document.createTextNode(station.name);
        textWrapper.appendChild(stationName);
    
        const locationText = document.createElement("h2");
        locationText.classList.add("locationtext");
        if(station.state){
            locationText.textContent = `${station.state}, ${station.country}`;
           }else{
            locationText.textContent = `${station.country}`;
           }
        textWrapper.appendChild(locationText);
    
        contentWrapper.appendChild(textWrapper);
        listItem.appendChild(contentWrapper);


        if(currentStation){
            if(currentStation.changeuuid == station.changeuuid){
                listItem.style.backgroundColor = "#6D78D4";
                listItem.style.color = "#d896ed";
            }
        }
        list.appendChild(listItem);
    });

   // localloadingspinner.style.display = "none";

  
    
}












async function getThreeRandomCountries() {
    const shuffled = [...countryNames].sort(() => 0.5 - Math.random());
    const [{ name: name1 }, { name: name2 }, { name: name3 }] = shuffled;

    const header1 = document.getElementById('country1header');
    const list1 = document.getElementById('country1list');

    const header2 = document.getElementById('country2header');
    const list2 = document.getElementById('country2list');

    const header3 = document.getElementById('country3header');
    const list3 = document.getElementById('country3list');

    getCountryStations(name1, header1, list1);
    getCountryStations(name2, header2, list2);
    getCountryStations(name3, header3, list3);
}

  

  
  document.addEventListener("DOMContentLoaded", async () => {
    await fetchStationsFromAPI(); // Wait until stationsMaster is filled
    getThreeRandomCountries();    // Now safe to run this

    const countryDivs = document.querySelectorAll('.spider');
    countryDivs.forEach(div => {
        div.addEventListener('click', function () {
            title = true;
            const stationList = document.getElementById('panel2list');
            stationList.innerHTML = '';
            const countryName = this.textContent;
            fetchStationsByCountry(countryName, true);
        });
    });
});


// Generate the list on page load
generateTagList();
toggleButtonVisibility();
fetchStationsFromAPI(500000);
animate();
