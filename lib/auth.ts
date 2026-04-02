import type { User } from '@supabase/supabase-js';

const ADMIN_ROLE = 'admin';

function getRoleFromObject(obj: unknown): string | undefined {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }
  const record = obj as Record<string, unknown>;

  if (typeof record.role === 'string') {
    return record.role;
  }
  if (typeof record['app_metadata'] === 'object') {
    const nested = record['app_metadata'] as Record<string, unknown>;
    if (typeof nested.role === 'string') {
      return nested.role;
    }
  }
  if (typeof record['raw_app_meta_data'] === 'object') {
    const nested = record['raw_app_meta_data'] as Record<string, unknown>;
    if (typeof nested.role === 'string') {
      return nested.role;
    }
  }
  if (typeof record['raw_user_meta_data'] === 'object') {
    const nested = record['raw_user_meta_data'] as Record<string, unknown>;
    if (typeof nested.role === 'string') {
      return nested.role;
    }
  }
  if (typeof record['user_metadata'] === 'object') {
    const nested = record['user_metadata'] as Record<string, unknown>;
    if (typeof nested.role === 'string') {
      return nested.role;
    }
  }

  return undefined;
}

export function hasAdminRole(metadata: unknown): boolean {
  const role = getRoleFromObject(metadata);
  return role === ADMIN_ROLE;
}

function getUserMetadata(user: User | null): Record<string, unknown> {
  if (!user) {
    return {};
  }
  return user as unknown as Record<string, unknown>;
}

export function isAdminUser(user: User | null): boolean {
  if (!user) {
    return false;
  }

  const userMetadata = getUserMetadata(user);
  return (
    hasAdminRole(userMetadata['app_metadata']) ||
    hasAdminRole(userMetadata['raw_app_meta_data']) ||
    hasAdminRole(userMetadata['user_metadata']) ||
    hasAdminRole(userMetadata['raw_user_meta_data'])
  );
}

export function isAdminUserPayload(user: Record<string, unknown> | null): boolean {
  if (!user) {
    return false;
  }

  return (
    hasAdminRole(user['app_metadata']) ||
    hasAdminRole(user['raw_app_meta_data']) ||
    hasAdminRole(user['user_metadata']) ||
    hasAdminRole(user['raw_user_meta_data'])
  );
}
