import React from 'react';
import { Edit3 } from 'lucide-react';

const ProfileDetails = ({ profile, setIsEditingProfile }) => {
  return (
    <div className="w-full md:w-2/3 p-8 border-4 border-black bg-white shadow-[8px_8px_0_0_#000]">
      <div className="flex justify-between items-center mb-8 pb-4 border-b-4 border-black">
        <h1 className="text-3xl font-black uppercase">Profile Details</h1>
        <button 
          onClick={() => setIsEditingProfile(true)}
          className="px-4 py-2 bg-black text-white font-bold uppercase border-2 border-black hover:bg-white hover:text-black transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-bold uppercase text-sm tracking-wide">Full Name</label>
          <p className="text-xl font-medium p-3 border-4 border-black bg-gray-50 shadow-[4px_4px_0_0_#000]">{profile?.name}</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold uppercase text-sm tracking-wide">Email Address</label>
          <p className="text-xl font-medium p-3 border-4 border-black bg-gray-50 shadow-[4px_4px_0_0_#000]">{profile?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
