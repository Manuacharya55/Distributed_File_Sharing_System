import React, { useState } from 'react';
import { getRequest, postRequest, patchRequest, deleteRequest } from '../../../api/api';
import Modal from '../components/Modal';
import FolderForm from '../components/FolderForm';
import FolderCard from '../components/FolderCard';
import FolderPageHeader from '../components/FolderPageHeader';
import ShareModal from '../../files/components/ShareModal';
import { CardShimmer } from '../../../components/shared/Loader';
import Pagination from '../../../components/shared/Pagination';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import ErrorState from '../../../components/shared/ErrorState';
import PendingState from '../../../components/shared/PendingState';
import EmptyState from '../../../components/shared/EmptyState';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import { useToast } from '../../../context/ToastContext';

const fetchFolders = async (page, searchQuery) => {
  const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
  const url = `/folder?page=${page}${searchParam}`;
  const response = await getRequest(url);
  return response.data;
};

const FoldersPage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [isFormProcessing, setIsFormProcessing] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["folders", page, searchQuery],
    queryFn: () => fetchFolders(page, searchQuery),
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

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!folderNameInput.trim() || isFormProcessing) return;

    setIsFormProcessing(true);
    try {
      await postRequest('/folder', { name: folderNameInput });
      toast.success("Folder created successfully");
      setIsAddModalOpen(false);
      setFolderNameInput("");
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (err) {
      toast.error(err.message || "Error creating folder");
    } finally {
      setIsFormProcessing(false);
    }
  };

  const handleEditFolder = async (e) => {
    e.preventDefault();
    if (!folderNameInput.trim() || !currentFolder || isFormProcessing) return;

    setIsFormProcessing(true);
    try {
      await patchRequest(`/folder/${currentFolder._id}`, { name: folderNameInput });
      toast.success("Folder updated successfully");
      setIsEditModalOpen(false);
      setCurrentFolder(null);
      setFolderNameInput("");
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    } catch (err) {
      toast.error(err.message || "Error updating folder");
    } finally {
      setIsFormProcessing(false);
    }
  };

  const handleDeleteFolder = async () => {
    if (!folderToDelete || isFormProcessing) return;

    setIsFormProcessing(true);
    try {
      await deleteRequest(`/folder/${folderToDelete}`);
      toast.success("Folder deletion scheduled in background");
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['trash'] });
    } catch (err) {
      toast.error(err.message || "Failed to delete folder.");
    } finally {
      setIsFormProcessing(false);
      setFolderToDelete(null);
    }
  };

  const openAddModal = () => {
    setFolderNameInput("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (e, folder) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentFolder(folder);
    setFolderNameInput(folder.name);
    setIsEditModalOpen(true);
  };

  if (isPending) {
    return (
      <PendingState title="Folders" subtitle="Loading Folders...">
        <CardShimmer count={4} />
      </PendingState>
    );
  }

  if (isError) {
    return <ErrorState message={error?.message} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-500 relative">
      <FolderPageHeader
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openAddModal={openAddModal}
      />

      {!data?.folders || data.folders.length === 0 ? (
        <EmptyState message="No folders found. Create one!" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.folders.map((folder, index) => (
            <FolderCard
              key={folder._id}
              folder={folder}
              index={index}
              openEditModal={openEditModal}
              handleDelete={(id) => setFolderToDelete(id)}
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

      {/* Add Folder Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create Folder">
        <FolderForm
          onSubmit={handleCreateFolder}
          folderNameInput={folderNameInput}
          setFolderNameInput={setFolderNameInput}
          onCancel={() => setIsAddModalOpen(false)}
          isEdit={false}
          isProcessing={isFormProcessing}
        />
      </Modal>

      {/* Edit Folder Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Folder">
        <FolderForm
          onSubmit={handleEditFolder}
          folderNameInput={folderNameInput}
          setFolderNameInput={setFolderNameInput}
          onCancel={() => setIsEditModalOpen(false)}
          isEdit={true}
          isProcessing={isFormProcessing}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!folderToDelete}
        title="Delete Folder (Background Cascade)"
        message="Are you sure you want to delete this folder? All contained sub-folders and files will be permanently purged in the background."
        onConfirm={handleDeleteFolder}
        onCancel={() => setFolderToDelete(null)}
      />
    </div>
  );
};

export default FoldersPage;
