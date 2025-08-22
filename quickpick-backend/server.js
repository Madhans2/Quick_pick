import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';


// Routes
import productsRoute from './routes/products.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js'; // ✅ new
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({ origin: 'https://quick-pick-o9en.onrender.com' }));
app.use(bodyParser.json());



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoute);
app.use('/api/user', userRoutes); // ✅ new

app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
