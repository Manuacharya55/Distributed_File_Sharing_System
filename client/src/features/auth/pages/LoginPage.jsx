import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/schema";
import LoginForm from '../components/LoginForm'
import { postRequest } from "../../../api/api";
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext";

const LoginPage = () => {
  const {setToken} = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  const handleLoginUser = async (data) => {
    const response = await postRequest("/auth/login", data);
    setToken(response.data.token)
    navigate("/")
  };

  return (
    <div className='min-h-[85vh] flex items-center justify-center p-6 md:p-12'>
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white border-4 border-black shadow-[8px_8px_0_0_#000]">
        
        {/* Left Side: Branding / Graphic */}
        <div className="w-full md:w-1/2 border-b-4 md:border-b-0 md:border-r-4 border-black bg-[#FF90E8] p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight text-black mb-6">
            Welcome <br/> Back To <br/> ShareFlow.
          </h2>
          <div className="border-4 border-black shadow-[4px_4px_0_0_#000] overflow-hidden bg-white">
            <img src="/background.png" alt="Login Graphic" className="w-full h-48 md:h-64 object-cover filter grayscale" />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className='w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white'>
          <h1 className='text-4xl md:text-5xl font-black uppercase mb-8'>Login Here</h1>
          
          <LoginForm
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            onSubmit={handleLoginUser}
          />

          <div className="mt-8 pt-6 border-t-4 border-black text-center">
            <span className="font-bold text-lg">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-black hover:underline uppercase tracking-wide">
                Register here
              </Link>
            </span>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default LoginPage
