import { Organization } from '../models/Organization';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPagination, getPaginationMeta } from '../utils/pagination';

export const create = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new AppError(400, 'name is required');
  }

  const trimmed = name.trim();

  const existing = await Organization.findOne({ name: trimmed });
  if (existing) {
    throw new AppError(409, 'An organization with this name already exists');
  }

  const org = await Organization.create({ name: trimmed });
  sendCreated(res, { id: org.id, name: org.name });
});

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const total = await Organization.countDocuments();
  const orgs = await Organization.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const data = orgs.map(o => ({ id: o.id, name: o.name, createdAt: o.createdAt }));
  sendPaginated(res, data, getPaginationMeta(total, page, limit));
});
