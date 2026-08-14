import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software engineer and avid file sharer.'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const handleChange = (e) => {
    setEditedProfile({ ...editedProfile, [e.target.id]: e.target.value });
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    console.log('Profile updated', editedProfile);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-start gap-10">
        
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3 flex flex-col items-center p-8 border-4 border-black bg-white shadow-[8px_8px_0_0_#000]">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-black shadow-[4px_4px_0_0_#000] mb-6">
            <img 
              className="w-full h-full object-cover filter grayscale" 
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D" 
              alt="Profile avatar" 
            />
          </div>
          <h2 className="text-2xl font-black uppercase text-center mb-1">{profile.name}</h2>
          <p className="text-gray-600 font-bold text-center mb-6">{profile.email}</p>
          
          <Link 
            to="/change-password" 
            className="w-full py-3 bg-yellow-300 border-2 border-black text-black font-black uppercase text-center shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all"
          >
            Change Password
          </Link>
        </div>

        {/* Profile Details */}
        <div className="w-full md:w-2/3 p-8 border-4 border-black bg-white shadow-[8px_8px_0_0_#000]">
          <div className="flex justify-between items-center mb-8 pb-4 border-b-4 border-black">
            <h1 className="text-3xl font-black uppercase">Profile Details</h1>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-black text-white font-bold uppercase border-2 border-black hover:bg-white hover:text-black transition-colors"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white text-black font-bold uppercase border-2 border-black hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#FF90E8] text-black font-bold uppercase border-2 border-black hover:bg-pink-400 transition-colors"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-bold uppercase text-sm tracking-wide">Full Name</label>
              {isEditing ? (
                <input 
                  id="name"
                  value={editedProfile.name}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow bg-[#f8f9fa]"
                />
              ) : (
                <p className="text-xl font-medium p-3 border-2 border-transparent bg-gray-50">{profile.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold uppercase text-sm tracking-wide">Email Address</label>
              {isEditing ? (
                <input 
                  id="email"
                  type="email"
                  value={editedProfile.email}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow bg-[#f8f9fa]"
                />
              ) : (
                <p className="text-xl font-medium p-3 border-2 border-transparent bg-gray-50">{profile.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
