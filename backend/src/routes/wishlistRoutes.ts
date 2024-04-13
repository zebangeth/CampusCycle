import express from 'express';
import Wishlist from '../models/Wishlist';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

// Get user's wishlist
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.session.passport.user.id })
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
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { listingId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.session.passport.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.session.passport.user.id });
      await wishlist.save();
    }
    
    // Use MongoDB's $addToSet to ensure no duplicates
    await Wishlist.updateOne(
      { _id: wishlist._id },
      { $addToSet: { listings: listingId } }
    );
    
    // Reload wishlist to reflect the update
    wishlist = await Wishlist.findOne({ user: req.session.passport.user.id })
      .populate('listings')
      .populate('user', 'name email');
    
    res.json(wishlist);    
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove a listing from user's wishlist
router.delete('/:listingId', isAuthenticated, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.session.passport.user.id },
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