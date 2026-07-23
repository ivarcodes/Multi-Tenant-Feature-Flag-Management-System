import mongoose, { Schema } from 'mongoose';
import { IOrganization } from '../types/models';

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>('Organization', organizationSchema);
