import React, { useState } from 'react';
import { getRequest, deleteRequest } from '../../../api/api';
import ImageComponent from '../../../components/shared/ImageComponent';
import FileCard from '../components/FileCard';
import FilePageHeader from '../components/FilePageHeader';
import { CardShimmer } from '../../../components/shared/Loader';
import Pagination from '../../../components/shared/Pagination';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import PendingState from '../../../components/shared/PendingState';
import ErrorState from '../../../components/shared/ErrorState';
import EmptyState from '../../../components/shared/EmptyState';
import ConfirmModal from '../../../components/shared/ConfirmModal';

import { downloadFile } from '../../../utils/downloadFile';

const fetchAllFiles = async (page, searchQuery) => {
  const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
  const url = `/file?page=${page}${searchParam}`;
  const response = await getRequest(url);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

const FilesPage = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['files', page, searchQuery],
    queryFn: () => fetchAllFiles(page, searchQuery),
    placeholderData: keepPreviousData,
    staleTime : 60 * 1000
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

  const handleUploadSuccess = (uploadedData) => {
    setIsUploadModalOpen(false);
    if (uploadedData) {
      const filesToAdd = Array.isArray(uploadedData) ? uploadedData : (uploadedData.files || [uploadedData]);
      queryClient.setQueryData(['files', page, searchQuery], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          files: [...filesToAdd, ...oldData.files],
        };
      });
    } else {
      refetch();
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    const response = await deleteRequest(`/file/${fileToDelete}`);
    
    if (!response?.success) {
      alert(response.message || "Failed to delete file.");
      setFileToDelete(null);
      return;
    }

    queryClient.setQueryData(['files', page, searchQuery], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        files: oldData.files.filter((file) => file._id !== fileToDelete),
      };
    });
    
    setFileToDelete(null);
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
        <EmptyState message="No files found. Time to upload!" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.files.map((file, index) => (
            <FileCard 
              key={file._id} 
              file={file} 
              index={index} 
              handleDownload={handleDownload} 
              handleDelete={(id) => setFileToDelete(id)} 
            />
          ))}
        </div>
      )}

      <ConfirmModal 
        isOpen={!!fileToDelete}
        title="Delete File"
        message="Are you sure you want to delete this file? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setFileToDelete(null)}
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
