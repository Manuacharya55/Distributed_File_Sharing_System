import React from 'react';

const Pagination = ({ pagination, handlePrevious, handleNext }) => {
  if (!pagination || (!pagination.hasNextPage && !pagination.hasPreviousPage)) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      <button 
        onClick={handlePrevious}
        disabled={!pagination.hasPreviousPage}
        className={`px-6 py-3 border-4 border-black font-black uppercase shadow-[4px_4px_0_0_#000] transition-all ${!pagination.hasPreviousPage ? 'bg-gray-300 text-gray-500 shadow-none' : 'bg-white text-black hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-[4px] active:shadow-none'}`}
      >
        Previous
      </button>
      <span className="text-xl font-black bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0_0_#000]">
        Page {pagination.currentPage}
      </span>
      <button 
        onClick={handleNext}
        disabled={!pagination.hasNextPage}
        className={`px-6 py-3 border-4 border-black font-black uppercase shadow-[4px_4px_0_0_#000] transition-all ${!pagination.hasNextPage ? 'bg-gray-300 text-gray-500 shadow-none' : 'bg-[#00FF00] text-black hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-[4px] active:shadow-none'}`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
