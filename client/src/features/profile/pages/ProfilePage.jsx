import React, { useState } from 'react';
import { getRequest, patchRequest, patchMultipartRequest } from '../../../api/api';
import ProfileForm from '../components/ProfileForm';
import PasswordForm from '../components/PasswordForm';
import Modal from '../../folders/components/Modal';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import PendingState from '../../../components/shared/PendingState';
import ErrorState from '../../../components/shared/ErrorState';
import ProfileSidebar from '../components/ProfileSidebar';
import ProfileDetails from '../components/ProfileDetails';
import { useToast } from '../../../context/ToastContext';

const fetchProfile = async () => {
  const response = await getRequest('/user/profile');
  if (response?.success === false) {
    throw new Error(response.message || "Failed to fetch profile");
  }
  return response?.data?.data?.user || response?.data?.user || response?.data || { name: '', email: '', avatar: null };
};

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const { data: profile, isPending, isError, error } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const handleSave = async (data) => {
    const response = await patchRequest('/user/profile', data);
    if (response?.success === false) {
      toast.error(response.message || "Failed to update profile");
      return response;
    }
    
    const updatedProfile = response?.data?.data?.user || response?.data?.user || response?.data;
    if (updatedProfile) {
      queryClient.setQueryData(['profile'], updatedProfile);
    }
    
    toast.success("Profile updated successfully");
    setIsEditingProfile(false);
    return response;
  };

  const handlePasswordSave = async (passwordData) => {
    const response = await patchRequest('/user/password', passwordData);
    if (response?.success === false) {
      toast.error(response.message || "Failed to update password");
      return response;
    }
    toast.success("Password changed successfully");
    setIsEditingPassword(false);
    return response;
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const response = await patchMultipartRequest('/user/update-avatar', formData);
    
    if (response?.success === false) {
      toast.error(response.message || "Failed to upload avatar");
      return;
    }

    toast.success("Avatar updated successfully");
    const updatedProfile = response?.data?.data?.user || response?.data?.user || response?.data;
    if (updatedProfile) {
      queryClient.setQueryData(['profile'], updatedProfile);
    }
  };

  if (isPending) {
    return <PendingState title="Profile" subtitle="Loading profile details..." />;
  }

  if (isError) {
    return <ErrorState message={error?.message} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start gap-10">
        
        <ProfileSidebar 
          profile={profile} 
          handleAvatarUpload={handleAvatarUpload} 
          setIsEditingPassword={setIsEditingPassword} 
        />
        
        <ProfileDetails 
          profile={profile} 
          setIsEditingProfile={setIsEditingProfile} 
        />
        
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
