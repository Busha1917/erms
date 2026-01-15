const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/devices', require('./routes/deviceRoutes'));
app.use('/api/repairs', require('./routes/repairRoutes'));

const PORT = process.env.PORT || 5000;

// Wait for DB connection before starting server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});