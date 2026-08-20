import InputField from '../../../components/shared/InputField';
import Button from '../../../components/shared/Button';

const RegisterForm = ({ register, handleSubmit, errors, onSubmit, isProcessing }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
      className="flex flex-col gap-3"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="font-bold uppercase text-xs sm:text-sm tracking-wide text-black">
          Full Name
        </label>
        <InputField
          name="name"
          placeholder="Enter your full name"
          register={register("name")}
          errors={errors.name}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-bold uppercase text-xs sm:text-sm tracking-wide text-black">
          Email Address
        </label>
        <InputField
          name="email"
          type="email"
          placeholder="Enter your email"
          register={register("email")}
          errors={errors.email}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="font-bold uppercase text-xs sm:text-sm tracking-wide text-black">
          Password
        </label>
        <InputField
          name="password"
          type="password"
          placeholder="Enter your password"
          register={register("password")}
          errors={errors.password}
        />
      </div>

      <div className="mt-1.5">
        <Button
          name="Register"
          isProcessing={isProcessing}
          type="submit"
        />
      </div>
    </form>
  );
};

export default RegisterForm;
