import express from 'express';
import Listing from '../models/Listing';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

// Get featured listings
router.get('/featured', async (req, res) => {
  try {
    const featuredListings = await Listing.find({ featured: true }).limit(12);
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
      'name email'
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

    const query: { category?: string, title?: { $regex: string, $options: string } } = {};

    if (category) {
      query.category = category;
    }

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: 'i' };
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
      seller: req.session.userId,
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a listing
router.put('/:listingId', isAuthenticated, async (req, res) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.listingId,
      seller: req.session.userId,
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
      seller: req.session.userId,
    });
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;