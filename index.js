import * as THREE from 'three';

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

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));
const volumeSlider = document.getElementById("volume-slider");
const wireframeMaterialBlue = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Blue wireframe

// Define the geometry for a cube (vertices of a cube)
const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
let preMuteValue;
// Convert the cube's geometry into edges for the wireframe effect
const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);

// Create a line object from the edges geometry and apply the wireframe material
const wireframeCubeObject = new THREE.LineSegments(cubeEdges, wireframeMaterialBlue);

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
   
  
    
   let textContent = station.state ? `${station.name} - ${station.state}, ${station.country}` : `${station.name} - ${station.country}`;
   updatePlayerText(textContent);
    audioPlayer.src = station.url;  // Set the station URL as the source
    audioPlayer.load();             // Load the new stream URL
    audioPlayer.play();   
    
    playBtn.src = "audioplayericons/pause.svg";// Start playing automatically
}

// Play/Pause toggle
function togglePlay() {
   
    console.log("dhasgdkjashd"+currentStation);
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.src = "audioplayericons/pause.svg"; // Assuming you have a pause icon
    } else {
        audioPlayer.pause();
        playBtn.src = "audioplayericons/play.svg";
    }
}

// Next Station
function nextStation() {
    currentStationIndex = (currentStationIndex + 1) % stations.length;
    updatePlayer(stations[currentStationIndex]);
}

// Previous Station
function prevStation() {
    currentStationIndex = (currentStationIndex - 1 + stations.length) % stations.length;
    updatePlayer(stations[currentStationIndex]);
}

// Volume Control (Example of mute/unmute or volume adjustment)
function toggleVolume() {
    if (audioPlayer.muted) {
        audioPlayer.muted = false;
        volumeSlider.value = preMuteValue;
        volumeSlider.style.background = `linear-gradient(to right, rgba(164,177,255, 1) ${volumeSlider.value}%, #ccc ${volumeSlider.value}%)`;
        volumeBtn.classList.remove('muted'); 
        // Normal volume icon
    } else {
        audioPlayer.muted = true;
       preMuteValue = volumeSlider.value;
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





















// Raycasting for click detection

function onClick(event) {
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
                  
                    
                  
                    updatePlayer(station);
                    currentStation = station;
                    toggleButtonVisibility();
                    updateFavoritesList();
                    wrangleHeart();
                    // Set the station URL as the source
                             // Optionally, start playing automatically
                   // console.log('Now playing stream from:', station.url);
                }
            }
        }

        let positions;
        if (system.geometry.attributes.position.array) {
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
           // console.log("berefe  "+wireframeCubeObject.position.x +", "+wireframeCubeObject.position.y +", "+wireframeCubeObject.position.z)
            // const jewelPosition =  latLonToCartesian(station.geo_lat, station.geo_long, 100.5);; 
           
           
            wireframeCubeObject.position.copy(closestPoint);
          //  console.log("aftere  " +wireframeCubeObject.position.x +", "+wireframeCubeObject.position.y +", "+wireframeCubeObject.position.z)
        
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
    targetZ = Math.max(105, Math.min(230, targetZ));
}

function onMouseDown(event) {
  
    const canvas = renderer.domElement;
//console.log(canvas);
    // Check if the clicked element is NOT the box or the drag handle
    if (event.target == canvas) {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
}


function onMouseMove(event) {
    if (!isDragging) return;
    if (isDragging){
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
    camera.position.z += (targetZ - camera.position.z) * 0.1;
   
   if(hoverCircle.visible == false){
    sphereGroup.rotation.y += 0.001;
   }

   const minSize = 0.2;
   const maxSize = 0.8;

   // Get the camera's Z position (assuming movement along the Z-axis)
  

  

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


/*FAVOURITES SECTION
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
                updatePlayer(station);
                currentStation = station;
                updateFavoritesList(); 
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
            locationText.textContent = `${station.state}, ${station.country}`;

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
       console.log("okwhat is this"+event.target.parentElement.parentElement)
        updateHeartButton(heartButton, true); // Change heart to red
    } else {
        removeFavorite(currentStation);
        //console.log("wokywokoakwokw");
        updateHeartButton(heartButton, false); 
        

    }
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
            console.log("here3");
        }
//
       // console.log("das");
    } else {
        if (button.classList.contains('filled')) {
            button.classList.toggle('filled');
            console.log("here4");
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
            console.log("HEARTbutton: "+button);
            console.log("here1");
        }
        
    } else {
        button.classList.remove('favorite');
        if (button.classList.contains('filled')) {
            button.classList.toggle('filled');
            console.log("here2");
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
});
//clearAllCookies();



toggleButtonVisibility();

fetchStationsFromAPI(500000);
animate();
