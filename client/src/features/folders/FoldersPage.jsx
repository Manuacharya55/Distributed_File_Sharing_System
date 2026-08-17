import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRequest, postRequest, patchRequest } from '../../api/api';

const FoldersPage = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderNameInput, setFolderNameInput] = useState("");

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const response = await getRequest('/folder');
      if (response && response.data && response.data.folders) {
        setFolders(response.data.folders);
      }
    } catch (err) {
      setError("Failed to fetch folders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const getFolderColor = (index) => {
    const colors = ['bg-[#FF90E8]', 'bg-[#FFC900]', 'bg-[#00FF00]', 'bg-cyan-300', 'bg-red-400', 'bg-white'];
    return colors[index % colors.length];
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
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase mb-4 hover:rotate-1 transition-transform inline-block">
            Folders
          </h1>
          <br/>
          <p className="text-xl font-bold bg-[#FF90E8] border-2 border-black px-4 py-2 shadow-[4px_4px_0_0_#000] inline-block">
            Organize the chaos.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center px-8 py-4 bg-[#00FF00] text-black border-4 border-black font-black uppercase text-xl shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#000] active:shadow-none active:translate-y-[6px] active:translate-x-[6px] transition-all gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          New Folder
        </button>
      </div>

      {loading ? (
        <div className="text-3xl font-black uppercase text-center mt-20 animate-pulse">Loading folders...</div>
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
            <Link 
              to={`/folders/${folder._id}`} 
              key={folder._id}
              className={`group ${getFolderColor(index)} border-4 border-black p-6 flex flex-col items-center text-center shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_#000] active:shadow-none active:translate-y-[8px] active:translate-x-[8px] transition-all block relative`}
            >
              <button 
                onClick={(e) => openEditModal(e, folder)}
                className="absolute top-4 right-4 bg-white border-2 border-black p-2 hover:bg-gray-200 transition-colors shadow-[2px_2px_0_0_#000]"
                title="Edit Folder"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>

              <div className="w-24 h-24 mt-4 mb-6 bg-white border-4 border-black flex items-center justify-center text-black shadow-[4px_4px_0_0_#000] group-hover:rotate-12 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-black uppercase mb-4 underline decoration-4 decoration-transparent group-hover:decoration-black underline-offset-4 truncate w-full" title={folder.name}>
                {folder.name}
              </h3>
              
              <div className="w-full pt-4 border-t-4 border-black mt-auto">
                <p className="text-xs text-black font-bold uppercase">
                  Created: {new Date(folder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Folder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white border-4 border-black p-8 w-full max-w-md shadow-[12px_12px_0_0_#000]">
            <h2 className="text-3xl font-black uppercase mb-6 text-black">Create Folder</h2>
            <form onSubmit={handleCreateFolder}>
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase text-black mb-2">Folder Name</label>
                <input 
                  type="text" 
                  value={folderNameInput}
                  onChange={(e) => setFolderNameInput(e.target.value)}
                  className="w-full border-4 border-black p-3 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-[#FF90E8]"
                  placeholder="e.g. Secret Documents"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 bg-gray-200 border-4 border-black font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-[#00FF00] border-4 border-black font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Folder Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white border-4 border-black p-8 w-full max-w-md shadow-[12px_12px_0_0_#000]">
            <h2 className="text-3xl font-black uppercase mb-6 text-black">Edit Folder</h2>
            <form onSubmit={handleEditFolder}>
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase text-black mb-2">Folder Name</label>
                <input 
                  type="text" 
                  value={folderNameInput}
                  onChange={(e) => setFolderNameInput(e.target.value)}
                  className="w-full border-4 border-black p-3 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-[#FFC900]"
                  placeholder="Folder Name"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 bg-gray-200 border-4 border-black font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-[#FFC900] border-4 border-black font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FoldersPage;
