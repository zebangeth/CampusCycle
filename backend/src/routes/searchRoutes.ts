import express from 'express';
import Listing from '../models/Listing';

const router = express.Router();

// Search listings
router.get('/', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, condition } = req.query;
    const query = {};

    if (q) {
      query.title = { $regex: q, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice && maxPrice) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      query.price = { $gte: minPrice };
    } else if (maxPrice) {
      query.price = { $lte: maxPrice };
    }

    if (condition) {
      query.condition = condition;
    }

    const listings = await Listing.find(query).populate('seller', 'name email');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
