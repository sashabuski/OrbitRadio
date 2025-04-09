import * as THREE from 'three';

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

let isDragging;

const markerGeometry4 = new THREE.SphereGeometry(3.1, 16, 16); // radius, width segments, height segments
const markerWireframe4 = new THREE.WireframeGeometry(markerGeometry4);

// Create a line material for the wireframe
const markerMaterial4 = new THREE.LineBasicMaterial({ color: 0x916cc7, opacity: 0.2,  // Set opacity (range: 0 to 1)
    transparent: true });

// Create a mesh for the wireframe lines
const marker4 = new THREE.LineSegments(markerWireframe4, markerMaterial4);
scene.add(marker4);

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
async function fetchStationsFromAPI(limit = 500000) {
    try {
        const response = await fetch('http://localhost:3000/stations'); // Fetch from API
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const stations = await response.json();
        const filteredStations = stations.filter(station => station.state);

        stationsList.push(...filteredStations.slice(0, limit));
        addStationsAsParticles(); // Call function after fetching data

        console.log(`Loaded ${filteredStations.length} stations.`);
    } catch (error) {
        console.error('Error fetching stations from API:', error);
    }
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
            const minWidth = 200;  // Set your desired min width
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
    audioPlayer.play();

    // Wait until the audio is ready to play
    audioPlayer.oncanplay = () => {
        document.getElementById("loadinganimation").style.display = "none";
        
       
        playBtn.classList.remove("disabledPlay");
        nextBtn.classList.remove("disabledPlay");
        prevBtn.classList.remove("disabledPlay");        
        playBtn.classList.remove("disabledPlay2");
        

        stopmarkerFlashing();
        toggleMarker4Flashing();
        playBtn.src = "audioplayericons/pause.svg";
    };

    // Optional: handle error case
    audioPlayer.onerror = () => {
        document.getElementById("loadinganimation").style.display = "none";
        alert("Failed to load the stream.");
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
       
       
        loadingIcon.style.display = 'block';
        audioPlayer.play();
        toggleMarker4Flashing();
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
        toggleMarker4Flashing();
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
        audioPlayer.muted = false;
        console.log("1");
        volumeSlider.value = preMuteValue;
        volumeSlider.style.background = `linear-gradient(to right, rgba(164,177,255, 1) ${volumeSlider.value}%, #ccc ${volumeSlider.value}%)`;
        volumeBtn.classList.remove('muted'); 
        // Normal volume icon
    } else {
        audioPlayer.muted = true;
       preMuteValue = volumeSlider.value;
       console.log("2"); 
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
            
            listItem.style.backgroundColor = "#6D78D4";
            listItem.style.color = "#d896ed";
            currentlistitem = listItem;
           
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
   
    //console.log("xxxxx");
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    let closestPoint = null;
    let closestDistance = Infinity;
    raycaster.setFromCamera(mouse, camera);

    // Check all particle systems (particles and cityParticleSystems)
    const allParticles = [particles, ...cityParticleSystems]; // Combine single and city particle systems

    for (let system of allParticles) {
        const intersects = raycaster.intersectObject(system);

        if (intersects.length > 0) {
            const index = intersects[0].index; // Get the index of the clicked particle
            const station = particleIndexMap.get(index);
            currentStationIndex = index;
         //   console.log("ThisStation: "+JSON.stringify(station));
          //  console.log("NextStation: "+JSON.stringify(next));
          //  console.log("PrevStation: "+JSON.stringify(prev));
        //  console.log("herehrehreh0000000000");
        //  console.log(isDragging);


           if(!isDragging){
//("herehrehreh1111111111");
// console.log(isDragging);
            if (station) {
                console.log('Clicked Station:', station);
                const material = station.material;

                if (material instanceof THREE.PointsMaterial) {
                   // console.log('Size before:', material.size);
                    material.size *= 1.2; // Increase size to indicate selection
                    //console.log('Size after:', material.size);
                }

                // Load the audio stream from the station URL
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
                    // Set the station URL as the source
                             // Optionally, start playing automatically
                   // console.log('Now playing stream from:', station.url);
                
                
                   const worldPoint = intersects[0].point;

                   // Convert world position to local space of the rotating globe
                   const localPoint = sphereGroup.worldToLocal(worldPoint.clone());
           
                   let direction = localPoint.clone().normalize();
                 direction = direction.multiplyScalar(102 + 0.05);
                   wireframeCubeObject.position.copy(direction);
                marker1.position.copy(direction);
                marker2.position.copy(direction.multiplyScalar(1.03));
                marker3.position.copy(direction.multiplyScalar(1.04));
                marker4.position.copy(direction.multiplyScalar(1.055));
                
                
                markerMaterial1.opacity = 0;
                markerMaterial2.opacity = 0;
                markerMaterial3.opacity = 0;
                markerMaterial4.opacity = 0;
                
               if(marker4Flashing = true) {
              toggleMarker4Flashing();
               }

                fadeInMarkers();

                startmarkerFlashing();
                // atomGroup.position.copy(direction);
              //  atomGroup.visible = true;
                }
            }




        }}
/* 
        let positions;
        if (system.geometry.attributes.position.array) {console.log("ber");
            positions = system.geometry.attributes.position.array;
        } else {
         //   console.log('No positions found for particle system');
            continue;
        }

        let particleWorldPosition = new THREE.Vector3();

        for (let i = 0; i < positions.length; i += 3) {
            particleWorldPosition.set(positions[i] * 1.2, positions[i + 1] * 1.2, positions[i + 2] * 1.2);
            particleWorldPosition.applyMatrix4(system.matrixWorld); // Convert to world coordinates

            let distance = raycaster.ray.distanceSqToPoint(particleWorldPosition); // Squared distance check

            if (distance < 1) { // Threshold for detecting a "hit"
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestPoint = particleWorldPosition.clone();
                }
            }
        }

        if (closestPoint) {
            console.log("berefe  "+wireframeCubeObject.position.x +", "+wireframeCubeObject.position.y +", "+wireframeCubeObject.position.z)
            // const jewelPosition =  latLonToCartesian(station.geo_lat, station.geo_long, 100.5);; 
           
           
            wireframeCubeObject.position.copy(closestPoint);
            console.log("aftere  " +wireframeCubeObject.position.x +", "+wireframeCubeObject.position.y +", "+wireframeCubeObject.position.z)
        
        }


console.log("hovercircle pos: "+JSON.stringify(hoverCircle.position));       
markerPosition = hoverCircle.position;
console.log("markerPosition pos: "+JSON.stringify(markerPosition));   

     wireframeCubeObject.position.copy(markerPosition); */  
     sphereGroup.add(wireframeCubeObject);    
     sphereGroup.add(atomGroup);
     sphereGroup.add(marker1);
     sphereGroup.add(marker2);
     sphereGroup.add(marker3);
     sphereGroup.add(marker4);
     //   console.log("wireframeCubeObject pos: "+JSON.stringify(wireframeCubeObject.position)); 


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
    }
  
}

