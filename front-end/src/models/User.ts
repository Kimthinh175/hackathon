import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  MANAGER = 'Manager',
  STAFF = 'Staff'
}

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  matchPassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.STAFF },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

UserSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
