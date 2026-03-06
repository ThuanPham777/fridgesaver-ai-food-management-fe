import type { UserRole } from './auth.types';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export type Theme = 'light' | 'dark' | 'system';

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  sortBy: string;
  sortOrder: SortOrder;
}

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  allowedRoles?: UserRole[];
  isPublic?: boolean;
}
