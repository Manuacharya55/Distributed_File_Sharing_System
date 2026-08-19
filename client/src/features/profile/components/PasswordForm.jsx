import React, { useState } from 'react';
import { passwordSchema } from '../schema/profile.schema';

const PasswordForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      passwordSchema.parse(formData);
      setErrors({});
      onSave(formData);
    } catch (err) {
      if (err.errors) {
        const formattedErrors = {};
        err.errors.forEach(e => {
          formattedErrors[e.path[0]] = e.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-bold uppercase text-sm tracking-wide text-black">Current Password</label>
        <input 
          id="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          className={`w-full p-3 border-4 focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow bg-[#f8f9fa] ${errors.currentPassword ? 'border-red-500' : 'border-black'}`}
          autoFocus
        />
        {errors.currentPassword && <span className="text-red-500 font-bold text-sm uppercase">{errors.currentPassword}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold uppercase text-sm tracking-wide text-black">New Password</label>
        <input 
          id="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          className={`w-full p-3 border-4 focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow bg-[#f8f9fa] ${errors.newPassword ? 'border-red-500' : 'border-black'}`}
        />
        {errors.newPassword && <span className="text-red-500 font-bold text-sm uppercase">{errors.newPassword}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold uppercase text-sm tracking-wide text-black">Confirm Password</label>
        <input 
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full p-3 border-4 focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow bg-[#f8f9fa] ${errors.confirmPassword ? 'border-red-500' : 'border-black'}`}
        />
        {errors.confirmPassword && <span className="text-red-500 font-bold text-sm uppercase">{errors.confirmPassword}</span>}
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 border-4 border-black font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all text-black"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-6 py-3 bg-yellow-300 text-black border-4 border-black font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all"
        >
          Update Password
        </button>
      </div>
    </form>
  );
};

export default PasswordForm;
