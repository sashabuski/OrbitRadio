const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// ❗ Your original CORS — unchanged
app.use(cors({
  origin: 'https://www.orbitrad.io'
}));

// Load JSON data
let stations;
try {
  stations = JSON.parse(fs.readFileSync("src/stations.json"));
  console.log(`Stations loaded successfully! Total: ${stations.length}`);
} catch (error) {
  console.error("Error loading stations.json:", error);
  stations = [];
}

// ✅ Route to get stations in chunks using ?start= and ?limit=
app.get("/stations", (req, res) => {
  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || stations.length;
  const sliced = stations.slice(start, start + limit);
  res.json(sliced);
});

// Optional: total count of stations
app.get("/stations/count", (req, res) => {
  res.json({ count: stations.length });
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
