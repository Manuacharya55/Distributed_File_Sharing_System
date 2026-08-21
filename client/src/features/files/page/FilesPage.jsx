import React, { useState } from 'react';
import { getRequest, deleteRequest } from '../../../api/api';
import ImageComponent from '../../../components/shared/ImageComponent';
import FileCard from '../components/FileCard';
import FilePageHeader from '../components/FilePageHeader';
import FilePreviewModal from '../components/FilePreviewModal';
import ShareModal from '../components/ShareModal';
import { CardShimmer } from '../../../components/shared/Loader';
import Pagination from '../../../components/shared/Pagination';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import PendingState from '../../../components/shared/PendingState';
import ErrorState from '../../../components/shared/ErrorState';
import EmptyState from '../../../components/shared/EmptyState';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import { downloadFile } from '../../../utils/downloadFile';
import { useToast } from '../../../context/ToastContext';

const fetchAllFiles = async (page, searchQuery) => {
  const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
  const url = `/file?page=${page}${searchParam}`;
  const response = await getRequest(url);
  return response.data;
};

const FilesPage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modals state
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['files', page, searchQuery],
    queryFn: () => fetchAllFiles(page, searchQuery),
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

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['files'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const handleDelete = async () => {
    if (!fileToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteRequest(`/file/${fileToDelete}`);
      toast.success("File moved to trash");
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

  if (isPending) {
    return (
      <PendingState title="All Files" subtitle="Loading Files...">
        <CardShimmer count={4} />
      </PendingState>
    );
  }

  if (isError) {
    return <ErrorState message={error?.message} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-500">
      <FilePageHeader 
        handleSearch={handleSearch} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        setIsUploadModalOpen={setIsUploadModalOpen} 
      />

      {!data?.files || data.files.length === 0 ? (
        <EmptyState message="No files found. Time to upload directly to S3!" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.files.map((file, index) => (
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

      {/* Delete / Move to Trash Confirm Modal */}
      <ConfirmModal 
        isOpen={!!fileToDelete}
        title="Move File to Trash"
        message="Are you sure you want to move this file to trash? You can restore it later from Trash Bin."
        onConfirm={handleDelete}
        onCancel={() => setFileToDelete(null)}
      />

      {/* In-Browser File Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {/* File Share Modal */}
      <ShareModal
        file={shareFile}
        isOpen={!!shareFile}
        onClose={() => setShareFile(null)}
      />

      {/* Pagination Controls */}
      <Pagination 
        pagination={data?.pagination} 
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
