import React from 'react';
import Button from '../atoms/Button';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show max 5 page numbers at once

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
        // Show pages 1 through 4
      } 
      // Adjust if we're near the end
      else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
        // Show the last 4 pages
      }
      
      // Add ellipsis after page 1 if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-4 w-full">
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <Button
          className="px-3 py-2 rounded-md flex items-center justify-center"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          kind="tertiary"
          aria-label="Previous page"
        >
          <IoChevronBack className={currentPage === 1 ? "text-gray-400" : "text-primary"} />
        </Button>
        
        {/* Page numbers */}
        <div className="hidden sm:flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={`
                  w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium
                  ${currentPage === page 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'}
                `}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Mobile view - current/total */}
        <div className="sm:hidden text-sm text-gray-700">
          <span>{currentPage}</span> / <span>{totalPages}</span>
        </div>
        
        {/* Next button */}
        <Button
          className="px-3 py-2 rounded-md flex items-center justify-center"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          kind="tertiary"
          aria-label="Next page"
        >
          <IoChevronForward className={currentPage === totalPages ? "text-gray-400" : "text-primary"} />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;