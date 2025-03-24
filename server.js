const express = require('express');
const RadioBrowser = require('radio-browser');
const app = express();
const port = 3000;

// API endpoint to get stations based on search
app.get('/api/stations', async (req, res) => {
    const searchterm = req.query.search || 'jazz'; // Default search term

    try {
        const stations = await RadioBrowser.getStations({
            limit: 50,   
            by: 'tag',
            searchterm: searchterm
        });
        res.json(stations); // Send the stations data to the frontend
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stations from RadioBrowser' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
