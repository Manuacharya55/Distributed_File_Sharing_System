import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRequest, postRequest, patchRequest } from '../../../api/api';
import Modal from '../components/Modal';
import FolderForm from '../components/FolderForm';
import FolderCard from '../components/FolderCard';
import FolderPageHeader from '../components/FolderPageHeader';
import { CardShimmer } from '../../../components/shared/Loader';
import Pagination from '../../../components/shared/Pagination';

const FoldersPage = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderNameInput, setFolderNameInput] = useState("");

  const fetchFolders = async (currentPage = page) => {
    try {
      setLoading(true);
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
      const url = `/folder?page=${currentPage}${searchParam}`;
      const response = await getRequest(url);
      if (response && response.data && response.data.folders) {
        setFolders(response.data.folders);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError("Failed to fetch folders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchFolders(page);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (page !== 1) setPage(1);
    else fetchFolders(1);
  };

  const handlePrevious = () => {
    if (pagination?.hasPreviousPage) {
      const newPage = page - 1;
      setPage(newPage);
      fetchFolders(newPage);
    }
  };

  const handleNext = () => {
    if (pagination?.hasNextPage) {
      const newPage = page + 1;
      setPage(newPage);
      fetchFolders(newPage);
    }
  };



  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!folderNameInput.trim()) return;
    try {
      await postRequest('/folder', { name: folderNameInput });
      setIsAddModalOpen(false);
      setFolderNameInput("");
      fetchFolders();
    } catch (error) {
      console.error("Failed to create folder", error);
      alert("Error creating folder");
    }
  };

  const handleEditFolder = async (e) => {
    e.preventDefault();
    if (!folderNameInput.trim() || !currentFolder) return;
    try {
      await patchRequest(`/folder/${currentFolder._id}`, { name: folderNameInput });
      setIsEditModalOpen(false);
      setCurrentFolder(null);
      setFolderNameInput("");
      fetchFolders();
    } catch (error) {
      console.error("Failed to update folder", error);
      alert("Error updating folder");
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

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-500 relative">
      
      <FolderPageHeader 
        handleSearch={handleSearch} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        openAddModal={openAddModal} 
      />

      {loading ? (
        <CardShimmer count={4} />
      ) : error ? (
        <div className="text-2xl font-bold uppercase text-white bg-red-500 border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
          {error}
        </div>
      ) : folders.length === 0 ? (
        <div className="text-3xl font-black uppercase text-center mt-20 p-12 bg-white border-4 border-black shadow-[12px_12px_0_0_#000]">
          No folders found. Create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {folders.map((folder, index) => (
            <FolderCard 
              key={folder._id} 
              folder={folder} 
              index={index} 
              openEditModal={openEditModal} 
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

      {/* Add Folder Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create Folder">
        <FolderForm 
          onSubmit={handleCreateFolder}
          folderNameInput={folderNameInput}
          setFolderNameInput={setFolderNameInput}
          onCancel={() => setIsAddModalOpen(false)}
          isEdit={false}
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
        />
      </Modal>

    </div>
  );
};

export default FoldersPage;
