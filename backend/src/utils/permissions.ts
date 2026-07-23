import { UserRole } from '../types/models';

interface Permission {
  action: string;
  resource: string;
}

const permissions: Record<UserRole, Permission[]> = {
  super_admin: [
    { action: 'create', resource: 'organization' },
    { action: 'read', resource: 'organization' },
    { action: 'manage', resource: 'system' },
  ],
  admin: [
    { action: 'create', resource: 'feature_flag' },
    { action: 'read', resource: 'feature_flag' },
    { action: 'update', resource: 'feature_flag' },
    { action: 'delete', resource: 'feature_flag' },
  ],
  user: [
    { action: 'check', resource: 'feature_flag' },
  ],
};

export function hasPermission(role: UserRole | undefined, action: string, resource: string): boolean {
  if (!role) return false;
  const rolePerms = permissions[role];
  return rolePerms.some(p => p.action === action && p.resource === resource);
}
