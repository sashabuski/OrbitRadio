const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
    origin: 'https://orbitradio96.onrender.com'  // Allow only your frontend
  }));

// Load JSON data
let stations;
try {
    stations = JSON.parse(fs.readFileSync("stations.json"));
    console.log("Stations loaded successfully!");
} catch (error) {
    console.error("Error loading stations.json:", error);
}

// Route to get all stations
app.get("/stations", (req, res) => {
    res.json(stations);
});

// Route to get a single station by UUID
app.get("/stations/:uuid", (req, res) => {
    const stationUUID = req.params.uuid;
    console.log(`Looking for station with UUID: ${stationUUID}`);

    const station = stations.find(s => s.stationuuid === stationUUID);
    if (!station) {
        console.log("Station not found");
        return res.status(404).json({ message: "Station not found" });
    }

    console.log("Station found:", station);
    res.json(station);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
