import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationProps {
  page: string;
  perPage: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
}

const Pagination = ({
  page,
  perPage,
  hasNextPage,
  hasPrevPage,
  totalPages,
}: PaginationProps) => {
  const pathname = usePathname();
  return (
    <div className="flex justify-center mt-8">
      <div className="flex space-x-2">
        <Link
          href={`${pathname}?page=${Number(page) - 1}&per_page=${perPage}`}
          className={`flex items-center px-4 py-2 rounded-l-md border border-tertiary bg-white hover:bg-tertiary transition-colors ${
            !hasPrevPage ? " cursor-not-allowed opacity-50" : ""
          }`}
        >
          <FaArrowLeft />
        </Link>
        {[...Array(totalPages)].map((_, index) => {
          const currentPage = index + 1;
          return (
            <Link
              href={`${pathname}?page=${currentPage}&per_page=${perPage}`}
              key={`page-${index}`}
              className={`px-4 py-2 border border-tertiary bg-white text-primary hover:bg-tertiary transition-colors ${
                Number(page) === currentPage ? "bg-tertiary font-semibold" : ""
              }`}
            >
              {currentPage}
            </Link>
          );
        })}
        <Link
          href={`${pathname}?page=${Number(page) + 1}&per_page=${perPage}`}
          className={`flex items-center px-4 py-2 rounded-r-md border border-tertiary bg-white hover:bg-tertiary transition-colors ${
            !hasNextPage ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Pagination;
