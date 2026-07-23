import mongoose, { Schema } from 'mongoose';
import { IFeatureFlag } from '../types/models';

const featureFlagSchema = new Schema<IFeatureFlag>(
  {
    orgId: { type: String, required: true },
    key: { type: String, required: true },
    enabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

featureFlagSchema.index({ orgId: 1, key: 1 }, { unique: true });

export const FeatureFlag = mongoose.model<IFeatureFlag>('FeatureFlag', featureFlagSchema);
