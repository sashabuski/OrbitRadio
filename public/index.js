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
const cityParticleIndexMap = new Map();
let particleGeometry;

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

const textureLoader = new THREE.TextureLoader();

let favorites;
const geometry = new THREE.SphereGeometry(98, 40, 40); 
const wireframe = new THREE.WireframeGeometry(geometry);
let hoverCircleSize = 2;

const material = new THREE.LineBasicMaterial({ color: 0xbbc5fc, opacity: 0.2,  
    transparent: true });
let isHoveringTooltip = false; 

let targetPosition;
const line = new THREE.LineSegments(wireframe, material);
sphereGroup.add(line);
let currentStation;
let circleGeometry = new THREE.CircleGeometry(hoverCircleSize, 32);
let circleMaterial = new THREE.MeshBasicMaterial({

 
    color: 0x5967c0, 
    transparent: false,  
    alphaTest: 0, 
});
let hoverCircle = new THREE.Mesh(circleGeometry, circleMaterial);
hoverCircle.visible = false;
scene.add(hoverCircle);
let markerPosition;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));
const volumeSlider = document.getElementById("volume-slider");
let firstStation = 1;

const markerGroup = new THREE.Group();
scene.add(markerGroup);
const uprightFix = new THREE.Euler(
 0,   
   1,  
    0 
);

sphereGroup.quaternion.setFromEuler(uprightFix);

const markerGeometry1 = new THREE.SphereGeometry(1, 16, 16); 
const markerWireframe1 = new THREE.WireframeGeometry(markerGeometry1);


const markerMaterial1 = new THREE.LineBasicMaterial({ color: 0x6d78d4, opacity: 0.2, 
    transparent: true });


const marker1 = new THREE.LineSegments(markerWireframe1, markerMaterial1);
scene.add(marker1);



const markerGeometry2 = new THREE.SphereGeometry(1.5, 16, 16); 
const markerWireframe2 = new THREE.WireframeGeometry(markerGeometry2);


const markerMaterial2 = new THREE.LineBasicMaterial({ color: 0x7a74d1, opacity: 0.2, 
    transparent: true });


const marker2 = new THREE.LineSegments(markerWireframe2, markerMaterial2);
scene.add(marker2);



const markerGeometry3 = new THREE.SphereGeometry(2.2, 16, 16); 
const markerWireframe3 = new THREE.WireframeGeometry(markerGeometry3);


const markerMaterial3 = new THREE.LineBasicMaterial({ color: 0x8670cd, opacity: 0.2, 
    transparent: true });

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

scene.add(sphere1);
material0.opacity = 0;
material1.opacity = 0;


markerGroup.add(marker1);
markerGroup.add(marker2);
markerGroup.add(marker3);
markerGroup.add(sphere0);
markerGroup.add(sphere1);
let isDragging;

const markerGeometry4 = new THREE.SphereGeometry(3.1, 16, 16); 
const markerWireframe4 = new THREE.WireframeGeometry(markerGeometry4);


const markerMaterial4 = new THREE.LineBasicMaterial({ color: 0x916cc7, opacity: 0.2,  // Set opacity (range: 0 to 1)
    transparent: true });

const marker4 = new THREE.LineSegments(markerWireframe4, markerMaterial4);


markerMaterial1.opacity = 0;
markerMaterial2.opacity = 0;
markerMaterial3.opacity = 0;
markerMaterial4.opacity = 0;

const wireframeMaterialBlue = new THREE.LineBasicMaterial({ color: 0x0000ff }); 


const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
let preMuteValue;

const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);


const wireframeCubeObject = new THREE.LineSegments(cubeEdges, wireframeMaterialBlue);

