const express = require('express');
const cors = require('cors');
const { connectAndSync } = require('./db');
const apiRoutes = require('./routes/api');
const config = require('./config');

const app = express();

app.use(express.json());
app.use(cors());

// Use API routes
app.use('/api', apiRoutes);

// Start the server
const startServer = async () => {
    await connectAndSync();
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
};

startServer(); 