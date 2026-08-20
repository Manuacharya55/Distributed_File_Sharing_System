import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-white border-4 border-black shadow-[12px_12px_0_0_#000] p-8 max-w-md w-full relative animate-in zoom-in duration-200">
        <h2 className="text-3xl font-black uppercase mb-4">{title}</h2>
        <p className="text-lg font-bold mb-8">{message}</p>
        
        <div className="flex gap-4 justify-end">
          <button 
            onClick={onCancel}
            className="px-6 py-2 bg-white border-4 border-black text-black font-black uppercase hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 border-4 border-black text-white font-black uppercase hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
