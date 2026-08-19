import React, { useEffect, useState } from 'react';
import { getRequest, deleteRequest } from '../../../api/api';
import ImageComponent from '../../../components/shared/ImageComponent';
import FileCard from '../components/FileCard';
import FilePageHeader from '../components/FilePageHeader';
import { CardShimmer } from '../../../components/shared/Loader';
import Pagination from '../../../components/shared/Pagination';

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
    const timeoutId = setTimeout(() => {
      fetchFiles(page);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (page !== 1) setPage(1);
    else fetchFiles(1);
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
      <FilePageHeader 
        handleSearch={handleSearch} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        setIsUploadModalOpen={setIsUploadModalOpen} 
      />

      {loading ? (
        <CardShimmer count={4} />
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
          {files.map((file, index) => (
            <FileCard 
              key={file._id} 
              file={file} 
              index={index} 
              handleDownload={handleDownload} 
              handleDelete={handleDelete} 
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination 
        pagination={pagination} 
        handlePrevious={handlePrevious} 
        handleNext={handleNext} 
      />

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
