import React, { useEffect, useState } from 'react';
import { getRequest, deleteRequest } from '../../../api/api';
import ImageComponent from '../../../components/shared/ImageComponent';

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchFiles = async (currentPage = page) => {
    try {
      setLoading(true);
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
      const url = `/file?page=${currentPage}${searchParam}`;
      const response = await getRequest(url);
      if (response && response.data && response.data.files) {
          setFiles(response.data.files);
          setPagination(response.data.pagination);
      }
    } catch (err) {
      setError("Failed to fetch files.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchFiles(1);
  };

  const handlePrevious = () => {
    if (pagination?.hasPreviousPage) {
      const newPage = page - 1;
      setPage(newPage);
      fetchFiles(newPage);
    }
  };

  const handleNext = () => {
    if (pagination?.hasNextPage) {
      const newPage = page + 1;
      setPage(newPage);
      fetchFiles(newPage);
    }
  };

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    fetchFiles();
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await deleteRequest(`/file/${fileId}`);
      fetchFiles(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete file:", err);
      alert("Failed to delete file.");
    }
  };

  const getFileColor = (index) => {
    const colors = ['bg-[#FF90E8]', 'bg-[#FFC900]', 'bg-[#00FF00]', 'bg-[#8A2BE2]', 'bg-cyan-300', 'bg-red-400'];
    return colors[index % colors.length];
  };

  const handleDownload = async (e, fileUrl, originalName) => {
    e.preventDefault();
    try {
      // Fetch the file to create a local blob for forcing the download
      const response = await fetch(fileUrl, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Ensure we use a valid filename with extension
      const safeFilename = originalName || fileUrl.split('/').pop() || 'download';
      link.setAttribute('download', safeFilename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Frontend download failed (Likely a CORS issue with the S3 bucket): ", error);
      alert("Download failed. Please ensure your AWS S3 bucket has CORS enabled for GET requests, or download the file manually from the new tab.");
      // Fallback: Open in a new tab if fetch fails
      const fallbackLink = document.createElement('a');
      fallbackLink.href = fileUrl;
      fallbackLink.target = '_blank';
      fallbackLink.download = originalName;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-500">
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
              className="px-4 py-3 bg-cyan-300 text-black border-y-4 border-r-4 border-black font-black uppercase text-lg"
            >
              Search
            </button>
          </form>

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

      {loading ? (
        <div className="text-3xl font-black uppercase text-center mt-20 animate-pulse">Loading files...</div>
      ) : error ? (
        <div className="text-2xl font-bold uppercase text-white bg-red-500 border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
          {error}
        </div>
      ) : files.length === 0 ? (
        <div className="text-3xl font-black uppercase text-center mt-20 p-12 bg-white border-4 border-black shadow-[12px_12px_0_0_#000]">
          No files found. Time to upload!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {files.map((file, index) => {
            // Extract filename from key since originalName might be stripped by Mongoose schema
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
              key={file._id}
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
                  <button 
                    onClick={() => handleDelete(file._id)}
                    className="bg-red-500 text-white border-2 border-black p-1 hover:bg-red-600 transition-colors"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )})}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && (pagination.hasNextPage || pagination.hasPreviousPage) && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button 
            onClick={handlePrevious}
            disabled={!pagination.hasPreviousPage}
            className={`px-6 py-3 border-4 border-black font-black uppercase shadow-[4px_4px_0_0_#000] transition-all ${!pagination.hasPreviousPage ? 'bg-gray-300 text-gray-500 shadow-none' : 'bg-white text-black hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-[4px] active:shadow-none'}`}
          >
            Previous
          </button>
          <span className="text-xl font-black bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0_0_#000]">
            Page {pagination.currentPage}
          </span>
          <button 
            onClick={handleNext}
            disabled={!pagination.hasNextPage}
            className={`px-6 py-3 border-4 border-black font-black uppercase shadow-[4px_4px_0_0_#000] transition-all ${!pagination.hasNextPage ? 'bg-gray-300 text-gray-500 shadow-none' : 'bg-[#00FF00] text-black hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-[4px] active:shadow-none'}`}
          >
            Next
          </button>
        </div>
      )}

      {/* Upload File Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
          <div className="w-full max-w-5xl">
            <ImageComponent 
              folderId={null} 
              onUploadSuccess={handleUploadSuccess} 
              onCancel={() => setIsUploadModalOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesPage;
