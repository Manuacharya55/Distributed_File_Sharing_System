import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white border-4 border-black p-8 w-full max-w-md shadow-[12px_12px_0_0_#000]">
        {title && <h2 className="text-3xl font-black uppercase mb-6 text-black">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
