import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postRequest } from '../../../api/api';
import VerifyEmailForm from '../components/VerifyEmailForm';
import { Zap } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (data) => {
    setIsProcessing(true);
    try {
      const response = await postRequest('/auth/verify-email', data);
      if (response?.success) {
        toast.success("Email verified successfully!");
        navigate('/dashboard');
        return response;
      } else {
        toast.error(response?.message || "Invalid or expired OTP");
        return response;
      }
    } catch (error) {
      toast.error(error?.message || "Invalid or expired OTP");
      return { success: false, message: error?.message, errors: error?.errors };
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-[100dvh] flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0_0_#000]">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white font-black text-xs uppercase tracking-widest mb-4">
          <Zap className="w-3.5 h-3.5 fill-white" />
          ShareFlow
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase text-black mb-1.5">Verify Email</h1>
        <p className="text-xs font-bold text-gray-500 uppercase mb-6">
          Enter the 4-digit code sent to your email
        </p>

        <VerifyEmailForm onSubmit={handleSubmit} isProcessing={isProcessing} />

        <div className="mt-6 pt-4 border-t-2 border-black/10 text-center">
          <Link 
            to="/login" 
            className="text-black font-black uppercase underline hover:bg-[#FF90E8] px-2 py-1 transition-colors text-xs sm:text-sm"
          >
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
