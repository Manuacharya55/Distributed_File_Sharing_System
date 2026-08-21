import React, { useState, useRef } from 'react';
import { postRequest, uploadToS3PresignedUrl } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { UploadCloud, X, FileText, Loader2 } from 'lucide-react';
import Button from './Button';

const ImageComponent = ({ folderId, onUploadSuccess, onCancel }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newUrls]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]);
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.warning('Please select at least one file to upload.');
      return;
    }
    if (isUploading) return;

    setIsUploading(true);
    const uploadedDocs = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // 1. Get Presigned S3 PUT URL from Backend
        const presignedResponse = await postRequest("/file/presigned-url", {
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          folder: folderId || null,
        });

        const { presignedUrl, key } = presignedResponse.data;

        // 2. Direct Browser-to-S3 Upload with Progress tracking
        await uploadToS3PresignedUrl(presignedUrl, file, (percent) => {
          setUploadProgress((prev) => ({ ...prev, [i]: percent }));
        });

        // 3. Confirm upload and save metadata to MongoDB
        const confirmResponse = await postRequest("/file/confirm-upload", {
          key,
          originalName: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          folder: folderId || null,
        });

        uploadedDocs.push(confirmResponse.data);
      }

      toast.success(`${uploadedDocs.length} file(s) uploaded directly to S3!`);
      setSelectedFiles([]);
      setPreviewUrls([]);
      setUploadProgress({});
      if (onUploadSuccess) onUploadSuccess(uploadedDocs);
    } catch (error) {
      toast.error(error.message || "Upload failed. Please check storage quota or try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-12 bg-white border-4 border-black shadow-[12px_12px_0_0_#000] p-8 md:p-12 relative">
      {onCancel && (
        <button 
          onClick={onCancel}
          disabled={isUploading}
          className="absolute top-4 right-4 bg-white border-2 border-black p-2 hover:bg-gray-200 transition-colors shadow-[2px_2px_0_0_#000] z-50 cursor-pointer disabled:opacity-50"
          title="Close"
        >
          <X className="h-6 w-6 stroke-[3]" />
        </button>
      )}
      
      <div className="mb-12 text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-black uppercase mb-4 inline-block hover:-rotate-1 transition-transform">
        Upload Your Files
        </h2>
        <br/>
      </div>
      
      <div 
        className="relative z-10 flex flex-col items-center justify-center p-16 border-4 border-dashed border-black bg-[#f8f9fa] hover:bg-[#FFC900] transition-colors duration-300 cursor-pointer group shadow-inner" 
        onClick={() => !isUploading && fileInputRef.current.click()}
      >
        <div className="w-20 h-20 mb-6 bg-white border-4 border-black flex items-center justify-center text-black shadow-[6px_6px_0_0_#000] group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:shadow-[12px_12px_0_0_#000] group-hover:-rotate-12 transition-all duration-300">
          <UploadCloud className="h-10 w-10 stroke-[2.5]" />
        </div>
        <div className="text-2xl font-black text-black uppercase mb-3 text-center">
          Click to browse or drag & drop files
        </div>
        
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          onChange={handleFileChange} 
          className="hidden" 
          disabled={isUploading}
        />
      </div>

      {previewUrls.length > 0 && (
        <div className="mt-16 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
            <h3 className="text-3xl font-black text-black uppercase">
              Selected Files ({selectedFiles.length})
            </h3>
            <span className="text-sm font-bold bg-black text-white px-4 py-2 uppercase shadow-[4px_4px_0_0_#FF90E8]">
              Total: {(selectedFiles.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {selectedFiles.map((file, index) => {
              const isImage = file.type.startsWith('image/');
              const url = previewUrls[index];
              const progress = uploadProgress[index] || 0;

              return (
                <div key={index} className="relative group overflow-hidden bg-white aspect-square border-4 border-black shadow-[6px_6px_0_0_#000] flex items-center justify-center hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#000] transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                    disabled={isUploading}
                    className="absolute top-2 right-2 z-20 bg-[#FF90E8] border-2 border-black text-black hover:bg-black hover:text-white p-1.5 shadow-[2px_2px_0_0_#000] opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200 focus:outline-none cursor-pointer"
                    title="Remove file"
                  >
                    <X className="h-4 w-4 stroke-[3]" />
                  </button>
                  {isImage ? (
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 absolute inset-0"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center z-10 w-full h-full relative group-hover:scale-110 transition-transform duration-300 bg-white">
                      <FileText className="h-10 w-10 text-black mb-3 stroke-[2]" />
                      <span className="text-xs font-black text-black truncate w-full px-2 mb-2">{file.name}</span>
                      <span className="text-[10px] font-bold text-black uppercase bg-[#00FF00] border-2 border-black px-2 py-0.5 shadow-[2px_2px_0_0_#000]">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  )}

                  {/* Uploading progress overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/75 z-30 flex flex-col items-center justify-center p-3 text-white">
                      <Loader2 className="w-6 h-6 animate-spin stroke-[2.5] mb-2 text-[#00FF00]" />
                      <span className="font-mono text-xs font-black">{progress}%</span>
                      <div className="w-full bg-white/30 h-1.5 mt-2 border border-black">
                        <div className="bg-[#00FF00] h-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-end mt-12 pt-8 border-t-4 border-black">
            <Button
              name={isUploading ? "Uploading to S3..." : "Upload to Cloud"}
              isProcessing={isUploading}
              handleClick={handleUpload}
              type="button"
              className="w-auto px-10 py-4 text-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageComponent;
