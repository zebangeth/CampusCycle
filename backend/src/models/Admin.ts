import mongoose, { Document } from 'mongoose';

export interface IAdminUser extends Document {
  email: string;
  gitlabId: string;
}

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  gitlabId: { type: String, required: true, unique: true },
});

const AdminUser = mongoose.model<IAdminUser>('AdminUser', adminUserSchema);

export default AdminUser;