export interface Organization {
  _id: string; name: string; createdAt: string;
}
export interface FeatureFlag {
  _id: string; orgId: string; key: string; enabled: boolean; createdAt: string; updatedAt: string;
}
export interface PaginationMeta {
  page: number; limit: number; total: number; pages: number;
}
