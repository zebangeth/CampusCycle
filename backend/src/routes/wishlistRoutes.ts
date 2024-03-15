import express from 'express';
import Wishlist from '../models/Wishlist';

const router = express.Router();

// Get user's wishlist
router.get('/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.params.userId })
      .populate('listings')
      .populate('user', 'name email');
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a listing to user's wishlist
router.post('/:userId', async (req, res) => {
  try {
    const { listingId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.params.userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.params.userId });
    }
    wishlist.listings.addToSet(listingId);
    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove a listing from user's wishlist
router.delete('/:userId/:listingId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.params.userId },
      { $pull: { listings: req.params.listingId } },
      { new: true }
    );
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
