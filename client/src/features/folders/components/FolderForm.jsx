import React, { useState } from 'react';
import { folderSchema } from '../schema/folder.schema';

const FolderForm = ({ onSubmit, folderNameInput, setFolderNameInput, onCancel, isEdit = false }) => {
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      folderSchema.parse({ name: folderNameInput });
      setError(null);
      onSubmit(e);
    } catch (err) {
      if (err.errors) {
        setError(err.errors[0].message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-bold uppercase text-black mb-2">Folder Name</label>
        <input 
          type="text" 
          value={folderNameInput}
          onChange={(e) => {
            setFolderNameInput(e.target.value);
            if (error) setError(null);
          }}
          className={`w-full border-4 p-3 text-lg font-bold focus:outline-none focus:ring-4 ${error ? 'border-red-500' : 'border-black'} ${isEdit ? 'focus:ring-[#FFC900]' : 'focus:ring-[#FF90E8]'}`}
          placeholder={isEdit ? "Folder Name" : "e.g. Secret Documents"}
          autoFocus
        />
        {error && <span className="text-red-500 font-bold text-sm uppercase mt-2 block">{error}</span>}
      </div>
      <div className="flex justify-end gap-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 border-4 border-black font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={`px-6 py-3 ${isEdit ? 'bg-[#FFC900]' : 'bg-[#00FF00]'} border-4 border-black font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all`}
        >
          {isEdit ? 'Save' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default FolderForm;
