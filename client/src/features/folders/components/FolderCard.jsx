import React from 'react';
import { Link } from 'react-router-dom';

const getFolderColor = (index) => {
  const colors = ['bg-[#FF90E8]', 'bg-[#FFC900]', 'bg-[#00FF00]', 'bg-cyan-300', 'bg-red-400', 'bg-white'];
  return colors[index % colors.length];
};

const FolderCard = ({ folder, index, openEditModal }) => {
  return (
    <Link 
      to={`/folders/${folder._id}`} 
      className={`group ${getFolderColor(index)} border-4 border-black p-6 flex flex-col items-center text-center shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_#000] active:shadow-none active:translate-y-[8px] active:translate-x-[8px] transition-all block relative`}
    >
      <button 
        onClick={(e) => openEditModal(e, folder)}
        className="absolute top-4 right-4 bg-white border-2 border-black p-2 hover:bg-gray-200 transition-colors shadow-[2px_2px_0_0_#000]"
        title="Edit Folder"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      <div className="w-24 h-24 mt-4 mb-6 bg-white border-4 border-black flex items-center justify-center text-black shadow-[4px_4px_0_0_#000] group-hover:rotate-12 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </div>
      <h3 className="text-2xl font-black text-black uppercase mb-4 underline decoration-4 decoration-transparent group-hover:decoration-black underline-offset-4 truncate w-full" title={folder.name}>
        {folder.name}
      </h3>
      
      <div className="w-full pt-4 border-t-4 border-black mt-auto">
        <p className="text-xs text-black font-bold uppercase">
          Created: {new Date(folder.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};

export default FolderCard;
