import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAsset } from './Asset';

export interface IAssetAllocation extends Document {
  assetId: mongoose.Types.ObjectId | IAsset;
  assignedTo: string;
  assignedDate: Date;
  returnedDate?: Date;
  condition: string;
}

const AssetAllocationSchema: Schema = new Schema({
  assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  assignedTo: { type: String, required: true },
  assignedDate: { type: Date, required: true, default: Date.now },
  returnedDate: { type: Date },
  condition: { type: String, default: 'Good' }
}, {
  timestamps: true
});

export const AssetAllocation: Model<IAssetAllocation> = mongoose.models.AssetAllocation || mongoose.model<IAssetAllocation>('AssetAllocation', AssetAllocationSchema);
