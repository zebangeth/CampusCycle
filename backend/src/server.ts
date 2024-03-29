import 'dotenv/config';
import express from 'express';
import connectDB from './database';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import listingRoutes from './routes/listingRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import searchRoutes from './routes/searchRoutes';
import contactRoutes from './routes/contactRoutes';


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to database
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
