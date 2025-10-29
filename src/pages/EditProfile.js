import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader, User, MapPin, FileText, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserSync } from '../hooks/useUserSync';
import { getUserProfile, updateUserProfile, uploadImage } from '../services/api';
import { useToast } from '../context/ToastContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { backendUser } = useUserSync();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    profile_picture_url: ''
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (backendUser) {
        try {
          const profile = await getUserProfile(backendUser.id);
          setFormData({
            username: profile.username || '',
            bio: profile.bio || '',
            location: profile.location || '',
            profile_picture_url: profile.profile_picture_url || currentUser?.photoURL || ''
          });
          setPreviewImage(profile.profile_picture_url || currentUser?.photoURL);
        } catch (error) {
          console.error('Error fetching profile:', error);
          showError('Failed to load profile');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [backendUser, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const result = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        profile_picture_url: result.url
      }));
      setPreviewImage(result.url);
      showSuccess('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      showError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      showError('Username is required');
      return;
    }

    if (formData.username.length < 3) {
      showError('Username must be at least 3 characters');
      return;
    }

    if (formData.bio && formData.bio.length > 500) {
      showError('Bio must be less than 500 characters');
      return;
    }

    setSaving(true);
    try {
      // Only send fields that have values
      const updateData = {};
      if (formData.username) updateData.username = formData.username;
      if (formData.bio) updateData.bio = formData.bio;
      if (formData.location) updateData.location = formData.location;
      if (formData.profile_picture_url) updateData.profile_picture_url = formData.profile_picture_url;

      await updateUserProfile(backendUser.id, updateData);
      showSuccess('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 400) {
        showError(error.response.data.detail || 'Username already taken');
      } else {
        showError('Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <User className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto min-h-screen">
      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Back Button */}
      <button 
        onClick={() => navigate('/profile')}
        className="group flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition-all duration-300 font-medium"
      >
        <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-lg transition-all group-hover:scale-110">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span>Back to Profile</span>
      </button>

      {/* Edit Profile Form */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-3xl blur-xl" />
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-primary/20 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white text-4xl font-bold border-4 border-primary/20 shadow-lg">
                    {formData.username.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>

                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                    <Loader className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-3">Click to change profile picture</p>
            </div>

            {/* Username */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
                required
                minLength={3}
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">3-50 characters</p>
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Your location (optional)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
                maxLength={100}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;