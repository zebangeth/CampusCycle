import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  joinedDate: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  joinedDate: { type: Date, default: Date.now } // Automatically set to the current date
});

export default mongoose.model<IUser>('User', UserSchema);
