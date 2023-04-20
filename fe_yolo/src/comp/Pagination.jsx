import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage = 2, totalPages = 3, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPages); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (page) => {
    onPageChange(page);
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <button
        className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
        disabled={currentPage === 1}
        onClick={() => handleClick(currentPage - 1)}
      >
        <FaChevronLeft className="h-5 w-5 text-gray-600" />
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`mx-1 h-10 w-10 rounded-full flex items-center justify-center ${
            currentPage === page ? 'bg-green-300 text-green-600' : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
          }`}
          onClick={() => handleClick(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
        disabled={currentPage === totalPages}
        onClick={() => handleClick(currentPage + 1)}
      >
        <FaChevronRight className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
};

export default Pagination;
