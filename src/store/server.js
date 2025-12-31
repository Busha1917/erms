const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Load env vars
dotenv.config();
if (!process.env.JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not defined. Authentication may fail.");
} else {
  console.log("JWT_SECRET loaded.");
}

// Connect to Database
connectDB();

const app = express();

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Body parser
app.use(express.json());

// Routes
try {
  app.use('/api/auth', require('./authRoutes'));
  app.use('/api/repairs', require('./repairRoutes'));
  app.use('/api/inventory', require('./inventoryRoutes'));
  app.use('/api/notifications', require('./notificationRoutes'));
  app.use('/api/users', require('./userRoutes'));
  app.use('/api/devices', require('./deviceRoutes'));
  app.use('/api/technicians', require('./technicianRoutes'));
  app.use('/api/dashboard', require('./dashboardRoutes'));
  app.use('/api/reports', require('./reportRoutes'));
  app.use('/api/settings', require('./settingsRoutes'));
} catch (error) {
  console.error("Error loading routes. Check for missing dependencies or syntax errors:", error.message);
  // Server continues to run to avoid Connection Refused, but API will return 404s
}

app.get('/', (req, res) => {
  res.send('ERMS API is running...');
});

// Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the other process or change the PORT in .env`);
  } else {
    console.error("Server error:", err);
  }
});
