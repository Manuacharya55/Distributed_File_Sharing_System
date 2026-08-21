import React from 'react';
import { Search } from 'lucide-react';

const SeacrhBox = ({ handleSearch, searchQuery, setSearchQuery }) => {
  return (
    <form onSubmit={handleSearch} className="flex w-full md:w-auto shadow-[6px_6px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all">
      <input 
        type="text" 
        placeholder="Search files..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-64 border-4 border-black p-3 text-lg font-bold focus:outline-none"
      />
      <button 
        type="submit"
        className="px-4 py-3 bg-cyan-300 text-black border-y-4 border-r-4 border-black font-black uppercase text-lg flex items-center gap-2 cursor-pointer hover:bg-cyan-400 transition-colors"
      >
        <Search className="w-5 h-5 stroke-[2.5]" />
        Search
      </button>
    </form>
  );
};

export default SeacrhBox;
