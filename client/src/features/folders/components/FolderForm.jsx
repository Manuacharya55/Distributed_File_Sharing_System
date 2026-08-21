import React, { useState } from 'react';
import { folderSchema } from '../schema/folder.schema';
import Button from '../../../components/shared/Button';

const FolderForm = ({ onSubmit, folderNameInput, setFolderNameInput, onCancel, isEdit = false, isProcessing = false }) => {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label className="block text-sm font-bold uppercase text-black mb-2">Folder Name</label>
        <input 
          type="text" 
          value={folderNameInput}
          disabled={isProcessing}
          onChange={(e) => {
            setFolderNameInput(e.target.value);
            if (error) setError(null);
          }}
          className={`w-full border-4 p-3 text-lg font-bold bg-[#f8f9fa] focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow ${error ? 'border-red-500' : 'border-black'}`}
          placeholder={isEdit ? "Folder Name" : "e.g. Secret Documents"}
          autoFocus
        />
        {error && <span className="text-red-500 font-bold text-sm uppercase mt-2 block">{error}</span>}
      </div>

      <div className="flex justify-end items-center gap-4">
        <button 
          type="button" 
          onClick={onCancel}
          disabled={isProcessing}
          className="px-6 py-3.5 bg-gray-200 border-4 border-black font-black uppercase hover:bg-gray-300 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <Button 
          name={isEdit ? 'Save Folder' : 'Create Folder'}
          isProcessing={isProcessing}
          type="submit"
          className="w-auto"
        />
      </div>
    </form>
  );
};

export default FolderForm;
