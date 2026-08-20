import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schema/schema";
import RegisterForm from "../components/RegisterForm";
import { postRequest } from "../../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { setFormErrors } from "../../../utils/formErrors";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleRegisterUser = async (data) => {
    const response = await postRequest("/auth/register", data);
    if (!response?.success) {
      setFormErrors(setError, response, "email");
      return;
    }
    setToken(response.data.token);
    navigate("/verify-email");
  };

  return (
    <div className="h-[100dvh] flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-4xl bg-white border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col md:flex-row-reverse overflow-hidden">
        
        {/* Right Side: Brand Showcase */}
        <div className="w-full md:w-5/12 bg-[#FFDE59] p-6 sm:p-8 border-b-4 md:border-b-0 md:border-l-4 border-black flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white font-black text-xs uppercase tracking-widest mb-4">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              ShareFlow
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black uppercase leading-tight text-black mb-3">
              Join Us <br /> Today.
            </h2>
            <p className="text-xs sm:text-sm font-bold text-black/80 leading-relaxed mb-4">
              Create your account to start uploading, organizing, and distributing files in seconds.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="p-2.5 bg-white border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0_0_#000] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              Unlimited File Storage
            </div>
            <div className="p-2.5 bg-white border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0_0_#000] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Secure OTP Verification
            </div>
          </div>
        </div>

        {/* Left Side: Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              Sign Up
            </h1>
            <p className="text-xs font-bold text-gray-500 mt-0.5 uppercase">
              Fill in your details to create an account
            </p>
          </div>
          
          <RegisterForm
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            onSubmit={handleRegisterUser}
            isProcessing={isSubmitting}
          />

          <div className="mt-6 pt-4 border-t-2 border-black/10 text-center">
            <span className="font-bold text-xs sm:text-sm text-gray-700">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-black font-black uppercase underline hover:bg-[#FFDE59] px-1 py-0.5 transition-colors"
              >
                Sign in here
              </Link>
            </span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default RegisterPage;
