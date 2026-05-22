"use client";
import React, { useState, useEffect } from 'react';
import { User, Camera, Save, X } from 'lucide-react';
import { EditProfileData } from '../../../property/types/settings';
import Image from 'next/image';
import { useUser } from '@/app/context/UserContext';

export default function ProfileSettings() {
  const { user, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // Initialize profile data from user context
  const [profile, setProfile] = useState<EditProfileData>({
    name: '',
    email: '',
    whatsapp: '',
    cea: '',
    agency: {
      name: '',
      licenseNumber: '',
      address: ''
    },
    avatar: ''
  });

  const [tempProfile, setTempProfile] = useState<EditProfileData>(profile);

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      const userProfile: EditProfileData = {
        name: user?.name || '',
        email: user?.email || '',
        whatsapp: user?.whatsapp || '',
        cea: user?.cea || '',
        agency: {
          licenseNumber: user?.agency?.licenseNumber || '',
          name: user?.agency?.name || '',
          address: user?.agency?.address || ''
        },
        avatar: user?.avatar || ''
      };
      
      setProfile(userProfile);
      setTempProfile(userProfile);
    }
  }, [user]);

  const handleProfileChange = (field: keyof EditProfileData, value: string) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Use the updateProfile function from UserContext
      await updateProfile({
        ...user,
          ...tempProfile
      });

      // Update local state
      setProfile(tempProfile);
      setIsEditing(false);
      
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setTempProfile(profile);
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        const newProfile: EditProfileData = {
          ...tempProfile,
          avatar: base64String
        };

        setTempProfile(newProfile);

        await updateProfile({
          ...user,
          ...newProfile
        });

        setSuccess('Avatar updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div className="flex space-x-2 sm:space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Cancel</span>
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="hidden sm:inline">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </span>
                <span className="sm:hidden">
                  {isLoading ? 'Saving...' : 'Save'}
                </span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {/* Profile Content */}
      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center w-full sm:w-auto">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full flex items-center justify-center mb-3">
            {tempProfile.avatar ? (
              <Image
                src={tempProfile.avatar}
                alt="Profile"
                width={128}
                height={128}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
            )}
            {isEditing && (
              <label className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-red-600 text-white p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                ) : (
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isLoading}
                />
              </label>
            )}
          </div>
          {isEditing && (
            <p className="text-xs sm:text-sm text-gray-500 text-center max-w-[120px] sm:max-w-none">
              {isLoading ? 'Uploading...' : 'Click camera to change photo'}
            </p>
          )}
        </div>

        {/* Profile Form */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              label="Full Name *"
              type="text"
              value={tempProfile.name}
              onChange={(value) => handleProfileChange('name', value)}
              disabled={!isEditing}
              required
            />
            
            <FormField
              label="Email Address *"
              type="email"
              value={tempProfile.email}
              onChange={(value) => handleProfileChange('email', value)}
              disabled={!isEditing}
              required
            />
            
          { user?.role === 'agent' && (
            <>
              <FormField
                label="WhatsApp Number"
                type="tel"
                value={tempProfile.whatsapp}
                onChange={(value) => handleProfileChange('whatsapp', value)}
                disabled={!isEditing}
                placeholder="+1 (555) 123-4567"
              />
              
              <FormField
                label="License Number"
                type="text"
                value={tempProfile.agency?.licenseNumber || ''}
                onChange={(value) =>
                  setTempProfile(prev => ({
                    ...prev,
                    agency: {
                      ...(prev.agency || {}),
                      licenseNumber: value
                    }
                  }))
                }
                disabled={!isEditing}
                placeholder="CA-BRE-1234567"
              />

              <FormField
                label="CEA Number"
                type="text"
                value={tempProfile.cea}
                onChange={(value) => handleProfileChange('cea', value)}
                disabled={!isEditing}
                placeholder="CA-BRE-1234567"
              />
              
              <div className="sm:col-span-2">
                <FormField
                  label="Address"
                  type="text"
                  value={tempProfile.agency?.address || ''}
                  onChange={(value) =>
                    setTempProfile(prev => ({
                      ...prev,
                      agency: {
                        ...(prev.agency || {}),
                        address: value
                      }
                    }))
                  }
                  disabled={!isEditing}
                  placeholder="Enter your business address"
                />
              </div>
            </>
            )}

          </div>
        </div>
      </div>

      {isEditing && (
        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs sm:text-sm text-green-800">
            <strong>Note:</strong> Changes will be saved to your profile immediately when you click Save Changes. 
            You can cancel at any time to discard your changes.
          </p>
        </div>
      )}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

function FormField({ label, type, value, onChange, disabled = false, required = false, placeholder }: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
          disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white text-gray-900'
        }`}
      />
    </div>
  );
}