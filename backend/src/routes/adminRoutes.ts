import express from 'express';
import passport from 'passport';
import AdminUser from '../models/Admin';
import Listing from '../models/Listing';
import { isAdminAuthenticated } from '../middleware/adminAuthMiddleware';

const router = express.Router();

// Admin login
router.get('/login', passport.authenticate('oidc', {
  successReturnToOrRedirect: "/"
}));

// Admin login callback
router.get('/login-callback', passport.authenticate('oidc', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/',
}));

// Admin logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.redirect('/');
  });
});

// Mark listing as featured
router.put('/listings/:listingId/featured', isAdminAuthenticated, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    listing.featured = true;
    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Force delete listing
router.delete('/listings/:listingId/force', isAdminAuthenticated, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ message: 'Listing force deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;