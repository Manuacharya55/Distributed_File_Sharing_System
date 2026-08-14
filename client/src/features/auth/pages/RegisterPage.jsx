import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schema/schema";
import RegisterForm from "../components/RegisterForm";
import { postRequest } from "../../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const {setToken} =  useAuth();
  const navigate = useNavigate();

  const handleRegisterUser = async (data) => {
    console.log(data)
    const response = await postRequest("/auth/register", data);
    setToken(response.data.token)
    navigate("/verify-email")
  };

  return (
    <div className='min-h-[85vh] flex items-center justify-center p-6 md:p-12'>
      <div className="w-full max-w-5xl flex flex-col md:flex-row-reverse bg-white border-4 border-black shadow-[8px_8px_0_0_#000]">
        
        {/* Right Side: Branding / Graphic */}
        <div className="w-full md:w-1/2 border-b-4 md:border-b-0 md:border-l-4 border-black bg-yellow-300 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight text-black mb-6">
            Join <br/> ShareFlow <br/> Today.
          </h2>
          <div className="border-4 border-black shadow-[4px_4px_0_0_#000] overflow-hidden bg-white">
            <img src="/background.png" alt="Register Graphic" className="w-full h-48 md:h-64 object-cover filter grayscale" />
          </div>
        </div>

        {/* Left Side: Form */}
        <div className='w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white'>
          <h1 className='text-4xl md:text-5xl font-black uppercase mb-8'>Register Here</h1>
          
          <RegisterForm
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            onSubmit={handleRegisterUser}
          />

          <div className="mt-8 pt-6 border-t-4 border-black text-center">
            <span className="font-bold text-lg">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-black hover:underline uppercase tracking-wide">
                Login here
              </Link>
            </span>
          </div>
        </div>
        
      </div>
    </div>
  )
};

export default RegisterPage;
