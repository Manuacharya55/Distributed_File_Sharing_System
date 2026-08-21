import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema } from '../schema/profile.schema';
import InputField from '../../../components/shared/InputField';
import Button from '../../../components/shared/Button';
import { setFormErrors } from '../../../utils/formErrors';

const PasswordForm = ({ onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    setError,
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
    const response = await onSave(data);
    if (response && response.success === false) {
      setFormErrors(setError, response, "currentPassword");
    }
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

      <div className="flex justify-end items-center gap-4 mt-2">
        <button 
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3.5 bg-gray-200 border-4 border-black font-black uppercase hover:bg-gray-300 transition-all text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <Button 
          name="Update Password"
          isProcessing={isSubmitting}
          type="submit"
          className="w-auto"
        />
      </div>
    </form>
  );
};

export default PasswordForm;
