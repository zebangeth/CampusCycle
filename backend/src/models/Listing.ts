import mongoose, { Document } from 'mongoose';

export enum Condition {
  NEW = 'New',
  LIKE_NEW = 'Like New',
  USED = 'Used'
}

export interface IListing extends Document {
  title: string;
  description: string;
  images: string[];
  category: string;
  featured: boolean;
  price: number;
  condition: Condition;
  location: string;
  seller: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  sold: boolean;
}

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  featured: { type: Boolean, default: false},
  price: { type: Number, required: true },
  condition: { type: String, enum: Object.values(Condition), required: true },
  location: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  sold: { type: Boolean, default: false },
});

const Listing = mongoose.model<IListing>('Listing', listingSchema);

export default Listing;
