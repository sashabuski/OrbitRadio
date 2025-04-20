require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual MongoDB Atlas URI
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

app.use(cors({
    origin: 'https://orbitradio96.onrender.com'  // Allow only your frontend
  }));

// Connect to MongoDB
async function connectToMongo() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}
connectToMongo();

// Route: Get all stations
app.get("/stations", async (req, res) => {
    try {
        const stations = await client
            .db("OrbitRadio")
            .collection("Stations")
            .find({})
            .toArray();

        res.json(stations);
    } catch (error) {
        console.error("Error fetching stations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route: Get single station by UUID
app.get("/stations/:uuid", async (req, res) => {
    try {
        const station = await client
            .db("OrbitRadio")
            .collection("Stations")
            .findOne({ stationuuid: req.params.uuid });

        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }

        res.json(station);
    } catch (error) {
        console.error("Error fetching station:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("/", (req, res) => {
    res.send("Welcome to OrbitRadio API!");
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
