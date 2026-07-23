import { FeatureFlag } from '../models/FeatureFlag';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { getPagination, getPaginationMeta } from '../utils/pagination';

const keyRegex = /^[a-zA-Z0-9_-]+$/;

export const check = asyncHandler(async (req, res) => {
  const key = req.params.key as string;

  if (!key || !keyRegex.test(key)) {
    throw new AppError(400, 'Invalid or missing feature key');
  }

  const flag = await FeatureFlag.findOne({ orgId: req.orgId, key });

  if (!flag) {
    sendSuccess(res, { key, enabled: false, exists: false });
    return;
  }

  sendSuccess(res, { key: flag.key, enabled: flag.enabled, exists: true });
});

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { orgId: req.orgId };
  const total = await FeatureFlag.countDocuments(filter);
  const flags = await FeatureFlag.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
  sendPaginated(res, flags, getPaginationMeta(total, page, limit));
});

export const create = asyncHandler(async (req, res) => {
  const { key, enabled } = req.body;

  if (!key || !keyRegex.test(key)) {
    throw new AppError(400, 'Invalid key (alphanumeric, hyphens, underscores only)');
  }

  const existing = await FeatureFlag.findOne({ orgId: req.orgId, key });
  if (existing) {
    throw new AppError(409, 'A feature flag with this key already exists');
  }

  const flag = await FeatureFlag.create({ orgId: req.orgId, key, enabled });
  sendCreated(res, flag);
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { key, enabled } = req.body;

  if (key !== undefined && (!keyRegex.test(key))) {
    throw new AppError(400, 'Invalid key (alphanumeric, hyphens, underscores only)');
  }
  if (enabled !== undefined && typeof enabled !== 'boolean') {
    throw new AppError(400, 'enabled must be a boolean');
  }

  const flag = await FeatureFlag.findOne({ _id: id, orgId: req.orgId });
  if (!flag) {
    throw new AppError(404, 'Feature flag not found');
  }

  if (key !== undefined) flag.key = key;
  if (enabled !== undefined) flag.enabled = enabled;

  await flag.save();
  sendSuccess(res, flag);
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await FeatureFlag.findOneAndDelete({ _id: id, orgId: req.orgId });
  if (!result) {
    throw new AppError(404, 'Feature flag not found');
  }

  sendSuccess(res, { message: 'Deleted' });
});
