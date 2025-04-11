require("dotenv").config(); // Load environment variables
const express = require('express');
const connectDB = require('./utils/conn');
const cors = require('cors');
const morgan = require('morgan'); // Logging middleware

const app = express();
const PORT = process.env.PORT || 5000; // Use the environment variable or default to 5000

// Connect to MongoDB
connectDB(); // This will now log the success message on connection

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));
app.use(morgan('dev')); // Log HTTP requests

// Custom error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/complaint', require('./routes/complaintRoutes'));
app.use('/api/invoice', require('./routes/invoiceRoutes'));
app.use('/api/messoff', require('./routes/messoffRoutes'));
app.use('/api/request', require('./routes/requestRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/suggestion', require('./routes/suggestionRoutes'));
app.use('/api/washingmachine', require('./routes/washingMachineRoutes'));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
