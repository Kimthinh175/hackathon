import mongoose, { Schema, Document, Model } from 'mongoose';

export enum AssetStatus {
  IN_STOCK = 'IN_STOCK',
  IN_USE = 'IN_USE',
  LOST = 'LOST',
  MAINTENANCE = 'MAINTENANCE'
}

export interface IAsset extends Document {
  assetCode: string;
  name: string;
  purchasePrice: number;
  purchaseDate: Date;
  usefulLifeYears: number;
  currentStatus: AssetStatus;
}

const AssetSchema: Schema = new Schema({
  assetCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  purchasePrice: { type: Number, required: true },
  purchaseDate: { type: Date, required: true },
  usefulLifeYears: { type: Number, required: true, default: 5 },
  currentStatus: { type: String, enum: Object.values(AssetStatus), default: AssetStatus.IN_STOCK }
}, {
  timestamps: true
});

export const Asset: Model<IAsset> = mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);
