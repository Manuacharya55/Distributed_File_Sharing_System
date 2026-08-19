import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRequest } from '../../../api/api';
import ImageComponent from '../../../components/shared/ImageComponent';
import SearchBox from '../components/SearchBox';
import FileCard from '../components/FileCard';
import { CardShimmer } from '../../../components/shared/Loader';
import Pagination from '../../../components/shared/Pagination';

const FolderDetailsPage = () => {
  const { folderId } = useParams();
  
  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchFolderDetails = async (currentPage = page) => {
    try {
      setLoading(true);
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
      const url = `/folder/${folderId}?page=${currentPage}${searchParam}`;
      const response = await getRequest(url);
      if (response && response.data) {
        setFolder(response.data.folder);
        setFiles(response.data.files || []);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError("Failed to fetch folder details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolderDetails(1);
  }, [folderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchFolderDetails(1);
  };

  const handlePrevious = () => {
    if (pagination?.hasPreviousPage) {
      const newPage = page - 1;
      setPage(newPage);
      fetchFolderDetails(newPage);
    }
  };

  const handleNext = () => {
    if (pagination?.hasNextPage) {
      const newPage = page + 1;
      setPage(newPage);
      fetchFolderDetails(newPage);
    }
  };


  const handleDownload = async (e, fileUrl, originalName) => {
    e.preventDefault();
    try {
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
      const safeFilename = originalName || fileUrl.split('/').pop() || 'download';
      link.setAttribute('download', safeFilename);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Frontend download failed (Likely a CORS issue with the S3 bucket): ", error);
      alert("Download failed. Please ensure your AWS S3 bucket has CORS enabled for GET requests, or download the file manually from the new tab.");
      const fallbackLink = document.createElement('a');
      fallbackLink.href = fileUrl;
      fallbackLink.target = '_blank';
      fallbackLink.download = originalName;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    }
  };

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    fetchFolderDetails();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <CardShimmer count={4} />
      </div>
    );
  }

  if (error) {
    return <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 text-2xl font-bold uppercase text-white bg-red-500 border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">{error}</div>;
  }

  const folderName = folder?.name || "Unknown Folder";

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-500 relative">
      
      {/* Breadcrumb / Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link to="/folders" className="inline-flex items-center text-sm font-black tracking-widest text-black hover:bg-[#FFC900] border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0_0_#000] px-4 py-2 transition-all mb-6 group uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Folders
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black uppercase mb-1">
                {folderName}
              </h1>
              <p className="text-sm font-bold bg-[#FF90E8] border-2 border-black inline-block px-3 py-1 shadow-[2px_2px_0_0_#000] uppercase">
                {files.length} items
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <SearchBox 
            handleSearch={handleSearch} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            placeholder="Search files..."
          />

          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center justify-center px-8 py-4 bg-[#00FF00] text-black border-4 border-black font-black uppercase text-xl shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#000] active:shadow-none active:translate-y-[6px] active:translate-x-[6px] transition-all gap-3 w-full md:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload File
          </button>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-3xl font-black uppercase text-center mt-20 p-12 bg-white border-4 border-black shadow-[12px_12px_0_0_#000]">
          This folder is empty. Time to upload!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {files.map((file, index) => (
            <FileCard 
              key={file._id} 
              file={file} 
              index={index} 
              handleDownload={handleDownload} 
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
              folderId={folderId} 
              onUploadSuccess={handleUploadSuccess} 
              onCancel={() => setIsUploadModalOpen(false)} 
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default FolderDetailsPage;
