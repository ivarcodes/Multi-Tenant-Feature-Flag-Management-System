import type { Organization, FeatureFlag } from '../types';

const BASE = '/api/v1';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, { credentials: 'include', ...options });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export function login(body: { email: string; password: string }) {
  return request<{ success: boolean; data: { role: string } }>('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

export function signup(body: { email: string; password: string; orgId: string; role: string }) {
  return request<{ success: boolean; data: { role: string } }>('/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

export function getOrganizations(params: { page?: number; limit?: number } = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  return request<{ success: boolean; data: Organization[]; pagination: { page: number; limit: number; total: number; pages: number } }>(`/organizations?${q}`);
}

export function createOrganization(body: { name: string }) {
  return request<{ success: boolean; data: Organization }>('/organizations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

export function getFlags(params: { page?: number; limit?: number } = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  return request<{ success: boolean; data: FeatureFlag[]; pagination: { page: number; limit: number; total: number; pages: number } }>(`/feature-flags?${q}`);
}

export function createFlag(body: { key: string }) {
  return request<{ success: boolean; data: FeatureFlag }>('/feature-flags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

export function updateFlag(id: string, body: { key?: string; enabled?: boolean }) {
  return request<{ success: boolean; data: FeatureFlag }>(`/feature-flags/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

export function deleteFlag(id: string) {
  return request<{ success: boolean; data: { message: string } }>(`/feature-flags/${id}`, { method: 'DELETE' });
}

export function checkFlag(key: string) {
  return request<{ success: boolean; data: { key: string; enabled: boolean; exists: boolean } }>(`/feature-flags/check/${key}`);
}

export function getMe() {
  return request<{ success: boolean; data: { userId: string; orgId?: string; role: string } }>('/auth/me');
}

export function logout() {
  return request<{ success: boolean; data: { message: string } }>('/auth/logout', { method: 'POST' });
}
