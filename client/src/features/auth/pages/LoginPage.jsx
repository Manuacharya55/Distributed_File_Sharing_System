import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/schema";
import LoginForm from '../components/LoginForm'
import { postRequest } from "../../../api/api";
import {Link} from "react-router-dom"
const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLoginUser = async (data) => {
    console.log(data)
    const response = await postRequest("/login", data);
    console.log(response);
  };

  return (
    <div className='w-full h-screen bg-white flex'>
      <div className='w-3/4 h-screen p-4'>
      <img src="background.png" alt="" className="w-full h-full rounded-md"/>
      </div>
      <div className='w-1/2 h-screen p-8 flex flex-col justify-center'>
        <h1 className='text-6xl text-center font-bold mb-6'>Login Here</h1>
        <LoginForm
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          onSubmit={handleLoginUser}
        />
        <span className="mt-2">don't have account ? <Link to="/register">register here</Link></span>
      </div>
    </div>
  )
}

export default LoginPage
