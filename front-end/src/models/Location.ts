import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocation extends Document {
  warehouse: string;
  rack: string;
  tier: string;
  bin: string;
}

const LocationSchema: Schema = new Schema({
  warehouse: { type: String, required: true },
  rack: { type: String, required: true },
  tier: { type: String, required: true },
  bin: { type: String, required: true },
}, {
  timestamps: true
});

LocationSchema.index({ warehouse: 1, rack: 1, tier: 1, bin: 1 }, { unique: true });

export const Location: Model<ILocation> = mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);
