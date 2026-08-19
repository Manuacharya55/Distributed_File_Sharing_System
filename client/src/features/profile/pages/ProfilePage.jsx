import { useState, useEffect } from 'react';
import { getRequest, patchRequest } from '../../../api/api';
import ProfileForm from '../components/ProfileForm';
import PasswordForm from '../components/PasswordForm';
import Modal from '../../folders/components/Modal';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getRequest('/user/profile');
        if (res.data && res.data.data && res.data.data.user) {
          setProfile(res.data.data.user);
        } else if (res.data && res.data.user) {
          setProfile(res.data.user);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (data) => {
    try {
      const res = await patchRequest('/user/profile', data);
      if (res.data && res.data.data && res.data.data.user) {
        setProfile(res.data.data.user);
        setIsEditingProfile(false);
      } else if (res.data && res.data.user) {
        setProfile(res.data.user);
        setIsEditingProfile(false);
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordSave = async (passwordData) => {
    // Usually this would call a different API endpoint like PATCH /user/password
    try {
      await patchRequest('/user/password', passwordData); // Assuming this endpoint exists or will exist
      setIsEditingPassword(false);
      alert("Password updated successfully");
    } catch (err) {
      console.error("Failed to update password", err);
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-12 text-3xl font-black uppercase text-center mt-20 animate-pulse">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
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
          <h2 className="text-2xl font-black uppercase text-center mb-1">{profile.name || 'User'}</h2>
          <p className="text-gray-600 font-bold text-center mb-6">{profile.email}</p>
          
          <button 
            onClick={() => setIsEditingPassword(true)}
            className="w-full py-3 bg-yellow-300 border-2 border-black text-black font-black uppercase text-center shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all"
          >
            Change Password
          </button>
        </div>

        {/* Profile Details (Read Only) */}
        <div className="w-full md:w-2/3 p-8 border-4 border-black bg-white shadow-[8px_8px_0_0_#000]">
          <div className="flex justify-between items-center mb-8 pb-4 border-b-4 border-black">
            <h1 className="text-3xl font-black uppercase">Profile Details</h1>
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2 bg-black text-white font-bold uppercase border-2 border-black hover:bg-white hover:text-black transition-colors"
            >
              Edit
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-bold uppercase text-sm tracking-wide">Full Name</label>
              <p className="text-xl font-medium p-3 border-4 border-black bg-gray-50 shadow-[4px_4px_0_0_#000]">{profile.name}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold uppercase text-sm tracking-wide">Email Address</label>
              <p className="text-xl font-medium p-3 border-4 border-black bg-gray-50 shadow-[4px_4px_0_0_#000]">{profile.email}</p>
            </div>


          </div>
        </div>
        
      </div>

      <Modal isOpen={isEditingProfile} onClose={() => setIsEditingProfile(false)} title="Edit Profile">
        {isEditingProfile && (
          <ProfileForm 
            defaultValues={profile}
            onSave={handleSave}
            onCancel={() => setIsEditingProfile(false)}
          />
        )}
      </Modal>

      <Modal isOpen={isEditingPassword} onClose={() => setIsEditingPassword(false)} title="Change Password">
        {isEditingPassword && (
          <PasswordForm 
            onSave={handlePasswordSave}
            onCancel={() => setIsEditingPassword(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProfilePage;
