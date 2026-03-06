import { useState, useCallback } from 'react';
import { PAGINATION_DEFAULTS } from '@/config/constants';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export function usePagination({
  initialPage = PAGINATION_DEFAULTS.PAGE,
  initialPageSize = PAGINATION_DEFAULTS.PAGE_SIZE,
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const goToPage = useCallback((p: number) => setPage(p), []);
  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);

  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
    setPage(1); // reset to first page on size change
  }, []);

  return { page, pageSize, goToPage, nextPage, prevPage, changePageSize };
}
