import React, { useRef } from 'react';
import { KeyRound, Camera } from 'lucide-react';

const ProfileSidebar = ({ profile, handleAvatarUpload, setIsEditingPassword }) => {
  const fileInputRef = useRef(null);
  const defaultAvatar = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D";

  const onFileChange = (e) => {
    handleAvatarUpload(e);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full md:w-1/3 flex flex-col items-center p-8 border-4 border-black bg-white shadow-[8px_8px_0_0_#000]">
      <div 
        className="w-32 h-32 rounded-full overflow-hidden border-4 border-black shadow-[4px_4px_0_0_#000] mb-6 relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <img 
          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300" 
          src={profile?.avatar || defaultAvatar} 
          alt="Profile avatar" 
        />
        <div className="absolute inset-0 bg-black/60 hidden group-hover:flex flex-col items-center justify-center transition-all duration-300 gap-1">
          <Camera className="w-5 h-5 text-white stroke-[2.5]" />
          <span className="text-white font-bold text-[10px] uppercase tracking-widest text-center">Change Avatar</span>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileChange} 
          className="hidden" 
          accept="image/jpeg, image/png, image/gif" 
        />
      </div>
      <h2 className="text-2xl font-black uppercase text-center mb-1">{profile?.name || 'User'}</h2>
      <p className="text-gray-600 font-bold text-center mb-6 text-sm">{profile?.email}</p>
      
      <button 
        onClick={() => setIsEditingPassword(true)}
        className="w-full py-3 bg-yellow-300 border-2 border-black text-black font-black uppercase text-center shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <KeyRound className="w-4 h-4 stroke-[2.5]" />
        Change Password
      </button>
    </div>
  );
};

export default ProfileSidebar;
