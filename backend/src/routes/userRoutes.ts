import express from 'express';
import passport from 'passport'
import User from '../models/User';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

// User login
router.get(
  "/login", 
  passport.authenticate("oidc", { failureRedirect: "/api/login" }), 
  (req, res) => res.redirect("/")
)

// User login callback
router.get(
  "/login-callback",
  passport.authenticate("oidc", {
    successRedirect: "/",
    failureRedirect: "/api/login",
  })
)

// User logout
router.post('/logout', (req, res) => {
  console.log('Logging out');
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      res.redirect('/');
    });
  });
});

// Check login status
router.get('/status', (req, res) => {
  console.log('Checking login status');
  console.log(req.session);
  if (req.session && req.session.passport && req.session.passport.user) {
    return res.json({ isLoggedIn: true, userId: req.session.passport.user.id });
  } else {
    return res.json({ isLoggedIn: false });
  }
});

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/:userId', isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.session.passport.user.id) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;