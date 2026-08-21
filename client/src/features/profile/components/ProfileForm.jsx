import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../schema/profile.schema';
import InputField from '../../../components/shared/InputField';
import Button from '../../../components/shared/Button';
import { setFormErrors } from '../../../utils/formErrors';

const ProfileForm = ({ defaultValues, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || ''
    }
  });

  const onSubmit = async (data) => {
    const response = await onSave(data);
    if (response && response.success === false) {
      setFormErrors(setError, response, "email");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-bold uppercase text-sm tracking-wide text-black">
          Full Name
        </label>
        <InputField
          name="name"
          placeholder="Enter Full Name"
          register={register("name")}
          errors={errors.name}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-bold uppercase text-sm tracking-wide text-black">
          Email Address
        </label>
        <InputField
          name="email"
          type="email"
          placeholder="Enter Email Address"
          register={register("email")}
          errors={errors.email}
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
          name="Save Changes"
          isProcessing={isSubmitting}
          type="submit"
          className="w-auto"
        />
      </div>
    </form>
  );
};

export default ProfileForm;
