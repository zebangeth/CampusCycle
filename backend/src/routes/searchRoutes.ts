import express from 'express';
import Listing from '../models/Listing';

const router = express.Router();

interface Query {
  title?: { $regex: string, $options: string };
  category?: string;
  price?: { $gte?: string, $lte?: string };
  condition?: string;
}

// Search listings
router.get('/', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, condition } = req.query;

    const query: any = { sold: false }; // Exclude sold items

    if (q) {
      query.title = { $regex: q as string, $options: 'i' };
    }

    if (category) {
      query.category = category as string;
    }

    if (minPrice && maxPrice) {
      query.price = { $gte: minPrice as string, $lte: maxPrice as string };
    } else if (minPrice) {
      query.price = { $gte: minPrice as string };
    } else if (maxPrice) {
      query.price = { $lte: maxPrice as string };
    }

    if (condition) {
      query.condition = condition as string;
    }

    const listings = await Listing.find(query).populate('seller', 'name email');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
