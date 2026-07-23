import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/models';

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    orgId: { type: String, required: true },
    role: { type: String, enum: ['super_admin', 'admin', 'user'], required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
