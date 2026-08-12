import InputField from '../../../components/shared/InputField'
import Button from '../../../components/shared/Button'

const LoginForm = ({ register, handleSubmit, errors, onSubmit }) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(onSubmit)(e);
    }} className='flex flex-col'>
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
        name="login"
        isProcessing={false}
      />
    </form>
  )
}

export default LoginForm
