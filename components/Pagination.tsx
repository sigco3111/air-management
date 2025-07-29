import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-4 px-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
      >
        이전
      </button>
      <span className="text-sm font-medium text-slate-300">
        페이지 {currentPage} / {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;
