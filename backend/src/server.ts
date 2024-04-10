import 'dotenv/config';
import express from 'express';
import session from 'express-session';  
import MongoStore from 'connect-mongo';
import connectDB from './database';
import adminRoutes from './routes/adminRoutes';
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
// app.use(express.json());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // currently false in development
      maxAge: 72 * 60 * 60 * 1000, // 72 hours
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60 // 14 days
    })
  })
);

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
app.use('/api/admin', adminRoutes);
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
