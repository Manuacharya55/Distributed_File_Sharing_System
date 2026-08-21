import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRequest, deleteRequest } from '../../../api/api';
import ImageComponent from '../../../components/shared/ImageComponent';
import SearchBox from '../components/SearchBox';
import FileCard from '../../files/components/FileCard';
import FilePreviewModal from '../../files/components/FilePreviewModal';
import ShareModal from '../../files/components/ShareModal';
import { CardShimmer } from '../../../components/shared/Loader';
import Pagination from '../../../components/shared/Pagination';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import PendingState from '../../../components/shared/PendingState';
import ErrorState from '../../../components/shared/ErrorState';
import EmptyState from '../../../components/shared/EmptyState';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import { downloadFile } from '../../../utils/downloadFile';
import { useToast } from '../../../context/ToastContext';
import { ArrowLeft, Folder, UploadCloud, Share2 } from 'lucide-react';

const fetchFolderDetails = async (folderId, page, searchQuery) => {
  const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
  const url = `/folder/${folderId}?page=${page}${searchParam}`;
  const response = await getRequest(url);
  return response.data;
};

const FolderDetailsPage = () => {
  const { folderId } = useParams();
  const queryClient = useQueryClient();
  const toast = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['folderDetails', folderId, page, searchQuery],
    queryFn: () => fetchFolderDetails(folderId, page, searchQuery),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (page !== 1) setPage(1);
  };

  const handlePrevious = () => {
    if (data?.pagination?.hasPreviousPage) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (data?.pagination?.hasNextPage) {
      setPage(page + 1);
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteRequest(`/file/${fileToDelete}`);
      toast.success("File moved to trash");
      queryClient.invalidateQueries({ queryKey: ['folderDetails', folderId] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['trash'] });
    } catch (err) {
      toast.error(err.message || "Failed to delete file.");
    } finally {
      setIsDeleting(false);
      setFileToDelete(null);
    }
  };

  const handleDownload = (e, fileUrl, originalName) => {
    e.preventDefault();
    downloadFile(fileUrl, originalName);
  };

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['folderDetails', folderId] });
    queryClient.invalidateQueries({ queryKey: ['files'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  if (isPending) {
    return (
      <PendingState title="Folder Details" subtitle="Loading Folder Details...">
        <CardShimmer count={4} />
      </PendingState>
    );
  }

  if (isError) {
    return <ErrorState message={error?.message} />;
  }

  const folderName = data?.folder?.name || "Unknown Folder";
  const filesList = data?.files || [];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-500 relative">
      
      {/* Breadcrumb / Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link to="/folders" className="inline-flex items-center text-sm font-black tracking-widest text-black hover:bg-[#FFC900] border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0_0_#000] px-4 py-2 transition-all mb-6 group uppercase">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform stroke-[3]" />
            Back to Folders
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center text-black">
              <Folder className="h-8 w-8 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black uppercase mb-1">
                {folderName}
              </h1>
              <p className="text-sm font-bold bg-[#FF90E8] border-2 border-black inline-block px-3 py-1 shadow-[2px_2px_0_0_#000] uppercase">
                {filesList.length} items
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
            className="inline-flex items-center justify-center px-8 py-4 bg-[#00FF00] text-black border-4 border-black font-black uppercase text-xl shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#000] active:shadow-none active:translate-y-[6px] active:translate-x-[6px] transition-all gap-3 w-full md:w-auto cursor-pointer"
          >
            <UploadCloud className="h-6 w-6 stroke-[3]" />
            Upload File
          </button>
        </div>
      </div>

      {filesList.length === 0 ? (
        <EmptyState message="This folder is empty. Time to upload!" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filesList.map((file, index) => (
            <FileCard 
              key={file._id} 
              file={file} 
              index={index} 
              handleDownload={handleDownload} 
              handleDelete={(id) => setFileToDelete(id)}
              onPreview={(f) => setPreviewFile(f)}
              onShare={(f) => setShareFile(f)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination 
        pagination={data?.pagination} 
        handlePrevious={handlePrevious} 
        handleNext={handleNext} 
      />

      <ConfirmModal 
        isOpen={!!fileToDelete}
        title="Move File to Trash"
        message="Are you sure you want to move this file to trash? You can restore it later from Trash Bin."
        onConfirm={handleDelete}
        onCancel={() => setFileToDelete(null)}
      />

      <FilePreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <ShareModal
        file={shareFile}
        isOpen={!!shareFile}
        onClose={() => setShareFile(null)}
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
