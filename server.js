const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
