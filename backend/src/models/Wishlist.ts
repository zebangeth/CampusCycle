import mongoose, { Document } from 'mongoose';

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  listings: mongoose.Types.ObjectId[];
}

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
});

const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);

export default Wishlist;
