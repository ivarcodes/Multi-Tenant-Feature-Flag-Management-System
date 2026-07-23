interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

export function getPagination(query: Record<string, unknown>): PaginationQuery {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function getPaginationMeta(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
}
