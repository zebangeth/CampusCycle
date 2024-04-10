import express from 'express';
import AdminUser from '../models/Admin';
import Listing from '../models/Listing';
import bcrypt from 'bcrypt';
import { isAdminAuthenticated } from '../middleware/adminAuthMiddleware';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminUser = await AdminUser.findOne({ email });
    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    req.session.adminUserId = adminUser._id;
    res.json({ message: 'Admin logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin logout
router.post('/logout', isAdminAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
    }
    res.json({ message: 'Admin logged out successfully' });
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