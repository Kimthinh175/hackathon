import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct } from './Product';
import { ILocation } from './Location';

export interface IInventory extends Document {
  productId: mongoose.Types.ObjectId | IProduct;
  locationId: mongoose.Types.ObjectId | ILocation;
  quantity: number;
  batchNumber?: string;
  importDate: Date;
  expiryDate?: Date;
}

const InventorySchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  quantity: { type: Number, required: true, default: 0 },
  batchNumber: { type: String },
  importDate: { type: Date, default: Date.now },
  expiryDate: { type: Date }
}, {
  timestamps: true
});

export const Inventory: Model<IInventory> = mongoose.models.Inventory || mongoose.model<IInventory>('Inventory', InventorySchema);
