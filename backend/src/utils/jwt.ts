import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserRole } from '../types/models';

export interface TokenPayload {
  userId: string;
  orgId?: string;
  role: UserRole;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
}
