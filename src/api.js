const express = require("express");
const serverless = require('serverless-http');
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();
app.use(cors());

// Load JSON data
let stations;
try {
    stations = JSON.parse(fs.readFileSync("src/stations.json"));
    console.log("Stations loaded successfully!");
} catch (error) {
    console.error("Error loading stations.json:", error);
}

// Route to get all stations
router.get("/stations", (req, res) => {
    res.json(stations);
});

// Route to get a single station by UUID
router.get("/stations/:uuid", (req, res) => {
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

router.get("/", (req, res) => {
    res.json({ message: "API is working!" });
  });
  
app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);