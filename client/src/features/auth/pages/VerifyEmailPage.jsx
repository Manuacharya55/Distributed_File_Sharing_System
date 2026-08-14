import { useState } from 'react';
import { Link } from 'react-router-dom';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Verifying OTP:', otp);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
        <h1 className="text-3xl font-black uppercase mb-2">Verify Email</h1>
        <p className="text-gray-600 mb-8 font-bold">Enter the 6-digit code sent to your email.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="otp" className="font-bold uppercase text-sm tracking-wide">
              One-Time Password
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="000000"
              className="w-full p-3 border-2 border-black font-mono text-center text-2xl tracking-[0.5em] focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow bg-[#f8f9fa]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#FF90E8] border-2 border-black text-black font-black text-lg uppercase shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all"
          >
            Verify
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm font-bold">
            Didn't receive the code?{' '}
            <button className="text-blue-600 hover:underline uppercase tracking-wide cursor-pointer">
              Resend Code
            </button>
          </p>
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
