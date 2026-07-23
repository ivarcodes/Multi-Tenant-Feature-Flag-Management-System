import { UserRole } from './models';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    orgId?: string;
    role?: UserRole;
    id?: string;
  }
}
