import express from 'express';
import User from '../models/User';

const router = express.Router();

// Get seller's contact information
router.get('/:sellerId', async (req, res) => {
  try {
    const seller = await User.findById(req.params.sellerId).select(
      'contactInfo'
    );
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }
    res.json(seller.contactInfo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
