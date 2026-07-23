import { Document } from 'mongoose';

export type UserRole = 'super_admin' | 'admin' | 'user';

export interface IOrganization extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  orgId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFeatureFlag extends Document {
  orgId: string;
  key: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
