import { Response } from 'express';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function sendSuccess(res: Response, data: unknown, statusCode = 200): void {
  res.status(statusCode).json({ success: true, data });
}

export function sendPaginated(res: Response, data: unknown[], pagination: PaginationMeta): void {
  res.status(200).json({ success: true, data, pagination });
}

export function sendCreated(res: Response, data: unknown): void {
  res.status(201).json({ success: true, data });
}
