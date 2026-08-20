import { Link, useNavigate } from 'react-router-dom';
import { postRequest } from '../../../api/api';
import VerifyEmailForm from '../components/VerifyEmailForm';

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      const response = await postRequest('/auth/verify-email', data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      alert(error?.response?.data?.message || 'Invalid or expired OTP');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
        <h1 className="text-3xl font-black uppercase mb-2">Verify Email</h1>
        <p className="text-gray-600 mb-8 font-bold">Enter the 4-digit code sent to your email.</p>

        <VerifyEmailForm onSubmit={handleSubmit} />

        <div className="mt-6 text-center">
          <div className="mt-4">
             <Link to="/login" className="text-sm font-bold hover:underline">
               &larr; Back to Login
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
