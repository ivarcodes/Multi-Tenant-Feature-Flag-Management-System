import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendCreated } from '../utils/response';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { config } from '../config';
import { UserRole } from '../types/models';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COOKIE_OPTIONS = { httpOnly: true, sameSite: 'lax' as const, path: '/' };

function setTokenCookie(res: Response, token: string): void {
  res.cookie('token', token, COOKIE_OPTIONS);
}

export const signup = asyncHandler(async (req, res) => {
  const { email, password, orgId, role } = req.body;

  if (!email || !password || !orgId || !role) {
    throw new AppError(400, 'email, password, orgId, and role are required');
  }
  if (!emailRegex.test(email)) {
    throw new AppError(400, 'Invalid email format');
  }
  if (password.length < 6) {
    throw new AppError(400, 'Password must be at least 6 characters');
  }
  if (role !== 'admin' && role !== 'user') {
    throw new AppError(400, 'role must be admin or user');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError(409, 'A user with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, orgId, role });

  const token = generateToken({ userId: user.id, orgId: user.orgId, role: user.role });
  setTokenCookie(res, token);
  sendCreated(res, { role: user.role });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, 'email and password are required');
  }

  if (email === config.superAdmin.email) {
    if (password !== config.superAdmin.password) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = generateToken({
      userId: 'super-admin',
      orgId: undefined,
      role: config.superAdmin.role as UserRole,
    });
    setTokenCookie(res, token);
    sendSuccess(res, { role: config.superAdmin.role });
    return;
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    throw new AppError(401, 'Invalid email or password');
  }

  const token = generateToken({ userId: user.id, orgId: user.orgId, role: user.role });
  setTokenCookie(res, token);
  sendSuccess(res, { role: user.role });
});

export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, { userId: req.userId, orgId: req.orgId, role: req.role });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token', { path: '/' });
  sendSuccess(res, { message: 'Logged out' });
});
