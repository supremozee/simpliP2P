import React from "react";
import Button from "../atoms/Button";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
  totalPages,
}) => {
  if (totalPages <= 1) return null;
  const getVisiblePageNumbers = () => {
    const pages = [];
    const maxButtons = 5;

    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-4">
      {/* Previous button */}
      <Button
        className="px-3 py-2 rounded-md"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        kind="tertiary"
        aria-label="Previous page"
      >
        <IoChevronBack
          className={currentPage === 1 ? "text-gray-400" : "text-primary"}
        />
      </Button>

      {/* Page numbers - desktop view */}
      <div className="hidden sm:flex mx-2">
        {getVisiblePageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-8 h-8 mx-1 flex items-center justify-center rounded-md
              ${
                currentPage === page
                  ? "bg-primary text-white"
                  : "#181819 hover:bg-gray-100"
              }
            `}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Mobile view */}
      <div className="sm:hidden mx-2 text-sm #181819">
        {currentPage} / {totalPages}
      </div>

      {/* Next button */}
      <Button
        className="px-3 py-2 rounded-md"
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        kind="tertiary"
        aria-label="Next page"
      >
        <IoChevronForward
          className={
            currentPage === totalPages ? "text-gray-400" : "text-primary"
          }
        />
      </Button>
    </div>
  );
};

export default Pagination;
