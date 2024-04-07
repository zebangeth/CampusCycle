import express from 'express';
import Listing from '../models/Listing';

const router = express.Router();

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

// Create a new listing
router.post('/', async (req, res) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a listing
router.put('/:listingId', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.listingId,
      req.body,
      { new: true }
    );
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a listing
router.delete('/:listingId', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get featured listings
router.get('/featured', async (req, res) => {
  try {
    console.log("get featured listings:");
    const featuredListings = await Listing.find({ featured: true }).limit(10);
    console.log(featuredListings);
    res.json(featuredListings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;