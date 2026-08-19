import React from 'react';
import SearchBox from './SeacrhBox';

const FilePageHeader = ({ handleSearch, searchQuery, setSearchQuery, setIsUploadModalOpen }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
      <div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase mb-4 hover:rotate-1 transition-transform inline-block">
          All Files
        </h1>
        <br/>
        <p className="text-xl font-bold bg-[#FFC900] border-2 border-black px-4 py-2 shadow-[4px_4px_0_0_#000] inline-block mb-4 md:mb-0">
          Welcome to the funk zone.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
        <SearchBox 
          handleSearch={handleSearch} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center justify-center px-8 py-4 bg-[#00FF00] text-black border-4 border-black font-black uppercase text-xl shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#000] active:shadow-none active:translate-y-[6px] active:translate-x-[6px] transition-all gap-3 w-full md:w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload
        </button>
      </div>
    </div>
  );
};

export default FilePageHeader;
