const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: 'https://orbitradio96.onrender.com'  // Allow only your frontend
}));
// Load JSON data
let stations;
try {
    const dataPath = path.join(__dirname, "src", "stations.json");
    stations = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    console.log("Stations loaded successfully!");
} catch (error) {
    console.error("Error loading stations.json:", error);
    stations = []; // fallback to empty array if loading fails
}

// API Routes
// Route to get all stations
app.get("/stations", (req, res) => {
    res.json(stations);
});

// Route to get a single station by UUID
app.get("/stations/:uuid", (req, res) => {
    const stationUUID = req.params.uuid;
    const station = stations.find(s => s.stationuuid === stationUUID);
    
    if (!station) {
        return res.status(404).json({ message: "Station not found" });
    }

    res.json(station);
});

// Health check or welcome route
app.get("/", (req, res) => {
    res.json({ message: "API is working!" });
});

// Serve static frontend files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Catch-all route to return index.html for any other route
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
