import { useState } from 'react';
import { Link } from 'react-router-dom';

const ChangePasswordPage = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
        <h1 className="text-3xl font-black uppercase mb-2">Change Password</h1>
        <p className="text-gray-600 mb-8 font-bold">Secure your account with a new password.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label htmlFor="currentPassword" className="font-bold uppercase text-sm tracking-wide">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 border-2 border-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow bg-[#f8f9fa]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="newPassword" className="font-bold uppercase text-sm tracking-wide">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 border-2 border-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow bg-[#f8f9fa]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="font-bold uppercase text-sm tracking-wide">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 border-2 border-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow bg-[#f8f9fa]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-2 bg-[#FF90E8] border-2 border-black text-black font-black text-lg uppercase shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all"
          >
            Update Password
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/profile" className="text-sm font-bold hover:underline">
            &larr; Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
