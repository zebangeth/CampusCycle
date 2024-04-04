import 'dotenv/config';
import express from 'express';
import connectDB from './database';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import listingRoutes from './routes/listingRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import searchRoutes from './routes/searchRoutes';
import contactRoutes from './routes/contactRoutes';

console.log("Starting server...");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
console.log("Setting up middleware...");
app.use(express.json());

// Set up CORS
console.log("Setting up CORS...");
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Connect to database
console.log("Connecting to database...");
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/contact', contactRoutes);


app.get('/', (req, res) => {
  res.send('Hello World from CampusCycle backend!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
