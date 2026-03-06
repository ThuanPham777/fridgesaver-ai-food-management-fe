// Standard API envelope returned by the backend
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: Pagination;
  message: string;
  success: boolean;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
