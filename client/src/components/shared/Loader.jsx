import React from 'react';

// Shimmer for Neo-Brutalism Cards (Stats, Files, Folders)
export const CardShimmer = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 w-full">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-gray-100 border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0_0_#000] animate-pulse min-h-[160px]">
          <div className="flex justify-between items-start mb-6">
             <div className="w-14 h-14 bg-gray-300 border-2 border-black shadow-[4px_4px_0_0_#000]"></div>
          </div>
          <div>
            <div className="h-10 bg-gray-300 w-1/2 mb-4 border-2 border-black"></div>
            <div className="h-6 bg-gray-300 w-3/4 border-2 border-black"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Shimmer for Neo-Brutalism Lists (Recent Activity)
export const ListShimmer = ({ count = 3 }) => {
  return (
    <div className="bg-white border-4 border-black shadow-[12px_12px_0_0_#000] w-full">
        <div className="px-8 py-6 border-b-4 border-black bg-gray-200 animate-pulse flex justify-between items-center">
          <div className="h-8 bg-gray-400 w-1/3 border-2 border-black"></div>
          <div className="h-8 bg-gray-300 w-1/6 border-2 border-black hidden md:block"></div>
        </div>
        <div className="divide-y-4 divide-black">
          {[...Array(count)].map((_, index) => (
            <div key={index} className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between animate-pulse">
              <div className="flex items-center gap-6 w-full mb-4 md:mb-0">
                <div className="w-4 h-4 bg-gray-400 rounded-full border-2 border-black"></div>
                <div className="h-6 bg-gray-300 w-1/2 max-w-[300px] border-2 border-black"></div>
              </div>
              <div className="h-8 bg-gray-300 w-32 md:w-48 border-2 border-black"></div>
            </div>
          ))}
        </div>
    </div>
  );
};

// Combined Shimmer for full Dashboard
export const DashboardShimmer = () => {
  return (
    <div className="w-full">
      <CardShimmer count={4} />
      <ListShimmer count={4} />
    </div>
  );
};

// Traditional spinner loader for buttons or small actions
export const ButtonLoader = ({ text = "Processing..." }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {text && <span className="font-bold uppercase tracking-wider">{text}</span>}
    </div>
  );
};
