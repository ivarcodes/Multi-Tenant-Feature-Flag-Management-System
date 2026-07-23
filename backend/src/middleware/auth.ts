import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserRole } from '../types/models';

interface JwtPayload {
  userId: string;
  orgId?: string;
  role: UserRole;
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).json({ success: false, error: { message: 'Authentication required' } });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.userId = decoded.userId;
    req.orgId = decoded.orgId;
    req.role = decoded.role;
    next();
  } catch {
    res.status(401).json({ success: false, error: { message: 'Invalid or expired token' } });
  }
}

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.role || !allowedRoles.includes(req.role)) {
      res.status(403).json({ success: false, error: { message: 'Forbidden: insufficient role' } });
      return;
    }
    next();
  };
}
