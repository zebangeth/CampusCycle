import express from 'express';
import passport from 'passport';
import AdminUser from '../models/Admin';
import Listing from '../models/Listing';
import { isAdminAuthenticated } from '../middleware/adminAuthMiddleware';

const router = express.Router();

// Check admin login status
router.get('/status', (req, res) => {
  if (req.session && req.session.passport && req.session.passport.user.role === 'admin') {
    return res.json({ isLoggedIn: true, isAdmin: true, userId: req.session.passport.user.id });
  } else if (req.session && req.session.passport) {
    return res.json({ isLoggedIn: true, isAdmin: false, userId: req.session.passport.user.id });
  } else {
    return res.json({ isLoggedIn: false });
  }
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