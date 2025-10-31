// pages/CreateCommunity.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, FileText, ArrowLeft, Check } from 'lucide-react';
import { useUserSync } from '../hooks/useUserSync';
import { createCommunity } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';

const CreateCommunity = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { backendUser } = useUserSync();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if user is verified doctor or admin
  const canCreateCommunity = backendUser && 
    (backendUser.role === 'doctor' || backendUser.role === 'admin');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Community name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Community name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Community name must be less than 50 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!canCreateCommunity) {
      showError('Only verified professionals can create communities');
      return;
    }

    setLoading(true);
    try {
      const community = await createCommunity(
        formData.name,
        formData.description,
        backendUser.id
      );
      
      showSuccess('Community created successfully!');
      navigate(`/community/${community.id}`);
    } catch (error) {
      console.error('Error creating community:', error);
      showError(error.response?.data?.detail || 'Failed to create community');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!canCreateCommunity) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-6">
            Only verified professionals (doctors) can create communities. 
            Please complete the verification process first.
          </p>
          <button
            onClick={() => navigate('/doctor-verification')}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
          >
            Get Verified
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full mt-3 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Create Community</h1>
              <p className="text-gray-600 mt-1">Build a space for support and connection</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Community Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Users className="w-4 h-4 text-primary" />
              Community Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Anxiety Support Group"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                errors.name ? 'border-red-300' : 'border-gray-200'
              }`}
              maxLength={50}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.name.length}/50
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the purpose and guidelines of your community..."
              rows={6}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-200'
              }`}
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.description.length}/500
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Community Guidelines</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Create a safe and supportive environment</li>
              <li>• Set clear rules and expectations</li>
              <li>• You will be the community moderator</li>
              <li>• You can assign additional moderators later</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Create Community
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;