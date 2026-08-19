import React from 'react';

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
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
             </svg>
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
            className="bg-white border-2 border-black p-1 hover:bg-gray-200 transition-colors"
            title="Download"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          {handleDelete && (
            <button 
              onClick={() => handleDelete(file._id)}
              className="bg-red-500 text-white border-2 border-black p-1 hover:bg-red-600 transition-colors"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileCard;
