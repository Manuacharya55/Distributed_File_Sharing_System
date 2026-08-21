import React from 'react';
import Button from './Button';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isProcessing = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-white border-4 border-black shadow-[12px_12px_0_0_#000] p-8 max-w-md w-full relative animate-in zoom-in duration-200">
        <h2 className="text-3xl font-black uppercase mb-4">{title}</h2>
        <p className="text-lg font-bold mb-8">{message}</p>
        
        <div className="flex gap-4 justify-end items-center">
          <button 
            onClick={onCancel}
            disabled={isProcessing}
            className="px-6 py-3.5 bg-white border-4 border-black text-black font-black uppercase hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <Button 
            name="Confirm"
            isProcessing={isProcessing}
            handleClick={onConfirm}
            type="button"
            className="w-auto px-6 !bg-red-500 hover:!bg-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
