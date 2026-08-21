import React from 'react';
import { FileText, Download, Trash2 } from 'lucide-react';

const getFileColor = (index) => {
  const colors = ['bg-[#FF90E8]', 'bg-[#FFC900]', 'bg-[#00FF00]', 'bg-[#8A2BE2]', 'bg-cyan-300', 'bg-red-400'];
  return colors[index % colors.length];
};

const FileCard = ({ file, index, handleDownload, handleDelete }) => {
  let displayFileName = 'Unknown File';
  let downloadFileName = 'download';
  if (file.key) {
     const keyParts = file.key.split('/');
     downloadFileName = keyParts[keyParts.length - 1]; // e.g. 12345-userId-image.jpg
     const nameParts = downloadFileName.split('-');
     displayFileName = nameParts.length > 2 ? nameParts.slice(2).join('-') : downloadFileName;
  } else if (file.fileUrl) {
     downloadFileName = file.fileUrl.split('/').pop();
     displayFileName = downloadFileName;
  }

  return (
    <div 
      className={`group ${getFileColor(index)} border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0_0_#000] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0_0_#000] active:shadow-none active:translate-y-[8px] active:translate-x-[8px] transition-all relative block`}
    >
      <div className="mb-6 flex justify-center">
         <div className="w-20 h-20 bg-white border-4 border-black flex items-center justify-center text-black shadow-[4px_4px_0_0_#000] group-hover:rotate-12 group-hover:scale-110 transition-transform overflow-hidden">
           {file.mimeType && file.mimeType.includes('image') ? (
             <img src={file.fileUrl} alt={displayFileName} className="w-full h-full object-cover" />
           ) : (
             <FileText className="h-10 w-10 stroke-[2.5]" />
           )}
         </div>
      </div>
      
      <div className="text-center mb-6 overflow-hidden">
        <h3 className="text-xl font-black text-black uppercase mb-2 truncate" title={displayFileName}>
          {displayFileName}
        </h3>
        <span className="text-sm font-bold text-black bg-white border-2 border-black px-2 py-1 uppercase shadow-[2px_2px_0_0_#000]">
          {(file.size / 1024).toFixed(2)} KB
        </span>
      </div>
      
      <div className="w-full pt-4 border-t-4 border-black mt-auto flex justify-between items-center">
        <span className="text-xs font-black uppercase bg-black text-white px-2 py-1">
          {file.extension || 'FILE'}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={(e) => handleDownload(e, file.fileUrl, downloadFileName)}
            className="bg-white border-2 border-black p-1.5 hover:bg-gray-200 transition-colors cursor-pointer"
            title="Download"
          >
            <Download className="h-4 w-4 stroke-[3]" />
          </button>
          {handleDelete && (
            <button 
              onClick={() => handleDelete(file._id)}
              className="bg-red-500 text-white border-2 border-black p-1.5 hover:bg-red-600 transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-4 w-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileCard;
