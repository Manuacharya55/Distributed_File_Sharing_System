import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyotpSchema } from '../schema/schema';
import InputField from '../../../components/shared/InputField';

const VerifyEmailForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(verifyotpSchema),
    defaultValues: {
      otp: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="otp" className="font-bold uppercase text-sm tracking-wide">
          One-Time Password
        </label>
        <InputField
          name="otp"
          type="text"
          placeholder="0000"
          register={register('otp')}
          errors={errors.otp}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-[#FF90E8] border-2 border-black text-black font-black text-lg uppercase shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Verifying...' : 'Verify'}
      </button>
    </form>
  );
};

export default VerifyEmailForm;
