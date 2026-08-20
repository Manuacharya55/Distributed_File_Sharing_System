import React, { useState, useRef } from 'react';
import { postMultipartRequest } from '../../api/api';

const ImageComponent = ({ folderId, onUploadSuccess, onCancel }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  const fileExtension = [".jpeg", ".jpg", ".png", ".gif", ".txt", ".docx", ".pdf", ".xlsx"];
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newUrls]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]);
    setSelectedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async() => {
    if (selectedImages.length === 0) {
      alert('Please select at least one file to upload.');
      return;
    }
    const formImageData = new FormData();
    selectedImages.forEach((file) => {
      formImageData.append("files", file);
    });
    if (folderId) {
      formImageData.append("folder", folderId);
    }
    const response = await postMultipartRequest("/file/", formImageData);
    
    if (response?.success === false) {
      alert(response.message || "Failed to upload files.");
      return;
    }

    setSelectedImages([]);
    setPreviewUrls([]);
    if (onUploadSuccess) onUploadSuccess(response?.data);
  };

  return (
    <div className="max-w-5xl mx-auto my-12 bg-white border-4 border-black shadow-[12px_12px_0_0_#000] p-8 md:p-12 relative">
      {onCancel && (
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 bg-white border-2 border-black p-2 hover:bg-gray-200 transition-colors shadow-[2px_2px_0_0_#000] z-50"
          title="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      <div className="mb-12 text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-black uppercase mb-4 inline-block hover:-rotate-1 transition-transform">
          Upload Files
        </h2>
        <br/>
        <p className="text-lg font-bold bg-[#FF90E8] border-2 border-black px-4 py-2 shadow-[4px_4px_0_0_#000] inline-block uppercase">
          Drop 'em here.
        </p>
      </div>
      
      <div 
        className="relative z-10 flex flex-col items-center justify-center p-16 border-4 border-dashed border-black bg-[#f8f9fa] hover:bg-[#FFC900] transition-colors duration-300 cursor-pointer group shadow-inner" 
        onClick={() => fileInputRef.current.click()}
      >
        <div className="w-20 h-20 mb-6 bg-white border-4 border-black flex items-center justify-center text-black shadow-[6px_6px_0_0_#000] group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:shadow-[12px_12px_0_0_#000] group-hover:-rotate-12 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="text-2xl font-black text-black uppercase mb-3 text-center">
          Click to browse or drag & drop
        </div>
        <p className="text-sm font-bold bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0_0_#000] uppercase">Max 10MB per file</p>
        
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept={`${fileExtension.join(", ")}`}
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>

      {previewUrls.length > 0 && (
        <div className="mt-16 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
            <h3 className="text-3xl font-black text-black uppercase">
              Preview
            </h3>
            <span className="text-sm font-bold bg-black text-white px-4 py-2 uppercase shadow-[4px_4px_0_0_#FF90E8]">
              {previewUrls.length} file{previewUrls.length !== 1 && 's'} selected
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {selectedImages.map((file, index) => {
              const isImage = file.type.startsWith('image/');
              const url = previewUrls[index];

              return (
                <div key={index} className="relative group overflow-hidden bg-white aspect-square border-4 border-black shadow-[6px_6px_0_0_#000] flex items-center justify-center hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#000] transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                    className="absolute top-2 right-2 z-20 bg-[#FF90E8] border-2 border-black text-black hover:bg-black hover:text-white p-1.5 shadow-[2px_2px_0_0_#000] opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200 focus:outline-none"
                    title="Remove file"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {isImage ? (
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 absolute inset-0"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center z-10 w-full h-full relative group-hover:scale-110 transition-transform duration-300 bg-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-black mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs font-black text-black truncate w-full px-2 mb-2">{file.name}</span>
                      <span className="text-[10px] font-bold text-black uppercase bg-[#00FF00] border-2 border-black px-2 py-0.5 shadow-[2px_2px_0_0_#000]">{file.name.split('.').pop()}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-end mt-12 pt-8 border-t-4 border-black">
            <button 
              onClick={(e) => { e.stopPropagation(); handleUpload(); }}
              className="px-10 py-4 bg-[#00FF00] text-black border-4 border-black font-black uppercase text-2xl shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_#000] active:shadow-none active:translate-y-[6px] active:translate-x-[6px] transition-all flex items-center gap-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageComponent;
