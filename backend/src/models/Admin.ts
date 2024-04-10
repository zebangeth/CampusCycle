import mongoose, { Document } from 'mongoose';

export interface IAdminUser extends Document {
  email: string;
  password: string;
}

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const AdminUser = mongoose.model<IAdminUser>('AdminUser', adminUserSchema);

export default AdminUser;