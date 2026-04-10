import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct } from './Product';
import { ILocation } from './Location';

export enum TransactionType {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT'
}

export interface ITransaction extends Document {
  type: TransactionType;
  productId: mongoose.Types.ObjectId | IProduct;
  quantity: number;
  fromLocationId?: mongoose.Types.ObjectId | ILocation;
  toLocationId?: mongoose.Types.ObjectId | ILocation;
  date: Date;
  note?: string;
  createdBy?: string;
}

const TransactionSchema: Schema = new Schema({
  type: { type: String, enum: Object.values(TransactionType), required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  fromLocationId: { type: Schema.Types.ObjectId, ref: 'Location' },
  toLocationId: { type: Schema.Types.ObjectId, ref: 'Location' },
  date: { type: Date, default: Date.now },
  note: { type: String },
  createdBy: { type: String }
}, {
  timestamps: true
});

export const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
