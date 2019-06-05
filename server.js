const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

app.get('/', (req, res) => res.send('API RUNNING'));

const PORT = process.env.port || 5000;
app.listen(PORT, err => console.log(`Server started on port: ${PORT}`));
