import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../schema/profile.schema';
import InputField from '../../../components/shared/InputField';

const ProfileForm = ({ defaultValues, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || ''
    }
  });

  const onSubmit = async (data) => {
    await onSave(data);
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
          className="px-6 py-3 bg-[#FF90E8] text-black border-4 border-black font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
