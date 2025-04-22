const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: 'https://www.orbitrad.io'
}));

let stations;
try {
  stations = JSON.parse(fs.readFileSync("src/stations.json"));
  console.log(`Stations loaded successfully! Total: ${stations.length}`);
} catch (error) {
  console.error("Error loading stations.json:", error);
  stations = [];
}

let countriesGeoJSON;
try {
    countriesGeoJSON = JSON.parse(fs.readFileSync("src/countries.geo.json"));
    console.log("Countries GeoJSON loaded successfully!");
} catch (error) {
    console.error("Error loading countries.geo.json:", error);
}


app.get("/stations", (req, res) => {
  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || stations.length;
  const sliced = stations.slice(start, start + limit);
  res.json(sliced);
});

app.get("/stations/count", (req, res) => {
  res.json({ count: stations.length });
});

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


app.get("/countries", (req, res) => {
    if (!countriesGeoJSON) {
        return res.status(500).json({ message: "Error loading countries GeoJSON" });
    }
    res.json(countriesGeoJSON);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
