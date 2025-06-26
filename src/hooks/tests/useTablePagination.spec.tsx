import { useTablePagination } from '@/hooks/useTablePagination';
import { act, renderHook } from '@testing-library/react';

describe('useTablePagination Hook', () => {
  it('✔️ Should initialize with default values', () => {
    const { result } = renderHook(() => useTablePagination({}));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.itemsPerPage).toBe(20);
  });

  it('✔️ Should initialize with custom values', () => {
    const { result } = renderHook(() =>
      useTablePagination({ initialPage: 3, initialItemsPerPage: 50 })
    );

    expect(result.current.currentPage).toBe(3);
    expect(result.current.itemsPerPage).toBe(50);
  });

  it('✔️ Should update the current page when `handlePageChange` is called', () => {
    const { result } = renderHook(() => useTablePagination({}));

    act(() => {
      result.current.handlePageChange(5);
    });

    expect(result.current.currentPage).toBe(5);
  });

  it('✔️ Should update items per page and reset page when `handleItemsPerPageChange` is called', () => {
    const { result } = renderHook(() => useTablePagination({ initialPage: 3 }));

    act(() => {
      result.current.handleItemsPerPageChange(100);
    });

    expect(result.current.itemsPerPage).toBe(100);
    expect(result.current.currentPage).toBe(1);
  });
});
