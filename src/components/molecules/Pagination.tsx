import React from 'react';
import Button from '../atoms/Button';
import { FcNext, FcPrevious } from 'react-icons/fc';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

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

  return (
    <div className="flex justify-between lg:w-[30%] w-full items-center mt-4">
      <Button
        className="px-4 py-2 rounded-lg"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        kind='tertiary'
        
      >
        <FcPrevious color='white' />
      </Button>
      <div className="text-sm text-gray-700 text-center">
        Page {currentPage} of {totalPages}
      </div>
      <Button
        className="px-4 py-2 bg-gray-200 rounded-lg"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        kind='tertiary'
      >
       <FcNext />
      </Button>
    </div>
  );
};

export default Pagination;