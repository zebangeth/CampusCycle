import 'dotenv/config';
import express from 'express';
import session from 'express-session';  
import MongoStore from 'connect-mongo';
import connectDB from './database';
import { Issuer, Strategy, generators } from 'openid-client'
import passport from 'passport'

import User from './models/User';
import AdminUser from './models/Admin';

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

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: any, done) => {
  console.log("serializeUser", user);
  done(null, { id: user._id, role: user.role }); // Serialize the user's ID and role
});

passport.deserializeUser(async (userInfo: any, done) => {
  console.log("deserializeUser", userInfo);
  try {
    const { id, role } = userInfo;
    let user;
    if (role === 'admin') {
      user = await AdminUser.findById(id);
    } else {
      user = await User.findById(id);
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

Issuer.discover("https://coursework.cs.duke.edu/").then(issuer => {
  const client = new issuer.Client({
    client_id: process.env.GITLAB_CLIENT_ID as string,
    client_secret: process.env.GITLAB_CLIENT_SECRET as string,
    redirect_uris: ['http://127.0.0.1:3000/login-callback'],
    // response_types: ['code'],
  });

  const params = {
    scope: 'openid profile email',
    nonce: generators.nonce(),
    redirect_uri: 'http://127.0.0.1:3000/login-callback',
    state: generators.state(),
  };
  passport.use(
    'oidc',
    new Strategy({ client, params }, async (tokenSet: any, userInfo: any, done: any) => {
      try {
        // Check if the user is an admin
        const isAdmin = userInfo.groups.includes(process.env.GITLAB_ADMIN_GROUP_ID);

        if (isAdmin) {
          // Find or create the admin user in the database
          let adminUser = await AdminUser.findOne({ email: userInfo.email });
          if (!adminUser) {
            adminUser = new AdminUser({
              email: userInfo.email,
            });
            await adminUser.save();
          }
          // Store the admin user's information in the session
          done(null, { ...adminUser.toObject(), role: 'admin' });
        } else {
          // Find or create the regular user in the database
          let regularUser = await User.findOne({ email: userInfo.email });
          if (!regularUser) {
            regularUser = new User({
              name: userInfo.name,
              email: userInfo.email,
            });
            await regularUser.save();
          }
          // Store the regular user's information in the session
          done(null, { ...regularUser.toObject(), role: 'user' });
        }
      } catch (error) {
        done(error);
      }
    })
  );
});


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

// User login callback
app.get('/login-callback', passport.authenticate('oidc', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/api/users/login',
}));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
