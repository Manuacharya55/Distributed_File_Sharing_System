import InputField from '../../../components/shared/InputField'
import Button from '../../../components/shared/Button'

const RegisterForm = ({ register, handleSubmit, errors, onSubmit }) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(onSubmit)(e);
    }}>
      <InputField
        placeholder="enter your name"
        name="name"
        register={register("name")}
        errors={errors.name}
      />
      <InputField
        placeholder="enter your email"
        name="email"
        register={register("email")}
        errors={errors.email}
      />
      <InputField
        placeholder="enter your password"
        name="password"
        register={register("password")}
        errors={errors.password}
        type="password"
      />
      <Button
        name="register"
        isProcessing={false}
      />
    </form>
  );
};

export default RegisterForm;
