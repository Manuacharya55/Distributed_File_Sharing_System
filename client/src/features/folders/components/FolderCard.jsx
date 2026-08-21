import React from 'react';
import { Link } from 'react-router-dom';
import { Folder, Edit2, Trash2, Share2 } from 'lucide-react';

const getFolderColor = (index) => {
  const colors = ['bg-[#FF90E8]', 'bg-[#FFC900]', 'bg-[#00FF00]', 'bg-cyan-300', 'bg-red-400', 'bg-white'];
  return colors[index % colors.length];
};

const FolderCard = ({ folder, index, openEditModal, handleDelete }) => {
  return (
    <Link 
      to={`/folders/${folder._id}`} 
      className={`group ${getFolderColor(index)} border-4 border-black p-6 flex flex-col items-center text-center shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_#000] active:shadow-none active:translate-y-[8px] active:translate-x-[8px] transition-all block relative`}
    >
      <div className="absolute top-4 right-4 flex gap-1.5 z-20">
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEditModal(e, folder); }}
          className="bg-white text-black border-2 border-black p-1.5 hover:bg-gray-200 transition-colors shadow-[2px_2px_0_0_#000] cursor-pointer"
          title="Edit Folder"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(folder._id); }}
          className="bg-white text-black border-2 border-black p-1.5 hover:bg-red-500 hover:text-white transition-colors shadow-[2px_2px_0_0_#000] cursor-pointer"
          title="Delete Folder"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="w-24 h-24 mt-4 mb-6 bg-white border-4 border-black flex items-center justify-center text-black shadow-[4px_4px_0_0_#000] group-hover:rotate-12 transition-transform">
        <Folder className="h-12 w-12 stroke-[2.5]" />
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
