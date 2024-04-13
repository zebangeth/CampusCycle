import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  gitlabId: string;
  photo: string;
  tagline: string;
  joinedDate: Date;
  itemsSold: number;
  activeListings: number;
  contactInfo: {
    email: string;
    phoneNumber: string;
    whatsapp: string;
    wechat: string;
    telegram: string;
    snapchat: string;
    messenger: string;
  };
  preferredContact: string;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gitlabId: { type: String, required: true, unique: true },
  photo: { type: String },
  tagline: { type: String },
  joinedDate: { type: Date, default: Date.now },
  itemsSold: { type: Number, default: 0 },
  activeListings: { type: Number, default: 0 },
  contactInfo: {
    email: { type: String },
    phoneNumber: { type: String },
    whatsapp: { type: String },
    wechat: { type: String },
    telegram: { type: String },
    snapchat: { type: String },
    messenger: { type: String },
  },
  preferredContact: { type: String },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
