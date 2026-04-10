import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  name: string;
  importUnit: string;
  exportUnit: string;
  conversionRate: number;
  barcode: string;
  minStock: number;
  maxStock: number;
  category: string;
  price: number;
}

const ProductSchema: Schema = new Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  importUnit: { type: String, required: true, default: "Thùng" },
  exportUnit: { type: String, required: true, default: "Cái" },
  conversionRate: { type: Number, required: true, default: 1 },
  barcode: { type: String },
  minStock: { type: Number, default: 0 },
  maxStock: { type: Number, default: 0 },
  category: { type: String },
  price: { type: Number, default: 500000 }
}, {
  timestamps: true
});

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
