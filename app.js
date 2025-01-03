require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');
const upload = require('./config/multerConfig');
const http = require('http');

// Importing routes
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const storeRoutes = require('./routes/storeRoutes');
const couponRoutes = require('./routes/couponRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Connect to the database
connectDB();

const app = express();

// Configure CORS to allow requests from everywhere
const corsOptions = {
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],   // Allowed headers
  credentials: false,                                  // Do not use credentials with '*'
};

app.use(cors(corsOptions)); // Enable CORS globally

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define API routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', storeRoutes);
app.use('/api', couponRoutes);
app.use('/api', categoryRoutes);

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    res.send('File uploaded successfully');
  } catch (err) {
    res.status(400).send('Error uploading file');
  }
});

// Middleware for handling 404 errors and general error handling
app.use(notFound);
app.use(errorHandler);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).send('Welcome to CouponWorth Backend');
});

// Create an HTTP server instance
const server = http.createServer(app);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