wireframeCubeObject.visible  = false;
scene.add(wireframeCubeObject);

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

        const atomGroup = new THREE.Group();
        atomGroup.add(nucleus);
        
        electrons.forEach(electron => atomGroup.add(electron));
        scene.add(atomGroup);
        atomGroup.visible = false;

        function getMostRecentStation() {
            const HISTORY_KEY = "stationHistory";
            const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        
            return history[0] || null;
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
    }, 500); 
  }
  
  async function fetchStationsFromAPI(limit = 500000) {
    showLoadingOverlay();

    try {
        const batchSize = 7000;
        const totalBatches = 2;
        stationsMaster = [];

        for (let i = 0; i < totalBatches; i++) {
            const start = i * batchSize;
            const response = await fetch(`https://orbitradio.onrender.com/stations?start=${start}&limit=${batchSize}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const batch = await response.json();
            stationsMaster.push(...batch);
        }

        // Optional: Filter only stations with a state
        const filteredStations = stationsMaster.filter(station => station.state);

        // Apply your frontend limit
        stationsList.push(...filteredStations.slice(0, limit));
        addStationsAsParticles();
        await dataLoaded();

        console.log(`Loaded ${filteredStations.length} stations.`);
    } catch (error) {
        console.error('Error fetching stations from API:', error);
    } finally {
        hideLoadingOverlay();
    }
}


async function dataLoaded(){
    await getLocalStations();
}


let particles;
let cityParticles; 

let cityParticleSystems = []; 

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
      
        particleIndexMap.set(i, stationsList[i]); 
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
        button.addEventListener('click', () => {
            showTab(index + 1);
            document.getElementById("content").scrollTop = 0;
        });
    });

    showTab(3);
});

document.addEventListener("DOMContentLoaded", () => {
    
   
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


    const resizer = document.getElementById('resizer');
    let isResizing = false, startWidth, startHeight, startX, startY;

    if (resizer) {
        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;


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

           
            let newWidth = startWidth + e.clientX - startX;
            let newHeight = startHeight + e.clientY - startY;
          
            const minWidth = 247;  
            const maxWidth = 600;  
            const minHeight = 250; 
            const maxHeight = 700; 
          
            newWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
            newHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);
           
            box.style.width = `${newWidth}px`;
            box.style.height = `${newHeight}px`;
        });

        document.addEventListener('mouseup', () => isResizing = false);
    }
});



function updatePlayer(station) {
    const box = document.querySelector('.loadFailedBox');
    box.classList.remove('show');
    box.classList.add('hide');

    sphere1.visible = false;
    sphere0.visible = false;

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
 
    let textContent = station.state
        ? `${station.name} - ${station.state}, ${station.country}`
        : `${station.name} - ${station.country}`;
    
    updatePlayerText(textContent);

    document.getElementById("loadinganimation").style.display = "block";

    audioPlayer.src = station.url;
    audioPlayer.load();
  if(!firstsong){
    audioPlayer.play(); 
}


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
             expandAndFade(sphere1);
            gsap.delayedCall(1.5, () => {
            expandAndFade(sphere1);
            });
            }
        if(pulseVisible){
      
        }

        document.getElementById("loadinganimation").style.display = "none";
        
       
        playBtn.classList.remove("disabledPlay");
        nextBtn.classList.remove("disabledPlay");
        prevBtn.classList.remove("disabledPlay");        
        playBtn.classList.remove("disabledPlay2");
        

        stopmarkerFlashing();
       
       if(firstsong){
        playBtn.src = "audioplayericons/play.svg";
        }
        else{
            playBtn.src = "audioplayericons/pause.svg";
        }

    };

   
    audioPlayer.onerror = () => {
        document.getElementById("loadinganimation").style.display = "none";
        const box = document.querySelector('.loadFailedBox');
    
        setTimeout(() => {
            box.classList.remove('hide');  
          box.classList.add('show');
        }, 100);
        stopmarkerFlashing();
        playBtn.src = "audioplayericons/play.svg";
    };
}

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
    
        playBtn.src = "audioplayericons/play.svg";
    }
}


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


function toggleVolume() {
    if (audioPlayer.muted) {
      
        audioPlayer.muted = false;
      
      
        volumeSlider.value = preMuteValue;
        volumeSlider.style.background = `linear-gradient(to right, rgba(164,177,255, 1) ${volumeSlider.value}%, #ccc ${volumeSlider.value}%)`;
        volumeBtn.classList.remove('muted'); 
   
    } else {

    
        audioPlayer.muted = true;
        
        preMuteValue = volumeSlider.value;
   
       volumeSlider.value = 0;
        volumeSlider.style.background = `linear-gradient(to right, rgba(164,177,255, 1) ${volumeSlider.value}%, #ccc ${volumeSlider.value}%)`;
        volumeBtn.classList.add('muted');
    }
}


playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextStation);
prevBtn.addEventListener("click", prevStation);
volumeBtn.addEventListener("click", toggleVolume);


function updateStationHistory(newStation) {
    if (!newStation || !newStation.name) return;

    const HISTORY_KEY = "stationHistory";

    let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

   
    history = history.filter(station => station.name !== newStation.name);

   
    history.unshift(newStation);

  
    if (history.length > 10) {
        history = history.slice(0, 10);
    }

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
   
}

getMostRecentStations();



function onClick(event) {
    
    if (dragged) return;
    
    pulseVisible = false;
    material0.opacity = 0;
    material1.opacity = 0;



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
 
    const canvas = renderer.domElement;
    
    if (event.target === canvas) {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
    
    const floatingBox = document.querySelector('.floating-box');
    
    if (event.target.tagName != "CANVAS") {
        boxclick = true;
      
    } else {
        boxclick = false;
    }
}



function onMouseMove(event) {
    if (!isDragging) return;
    if (isDragging && !boxclick) {

        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
        hoverCircle.visible = false;
        isRotatingToTarget = false;

        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        const distanceScale = (camera.position.z - 130) / (230 - 130); 
        const rotationSpeed = 0.002 * (0.3 + 0.7 * distanceScale);

        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
            dragged = true; 
        }

        
        const quaternionY = new THREE.Quaternion();
        quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);

        const quaternionX = new THREE.Quaternion();
        quaternionX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * rotationSpeed);

        const combinedRotation = new THREE.Quaternion().copy(quaternionY).multiply(quaternionX);
        sphereGroup.quaternion.premultiply(combinedRotation);

        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
}

function onMouseMoveRaycast(event) {
    
    const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
    if (!(hoveredElement instanceof HTMLCanvasElement)) {
   
      } else {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    const button = document.getElementById("tooltip-btn");
    const tooltip = document.getElementById("tooltip");
    const nameText = document.getElementById("track-name");
    raycaster.setFromCamera(mouse, camera);
    let closestDistance = Infinity;
    let closestPoint = null;
   
   
    const allParticles = [particles, ...cityParticleSystems]; 
    if(!isDragging){
    for (let system of allParticles) {

        if (system && system.geometry && system.geometry.attributes.position) {
            const intersects = raycaster.intersectObject(system);
            

       if (intersects.length > 0) {
            const index = intersects[0].index; 
            const station = particleIndexMap.get(index);
            if (station) {
                nameText.style.animation = 'none';


nameText.offsetHeight;

nameText.style.animationDelay = '2s';
nameText.style.animation = 'scrollText 15s linear infinite';


                if(station.state){
                    nameText.textContent = station.name+" - "+station.state+", "+station.country;
                }else{
                    nameText.textContent = station.name+" - "+station.country;
            
                }

            } 
        }
        } else {
           
        }

        let positions;
       
       if(system){
        if (system.geometry.attributes.position.array) {
            positions = system.geometry.attributes.position.array;
        } 
    }else {
           
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

    let offsetX = -326;  
    let offsetY = -55; 

   
    if (event.clientX > screenWidth / 2) {
      
        offsetX = 10; 
        offsetY = -55; 
    } else {
      
        offsetX = -306; 
        offsetY = -55; 
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
       
        } 
        hoverCircle.visible = false;
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
    }


    tooltip.addEventListener("mouseenter", () => {
     
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
   
    isDragging = false;
   
    
}


window.addEventListener('resize', () => {
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('wheel', onWheel, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousemove', onMouseMoveRaycast, false);
window.addEventListener('mouseup', onMouseUp, false);




function updateDynamicScale() {
    const scaleFactor = camera.position.z / maxCameraZ;

    gsap.to(marker1.scale, { x: scaleFactor, y: scaleFactor, z: scaleFactor, duration: 0.3 });
    gsap.to(marker2.scale, { x: scaleFactor, y: scaleFactor, z: scaleFactor, duration: 0.3 });
    gsap.to(marker3.scale, { x: scaleFactor, y: scaleFactor, z: scaleFactor, duration: 0.3 });

}


function animate() {
    requestAnimationFrame(animate);
    camera.position.z += (targetZ - camera.position.z) * 0.1;
   
    const minScale = 0.1;  
const maxScale = 1.0;  
const zoomRange = maxCameraZ - 105; 

const normalizedZoom = (camera.position.z - 105) / zoomRange; 
const scaleFactor = minScale + (maxScale - minScale) * normalizedZoom;

markerGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);


   if (!hoverCircle.visible && !isRotatingToTarget && !isDragging) {
    const distanceScale = (camera.position.z - 130) / (230 - 130); 
    const autoRotateSpeed = 0.001 * (0.1 + 0.7 * distanceScale);  

    const quaternionY = new THREE.Quaternion();
    quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), autoRotateSpeed);

    sphereGroup.quaternion.premultiply(quaternionY);
}


if (isRotatingToTarget) {
    sphereGroup.quaternion.slerp(targetQuaternion, 0.08);
    const angleToTarget = sphereGroup.quaternion.angleTo(targetQuaternion);
    if (angleToTarget < 0.001) {
        sphereGroup.quaternion.copy(targetQuaternion);
        isRotatingToTarget = false;
    }
}

   const minSize = 0.2;
   const maxSize = 0.8;

  
   const angleIncrement = (2 * Math.PI) / numElectrons;

   electrons.forEach((electron, i) => {
       let electronX, electronY, electronZ;

      
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


   let t = (camera.position.z - 110) / (230 - 130);


   particleMaterial.size = minSize + t * (maxSize - minSize);


   const minSizeHover = 0.2;
   const maxSizeHover = 2;


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

    clearTimeout(loopTimeout);

    if (textWidth <= containerWidth) {
 
        container.style.justifyContent = "center";
        textElement.style.animation = "none";
        textElement.style.transform = "translateX(0%)";
        textElement.style.paddingLeft = "0px"; 
        return;
    }

    container.style.justifyContent = "flex-start";
    textElement.style.paddingLeft = "5px"; 

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

    clearTimeout(loopTimeout);

    if (textWidth <= containerWidth) {
        // If text fits, center it, remove animation & padding
        container.style.justifyContent = "center";
        textElement.style.animation = "none";
        textElement.style.transform = "translateX(0%)";
        textElement.style.paddingLeft = "0px"; // Remove padding
        return;
    }

  
    container.style.justifyContent = "flex-start";
    textElement.style.paddingLeft = "20px"; // Add padding

    const distance = textWidth + containerWidth; 
    const speed = 50; // Pixels per second
    const duration = distance / speed; 

    // Clear any existing animation
    textElement.style.animation = "none";
    textElement.offsetHeight; 
    
    // First animation (with 2s delay)
    textElement.style.animation = `firstScroll ${duration}s linear forwards`;
    textElement.style.animationDelay = "2s";

    loopTimeout = setTimeout(() => {
       
        textElement.style.animation = `loopScroll ${duration}s linear infinite`;
    }, (duration + 2) * 1000); 
}

function updatePlayerText(newText) {
    const textElement = document.getElementById("station-name");
    textElement.innerText = newText; 

   
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
            
            firstsong = false;
            playBtn.src = "audioplayericons/blank.svg";
            playBtn.classList.add("disabledPlay2");
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
 
    const removeButton = listItem.querySelector('.remove-btn');
    
    removeButton.classList.add("revealHeart");

}
/*FAVOURITES 
*
*
*
*
*
*/
function updateFavoritesList() {
    favorites = getFavoriteStations(); 
    const favoritesList = document.querySelector("#tab-1 .list");

    favoritesList.innerHTML = ''; 

    favorites.forEach(station => {
        if (station && station.name) {
            const listItem = document.createElement("li");
            listItem.classList.add("list-item");

            listItem.addEventListener("click", () => {
                firstsong = false;
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
                
            });

         
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

            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-btn");
            removeButton.addEventListener("click", (event) => {
                event.stopPropagation(); 
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
          

            heartSvg.appendChild(heartPath);
            removeButton.appendChild(heartSvg);

            contentWrapper.appendChild(textWrapper);
            contentWrapper.appendChild(removeButton);
            listItem.appendChild(contentWrapper);
            favoritesList.appendChild(listItem);

            
            if (currentStation && station.name === currentStation.name) {
            
                void removeButton.offsetWidth;

                removeButton.style.opacity = 1;
                removeButton.style.pointerEvents = "all";

                listItem.style.backgroundColor = "#6D78D4";
                listItem.style.color = "#d896ed";
            }
        }
    });
}


function removeFavorite(stationToRemove) {
    if (!stationToRemove || !stationToRemove.name) {
        console.error("Invalid station data:", stationToRemove); 
        return; 
    }

    let favorites = getFavoriteStations(); 
      
    favorites = favorites.filter(station => station.name !== stationToRemove.name); 
 
    saveFavoriteStations(favorites);  
    updateFavoritesList(); 
    wrangleHeart(); 
}

function saveFavoriteStations(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites)); 
}

function getFavoriteStations() {
    let favoriteStations = localStorage.getItem("favorites");
    return favoriteStations ? JSON.parse(favoriteStations) : [];
}

function handleHeartClick(event) {
    updateFavoritesList();


    let isFavorite; 

    for (let i = 0; i < favorites.length; i++) {

      
        if (favorites[i].name === currentStation.name) {
           
            isFavorite = true;
            break; 
        }
    }
    
    favorites = getFavoriteStations();

    if (!isFavorite) {
        
        favorites.push(currentStation); 
        saveFavoriteStations(favorites); 
    
        updateFavoritesList();
       let heartButton = event.target.parentElement.parentElement;
    
        updateHeartButton(heartButton, true); 
    } else {
        removeFavorite(currentStation);
       
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
   
        const containerDiv = listItem.querySelector(".border-container > div");

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

    let isFavorite; 

for (let i = 0; i < favorites.length; i++) {
  
    if (favorites[i].name === currentStation.name) {
       

        isFavorite = true;
        break; 
    }
}

    if (isFavorite) {
        if (!button.classList.contains('filled')) {
            button.classList.toggle('filled');
            
        }

    } else {
        if (button.classList.contains('filled')) {
            button.classList.toggle('filled');
            
           
        }
    
    }
}



function updateHeartButton(button, isFavorite) {
    if (isFavorite) {
        button.classList.add('favorite');
        if (!button.classList.contains('filled')) {
           
           
            button.classList.toggle('filled');
            button.classList.add('filled');

        }
        
    } else {
        button.classList.remove('favorite');
        if (button.classList.contains('filled')) {
            button.classList.toggle('filled');
          
        }
    }
}


document.querySelectorAll(".heart-btn").forEach(button => {
    button.addEventListener("click", handleHeartClick);

});



window.onload = function() {
    updateFavoritesList();  // Update the list
  
    document.querySelectorAll(".heart-btn").forEach(button => {
        const station = button.getAttribute("data-station");
        let favorites = getFavoriteStations();
        if (favorites.includes(station)) {
            updateHeartButton(button, true);  // Mark as favorite
        }
    });
}

function toggleButtonVisibility() {
    const button = document.getElementById("favorite-btn");


    if (typeof currentStation === 'undefined') {
        button.disabled = true;
        button.classList.add('disabled'); // Fades out
    } else {
        button.disabled = false; 
        button.classList.remove('disabled'); // Fades in
    }
}



volumeSlider.addEventListener("input", () => {
    audioPlayer.volume = volumeSlider.value / 100;
    if (volumeSlider.value == 0){
      
       
        volumeBtn.classList.add('muted');
    }else{
        audioPlayer.muted = false;
        preMuteValue =  audioPlayer.volume;
        volumeBtn.classList.remove('muted');
    }
});


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
        delay += 70; 
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
            flash(); 
        }

        function stopmarkerFlashing() {
            markerFlashing = false;
            clearTimeout(flashTimeout);
  
            materials.forEach(mat => {
                gsap.killTweensOf(mat); 
                mat.opacity = 0.6;
            });
        }


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
                    markerMaterial4.color.set(color); 
                },
                onComplete: () => {
                    if (marker4Flashing) {
                        marker4Timeout = setTimeout(flashMarker4Loop, 400); 
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
        
        searchResults = [];
        renderedCount = 0;
        updateSearchResults([]);
        loadingSpinner.style.display = "none";
        return;
    }

    loadingSpinner.style.display = "block";

    const words = query.split(/\s+/);

    let filtered = stationsMaster.filter(station => {
        if (!station.url) return false;

        const haystack = `${station.name} ${station.state || ""} ${station.country || ""}`.toLowerCase();
        return words.every(word => haystack.includes(word));
    });


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

    if (!append) searchList.innerHTML = ''; 

    results.forEach(station => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-item");

        listItem.addEventListener("click", () => {
            firstsong = false;
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
      

      setTimeout(() => {
        backbutton.style.display = "none";
      }, 300);
    container.style.transform = 'translateX(0%)';
    
    const stationList = document.getElementById('genreStationList');
    stationList.innerHTML = '';  
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
         
     
  
    genreRenderedCount = 0;
    content.scrollTop = 0;
    genreListActive = true;

    try {
     
        
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

    nextBatch.forEach(station => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-item");

        listItem.addEventListener("click", () => {
            firstsong = false;
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

function generateTagList() {
    tags.forEach(tag => {
   
        const listItem = document.createElement('li');
        listItem.classList.add('list-item', 'genre');
        
        listItem.textContent = tag;

    
        const arrowSpan = document.createElement('span');
        arrowSpan.classList.add('arrow');
      
        const arrowImg = document.createElement('img');
        arrowImg.src = 'sidearrow.svg'; 
        arrowImg.alt = 'arrow';
        arrowImg.width = 16;
        arrowImg.height = 16;

        arrowSpan.appendChild(arrowImg);
        listItem.appendChild(arrowSpan);
        listItem.addEventListener('click', () => {
            showGenreStationList(tag);
        });
      
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

   countrybackbutton.style.display = "block"; 

   setTimeout(() => {
 requestAnimationFrame(() => {
     countrybackbutton.style.opacity = "1";
     countrybackbutton.style.pointerEvents = "all";
   });
  }, 100);
  
}

const countryListContainer = document.getElementById('panel2list');


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

        listItem.addEventListener('click', () => {
            fetchStationsByCountry(name, false);
        });

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

   countrybackbutton.style.display = "block";
   setTimeout(() => {
    requestAnimationFrame(() => {
        countrybackbutton.style.opacity = "1";
        countrybackbutton.style.pointerEvents = "all";
      });
     }, 100);


    try {
     
        countrySearchResults = stationsMaster
            .filter(station =>
                station.url &&          
                station.country.toLowerCase().trim() === country.toLowerCase().trim()
            )
            .filter((station, index, self) =>
                index === self.findIndex(s => s.name === station.name)
            );


            if (countrySearchResults.length === 0) {
                console.log("nothing found");
            } else {
                loadCountrySearchResults(title);
          
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

document.getElementById("country3list").style.display = "block";
    container.style.transform = 'translateX(0%)'; 
    content.scrollTop = 0;
    setTimeout(() => {
        document.getElementById("panel2list").innerHTML = "";
       
      }, 300);
     
     
      countrybackbutton.style.opacity = "0";
      countrybackbutton.style.pointerEvents = "none";
      
      setTimeout(() => {
        countrybackbutton.style.display = "none";
      }, 300);
    countrySearchResults = [];
   }
   else{
    openCountryList();
       
    container.style.transform = 'translateX(-33.33%)';
    
        document.getElementById("panel3list").innerHTML = "";

        content.scrollTop = previousscrollposition;
     
    countrySearchResults = [];
   
    countrySearchResults
    backbuttontext.textContent = "Discover"
    backhome = true;
   
   }

}


function loadCountrySearchResults(title){
    
        const panel2list = document.getElementById('panel2list');
        const panel3list = document.getElementById('panel3list');
   
    const nextBatch = countrySearchResults.slice(countryRenderedCount, countryRenderedCount + COUNTRY_RESULTS_PER_BATCH);
   
    nextBatch.forEach(station => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-item");

        listItem.addEventListener("click", () => {
            firstsong = false;
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

function expandAndFade(sphere) {

gsap.set(sphere.scale, { x: 0.1, y: 0.1, z: 0.1 });
sphere.material.opacity = 1;


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

function loopPulse(sphere0, delay = 0) {


gsap.delayedCall(delay, () => {
  expandAndFade(sphere0);
  loopPulse(sphere0, 3); 
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
   

    header.textContent = formatCountryName(country);

    try {

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

    }
}


}


function loadCountryStations(countrySearchResults, list) {
    
    list.innerHTML = ''; 

    const shuffled = countrySearchResults.sort(() => 0.5 - Math.random());
    const selectedStations = shuffled.slice(0, 5);

    selectedStations.forEach(station => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-item");
    
        listItem.addEventListener("click", () => {
            firstsong = false;
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
    await fetchStationsFromAPI(); 
    getThreeRandomCountries();    

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


generateTagList();
toggleButtonVisibility();
fetchStationsFromAPI(500000);
animate();
