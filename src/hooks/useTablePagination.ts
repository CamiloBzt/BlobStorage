import { useState } from 'react';

interface UseTablePaginationProps {
  initialPage?: number;
  initialItemsPerPage?: number;
}

export const useTablePagination = ({
  initialPage = 1,
  initialItemsPerPage = 20,
}: UseTablePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return {
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
  };
};
