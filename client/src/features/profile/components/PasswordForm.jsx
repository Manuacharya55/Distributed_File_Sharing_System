import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema } from '../schema/profile.schema';
import InputField from '../../../components/shared/InputField';

const PasswordForm = ({ onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data) => {
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-bold uppercase text-sm tracking-wide text-black">Current Password</label>
        <InputField
          name="currentPassword"
          type="password"
          placeholder="Enter Current Password"
          register={register("currentPassword")}
          errors={errors.currentPassword}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold uppercase text-sm tracking-wide text-black">New Password</label>
        <InputField
          name="newPassword"
          type="password"
          placeholder="Enter New Password"
          register={register("newPassword")}
          errors={errors.newPassword}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold uppercase text-sm tracking-wide text-black">Confirm Password</label>
        <InputField
          name="confirmPassword"
          type="password"
          placeholder="Confirm New Password"
          register={register("confirmPassword")}
          errors={errors.confirmPassword}
        />
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button 
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 bg-gray-200 border-4 border-black font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all text-black disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-6 py-3 bg-yellow-300 text-black border-4 border-black font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

export default PasswordForm;
