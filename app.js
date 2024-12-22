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

// Configure CORS to allow requests from frontend
const corsOptions = {
  origin: (origin, callback) => {
    // Allow your frontend URLs and localhost for development
    if (origin === 'https://getcouponsfrontend.vercel.app' || origin === 'http://localhost:3000' || !origin) {
      callback(null, true); // allow the request
    } else {
      callback(new Error('Not allowed by CORS'), false); // reject the request
    }
  },
  methods: 'GET, POST, DELETE, UPDATE, PUT',
  allowedHeaders: 'Content-Type, Authorization', // Customize as needed
};

app.use(cors(corsOptions)); // Enable CORS with the specified options

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

// At the end of your routes in app.js
app.get('/', (req, res) => {
  res.status(200).send('Welcome to CouponWorth Backend');
});

// Create an HTTP server instance
const server = http.createServer(app);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
