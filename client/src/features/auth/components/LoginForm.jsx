import InputField from '../../../components/shared/InputField';
import Button from '../../../components/shared/Button';

const LoginForm = ({ register, handleSubmit, errors, onSubmit, isProcessing }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
      className="flex flex-col gap-3.5"
    >
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
          name="Login"
          isProcessing={isProcessing}
          type="submit"
        />
      </div>
    </form>
  );
};

export default LoginForm;