let boxclick = false;

function onMouseDown(event) {
    isDragging = true;
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
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    sphereGroup.rotation.y += deltaX * 0.002;
    sphereGroup.rotation.x += deltaY * 0.002;

    previousMousePosition = { x: event.clientX, y: event.clientY };
}
}

function onMouseMoveRaycast(event) {
    
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
        if (system.geometry.attributes.position.array) {
            positions = system.geometry.attributes.position.array;
        } else {
           // console.log('No positions found for particle system');
            continue;
        }

        let particleWorldPosition = new THREE.Vector3();

        for (let i = 0; i < positions.length; i += 3) {
            particleWorldPosition.set(positions[i], positions[i + 1], positions[i + 2]);
            particleWorldPosition.applyMatrix4(system.matrixWorld); // Convert to world coordinates

            let distance = raycaster.ray.distanceSqToPoint(particleWorldPosition); // Squared distance check

            if (distance < 1) { // Threshold for detecting a "hit"
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

  

function onMouseUp() {
   // console.log("jhiji1"+isDragging);
    isDragging = false;
   // console.log("jhiji2"+isDragging);
}

window.addEventListener('wheel', onWheel, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousemove', onMouseMoveRaycast, false);
window.addEventListener('mouseup', onMouseUp, false);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    camera.position.z += (targetZ - camera.position.z) * 0.1;
   
   if(hoverCircle.visible == false){
    sphereGroup.rotation.y += 0.001;
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
 */

async function getLocalStations(){
    const stationList = document.querySelector('#tab-3 .list');
    let countrycode; 
    let localSearchResults;
    const localloadingspinner = document.getElementById("local-loading-spinner");
    localloadingspinner.style.display = "block";
    fetch('https://ipinfo.io?token=103b79e365df36')
    .then(response => response.json())
    .then(data => {
      countrycode = data.country;
      document.getElementById('country').textContent = country;
    })
    .catch(error => {
      console.error('Error fetching location data:', error);
      document.getElementById('country').textContent = 'Could not determine your country.';
    });
    
    try {
        const response = await fetch("http://localhost:3000/stations");
        const stations = await response.json();
       // console.log("v2"+stations[2]);
        
       localSearchResults = stations
    .filter(station =>
        station.url &&
        station.countrycode == countrycode
    )
    .filter((station, index, self) =>
        index === self.findIndex(s => s.name === station.name)
    );

        if (localSearchResults.length === 0) {
            const li = document.createElement('li');
          //  console.log("v7");
            li.textContent = "No stations found for this genre.";
            stationList.appendChild(li);
        } else {
            loadLocalStations(localSearchResults);
             // Load initial batch
        }

        

    } catch (error) {
        console.error("Error fetching genre stations:", error);
    } finally {
        loadingSpinner2.style.display = "none";
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
/*FAVOURITES 
*
*
*
*
*
*/

function updateFavoritesList() {
    favorites = getFavoriteStations(); // Retrieve favorite stations from localStorage or cookies
    const favoritesList = document.querySelector("#tab-1 .list"); // Select the list inside your tab

    favoritesList.innerHTML = ''; // Clear the existing list before updating

    favorites.forEach(station => {
        // Ensure all required data exists and is not empty
        if (station && station.name && station.state && station.country) {
            // Create list item
            const listItem = document.createElement("li");
            listItem.classList.add("list-item");


          
            // Apply styles if this station is the current station
            if (currentStation && station.name === currentStation.name) {
               
                listItem.style.backgroundColor = "#6D78D4";
                listItem.style.color = "#d896ed";
            }

            listItem.addEventListener("click", () => {
                if(currentlistitem){
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

            // Create a container for border control
            const contentWrapper = document.createElement("div");
            contentWrapper.classList.add("border-container");

            // Create a div to wrap the text
            const textWrapper = document.createElement("div");

            // Create station name text
            const stationName = document.createTextNode(station.name);
            textWrapper.appendChild(stationName);

            // Create h2 element for state and country
            const locationText = document.createElement("h2");
            locationText.classList.add("locationtext");
            if(station.state){
                locationText.textContent = `${station.state}, ${station.country}`;
               }else{
                locationText.textContent = `${station.country}`;
               }

            textWrapper.appendChild(locationText);

            // Create "X" button for removal
            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-btn");
            removeButton.addEventListener("click", () => removeFavorite(station));

            // Append text and button to the content wrapper
            contentWrapper.appendChild(textWrapper);
            contentWrapper.appendChild(removeButton);

            // Append the content wrapper to the list item
            listItem.appendChild(contentWrapper);

            // Append the list item to the favorites list
            favoritesList.appendChild(listItem);
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

let searchResults = [];
let renderedCount = 0;
const RESULTS_PER_BATCH = 20; // or whatever batch size you use
let abortController = null;

document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("search-box");
    if (searchBox) {
        searchBox.addEventListener("keyup", filterList);
    }
});

const loadingSpinner = document.getElementById("loading-spinner");

async function filterList() {
    const query = document.getElementById("search-box").value.trim().toLowerCase();

    const searchBox = document.getElementById("search-box");

    if (searchBox.value.trim() === "") {
        // The search box is empty
        if (abortController) {
            abortController.abort();
        }
       
        console.log("Search box is empty.");
    } else {
        // The search box is not empty
        console.log("Search box has input.");
    }

    if (!query) {
        searchResults = [];
        renderedCount = 0;
        updateSearchResults([]);
        loadingSpinner.style.display = "none"; // Hide spinner if query is empty
        return;
    }

    // Abort previous request if it's still pending
    if (abortController) {
        abortController.abort();
    }

    abortController = new AbortController();

    // Show spinner immediately when starting new request
    loadingSpinner.style.display = "block";

    try {
        const response = await fetch("http://localhost:3000/stations", {
            signal: abortController.signal
        });

        const stations = await response.json();

        let filtered = stations.filter(station =>
            station.url && (
                new RegExp(`\\b${query}\\w*`, 'i').test(station.name) ||
                new RegExp(`\\b${query}\\w*`, 'i').test(station.state?.toLowerCase()) ||
                new RegExp(`\\b${query}\\w*`, 'i').test(station.country?.toLowerCase())
            )
        );
        
        // Then remove duplicates by name
        searchResults = filtered.filter((station, index, self) =>
            index === self.findIndex(s => s.name === station.name)
        );
        

        console.log("searching stations;");
        renderedCount = 0;
        updateSearchResults([]); // Clear previous
        loadMoreResults();       // Load first batch

    } catch (error) {
        if (error.name !== "AbortError") {
            console.error("Error fetching stations:", error);
        }
    } finally {
        // Make sure the spinner only hides after new data is loaded or error is caught
        if (searchResults.length > 0) {
            loadingSpinner.style.display = "none";
        }
    }
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
               console.log("HERE1");
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
    backbutton.style.display = "none"; 
    container.style.transform = 'translateX(0%)';
    backbutton.style.transform = 'translateX(0%)';
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
        loadMoreResults();
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
     backbutton.style.transform = 'translateX(-100%)';
     setTimeout(() => {
        loadingSpinner2.style.display = "block";
    }, 300);
   // console.log("1");
    genreRenderedCount = 0;
    content.scrollTop = 0;
    genreListActive = true;

    try {
        const response = await fetch("http://localhost:3000/stations");
        const stations = await response.json();
       // console.log("v2"+stations[2]);
        
        genreSearchResults = stations
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

        if (genreSearchResults.length === 0) {
            const li = document.createElement('li');
           // console.log("v7");
            li.textContent = "No stations found for this genre.";
            stationList.appendChild(li);
        } else {
            loadMoreGenreStations();
             // Load initial batch
        }

        

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

    genreRenderedCount += nextBatch.length;
}


const genreContentDiv = document.querySelector(".content");

genreContentDiv.addEventListener("scroll", () => {
    
    if(genreListActive){
    if (
        genreContentDiv.scrollTop + genreContentDiv.clientHeight >= 
        genreContentDiv.scrollHeight - 5
    ) {
        loadMoreGenreStations();
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




// Generate the list on page load
generateTagList();


toggleButtonVisibility();

fetchStationsFromAPI(500000);
animate();
