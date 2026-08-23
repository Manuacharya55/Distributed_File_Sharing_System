import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/schema";
import LoginForm from '../components/LoginForm';
import { postRequest } from "../../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { setFormErrors } from "../../../utils/formErrors";
import { Zap, Network, ShieldCheck } from "lucide-react";
import { useToast } from "../../../context/ToastContext";

const LoginPage = () => {
  const { setToken } = useAuth();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  const handleLoginUser = async (data) => {
    try {
      const response = await postRequest("/auth/login", data);
      if (!response?.success) {
        setFormErrors(setError, response, "email");
        toast.error(response?.message || "Login failed");
        return;
      }
      setToken(response.data.token);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      setFormErrors(setError, error, "email");
      toast.error(error?.message || "Login failed");
    }
  };

  return (
    <div className="h-[100dvh] flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-4xl bg-white border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Brand Showcase */}
        <div className="w-full md:w-5/12 bg-[#FF90E8] p-6 sm:p-8 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white font-black text-xs uppercase tracking-widest mb-4">
              <Zap className="w-3.5 h-3.5 fill-white" />
              ShareFlow
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black uppercase leading-tight text-black mb-3">
              Welcome <br /> Back.
            </h2>
            <p className="text-xs sm:text-sm font-bold text-black/80 leading-relaxed mb-4">
              Access your distributed storage, encrypted folders, and synced files anywhere.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="p-2.5 bg-white border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0_0_#000] flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-600" />
              Fast & Distributed Network
            </div>
            <div className="p-2.5 bg-white border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0_0_#000] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              End-to-End File Privacy
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              Sign In
            </h1>
            <p className="text-xs font-bold text-gray-500 mt-0.5 uppercase">
              Enter your credentials to continue
            </p>
          </div>

          <LoginForm
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            onSubmit={handleLoginUser}
            isProcessing={isSubmitting}
          />

          <div className="mt-6 pt-4 border-t-2 border-black/10 text-center">
            <span className="font-bold text-xs sm:text-sm text-gray-700">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-black font-black uppercase underline hover:bg-[#FF90E8] px-1 py-0.5 transition-colors"
              >
                Register here
              </Link>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
