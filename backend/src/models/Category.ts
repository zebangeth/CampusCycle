import mongoose, { Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  icon: string;
}

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String },
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
