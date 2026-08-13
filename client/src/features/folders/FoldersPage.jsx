import React from 'react';
import { Link } from 'react-router-dom';

const FoldersPage = () => {
  const dummyFolders = [
    { id: '1', name: 'Work Projects', fileCount: 12, lastModified: '2 days ago', color: 'bg-[#FF90E8]' },
    { id: '2', name: 'Personal', fileCount: 5, lastModified: '1 week ago', color: 'bg-[#FFC900]' },
    { id: '3', name: 'Design Assets', fileCount: 48, lastModified: 'Yesterday', color: 'bg-[#00FF00]' },
    { id: '4', name: 'Financials 2026', fileCount: 8, lastModified: '3 hours ago', color: 'bg-white' },
    { id: '5', name: 'Vacation Photos', fileCount: 124, lastModified: '1 month ago', color: 'bg-cyan-300' },
    { id: '6', name: 'Code Backups', fileCount: 3, lastModified: 'Just now', color: 'bg-red-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-500">
      <div className="mb-16">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase mb-4 hover:rotate-1 transition-transform inline-block">
          Folders
        </h1>
        <br/>
        <p className="text-xl font-bold bg-[#FF90E8] border-2 border-black px-4 py-2 shadow-[4px_4px_0_0_#000] inline-block">
          Organize the chaos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {dummyFolders.map((folder) => (
          <Link 
            to={`/folders/${folder.id}`} 
            key={folder.id}
            className={`group ${folder.color} border-4 border-black p-6 flex flex-col items-center text-center shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_#000] active:shadow-none active:translate-y-[8px] active:translate-x-[8px] transition-all block`}
          >
            <div className="w-24 h-24 mb-6 bg-white border-4 border-black flex items-center justify-center text-black shadow-[4px_4px_0_0_#000] group-hover:rotate-12 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-black uppercase mb-2 underline decoration-4 decoration-transparent group-hover:decoration-black underline-offset-4">{folder.name}</h3>
            <p className="text-lg font-bold text-black uppercase bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0_0_#000] mb-6">{folder.fileCount} FILES</p>
            
            <div className="w-full pt-4 border-t-4 border-black mt-auto">
              <p className="text-sm text-black font-bold uppercase">Mod: {folder.lastModified}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FoldersPage;
