import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyotpSchema } from '../schema/schema';
import InputField from '../../../components/shared/InputField';
import Button from '../../../components/shared/Button';
import { setFormErrors } from '../../../utils/formErrors';

const VerifyEmailForm = ({ onSubmit, isProcessing }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyotpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleFormSubmit = async (data) => {
    const response = await onSubmit(data);
    if (response && !response.success) {
      setFormErrors(setError, response, "otp");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleFormSubmit)(e);
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="otp" className="font-bold uppercase text-sm tracking-wide text-black">
          One-Time Password (OTP)
        </label>
        <InputField
          name="otp"
          type="text"
          placeholder="0000"
          register={register('otp')}
          errors={errors.otp}
        />
      </div>

      <div className="mt-2">
        <Button
          name="Verify Email"
          isProcessing={isProcessing}
          type="submit"
        />
      </div>
    </form>
  );
};

export default VerifyEmailForm;
