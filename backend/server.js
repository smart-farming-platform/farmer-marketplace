const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const farmerRoutes = require('./routes/farmers');
const paymentRoutes = require('./routes/payments');
const demoOrderRoutes = require('./routes/demo-orders');
const reviewRoutes = require('./routes/reviews');
const locationRoutes = require('./routes/location');
const aiRoutes = require('./routes/ai');
const diseaseRoutes = require('./routes/disease');
const marketRoutes = require('./routes/market');
const weatherRoutes = require('./routes/weather');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farm-marketplace')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/demo-orders', demoOrderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/weather', weatherRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Farm Marketplace API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});