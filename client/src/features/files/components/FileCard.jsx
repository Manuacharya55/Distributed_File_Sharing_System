import React from 'react';
import { FileText, Download, Trash2, Eye, Share2, Image as ImageIcon } from 'lucide-react';

const getFileColor = (index) => {
  const colors = ['bg-[#FF90E8]', 'bg-[#FFC900]', 'bg-[#00FF00]', 'bg-[#8A2BE2]', 'bg-cyan-300', 'bg-red-400'];
  return colors[index % colors.length];
};

const FileCard = ({ file, index, handleDownload, handleDelete, onPreview, onShare }) => {
  const displayFileName = file.originalName || 'Unknown File';
  const previewUrl = file.previewUrl || file.fileUrl;
  const isImage = file.mimeType && file.mimeType.startsWith('image');

  return (
    <div 
      className={`group ${getFileColor(index)} border-4 border-black p-5 flex flex-col justify-between shadow-[8px_8px_0_0_#000] hover:-translate-y-1.5 hover:-translate-x-1.5 hover:shadow-[12px_12px_0_0_#000] active:shadow-none active:translate-y-[6px] active:translate-x-[6px] transition-all relative block`}
    >
      {/* Thumbnail / Icon with click-to-preview */}
      <div 
        onClick={() => onPreview && onPreview(file)}
        className="mb-4 flex justify-center cursor-pointer"
        title="Click to preview"
      >
        <div className="w-20 h-20 bg-white border-4 border-black flex items-center justify-center text-black shadow-[4px_4px_0_0_#000] group-hover:scale-105 transition-transform overflow-hidden relative">
          {isImage && previewUrl ? (
            <img src={previewUrl} alt={displayFileName} className="w-full h-full object-cover" />
          ) : (
            <FileText className="h-10 w-10 stroke-[2.5]" />
          )}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
            <Eye className="w-6 h-6 stroke-[3]" />
          </div>
        </div>
      </div>
      
      {/* File Info */}
      <div className="text-center mb-4 overflow-hidden">
        <h3 className="text-lg font-black text-black uppercase mb-1.5 truncate" title={displayFileName}>
          {displayFileName}
        </h3>
        <span className="text-xs font-bold text-black bg-white border-2 border-black px-2 py-0.5 uppercase shadow-[2px_2px_0_0_#000]">
          {(file.size / 1024).toFixed(2)} KB
        </span>
      </div>
      
      {/* Action Buttons */}
      <div className="w-full pt-3 border-t-4 border-black mt-auto flex justify-between items-center gap-1">
        <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-1 truncate max-w-[60px]">
          {file.extension || 'FILE'}
        </span>
        
        <div className="flex gap-1.5 items-center">
          {onPreview && (
            <button 
              onClick={() => onPreview(file)}
              className="bg-white border-2 border-black p-1.5 hover:bg-gray-100 transition-colors cursor-pointer shadow-[2px_2px_0_0_#000]"
              title="Preview File"
            >
              <Eye className="h-4 w-4 stroke-[2.5]" />
            </button>
          )}

          {onShare && (
            <button 
              onClick={() => onShare(file)}
              className="bg-[#FFC900] border-2 border-black p-1.5 hover:bg-yellow-400 transition-colors cursor-pointer shadow-[2px_2px_0_0_#000]"
              title="Share File"
            >
              <Share2 className="h-4 w-4 stroke-[2.5]" />
            </button>
          )}

          <button 
            onClick={(e) => handleDownload(e, file.downloadUrl || previewUrl, displayFileName)}
            className="bg-white border-2 border-black p-1.5 hover:bg-gray-100 transition-colors cursor-pointer shadow-[2px_2px_0_0_#000]"
            title="Download File"
          >
            <Download className="h-4 w-4 stroke-[2.5]" />
          </button>

          {handleDelete && (
            <button 
              onClick={() => handleDelete(file._id)}
              className="bg-red-500 text-white border-2 border-black p-1.5 hover:bg-red-600 transition-colors cursor-pointer shadow-[2px_2px_0_0_#000]"
              title="Move to Trash"
            >
              <Trash2 className="h-4 w-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileCard;
