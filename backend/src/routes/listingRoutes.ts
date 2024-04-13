import express from 'express';
import Listing from '../models/Listing';
import User from '../models/User';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

// Get featured listings
router.get('/featured', async (req, res) => {
  try {
    const featuredListings = await Listing.find({ featured: true, sold: false }).limit(12);
    res.json(featuredListings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific listing
router.get('/:listingId', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId).populate(
      'seller',
      'name email itemsSold photo preferredContact'
    );
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all listings
router.get('/', async (req, res) => {
  try {
    // Default values are strings, parse them as numbers
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const category = req.query.category as string;
    const searchTerm = req.query.searchTerm as string;
    const sellerId = req.query.seller as string;

    const query: { category?: string, title?: { $regex: string, $options: string }, seller?: string  } = {};

    if (category) {
      query.category = category;
    }

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: 'i' };
    }

    if (sellerId) {
      query.seller = sellerId;
    }

    const listings = await Listing.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('seller', 'name email');

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new listing
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const listing = new Listing({
      ...req.body,
      seller: req.session.passport.user.id,
    });
    await listing.save();

    // Update the user's activeListings field
    const user = await User.findById(req.session.passport.user.id);
    if (user) {
      user.activeListings += 1;
      await user.save();
    }

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark a listing as sold
router.put('/:listingId/sold', isAuthenticated, async (req, res) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.listingId,
      seller: req.session.passport.user.id,
    });
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    listing.sold = true;
    await listing.save();

    // Update the user's itemsSold and activeListings fields
    const user = await User.findById(req.session.passport.user.id);
    if (user) {
      user.itemsSold += 1;
      user.activeListings -= 1;
      await user.save();
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a listing
router.put('/:listingId', isAuthenticated, async (req, res) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.listingId,
      seller: req.session.passport.user.id,
    });
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    Object.assign(listing, req.body);
    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a listing
router.delete('/:listingId', isAuthenticated, async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({
      _id: req.params.listingId,
      seller: req.session.passport.user.id,
    });
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    // Update the user's activeListings field
    const user = await User.findById(req.session.passport.user.id);
    if (user) {
      user.activeListings += 1;
      await user.save();
    }

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;