import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Upload, Loader, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useUserSync } from '../hooks/useUserSync';
import { useToast } from '../context/ToastContext';
import { uploadImage } from '../services/api';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const DoctorVerification = () => {
  const navigate = useNavigate();
  const { backendUser } = useUserSync();
  const { showSuccess, showError } = useToast();
  
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [licenseFile, setLicenseFile] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    specialization: '',
    license_number: '',
    clinic_address: '',
    phone_number: '',
    bio: ''
  });

  useEffect(() => {
    if (backendUser) {
      checkVerificationStatus();
    }
  }, [backendUser]);

  const checkVerificationStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/verification/doctor/status?user_id=${backendUser.id}`);
      setVerificationStatus(response.data);
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseFile(file);
      setLicensePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!licenseFile) {
      showError('Please upload your license document');
      return;
    }

    setSubmitting(true);

    try {
      // Upload license document
      const uploadResult = await uploadImage(licenseFile);
      
      // Submit verification
      await axios.post(`${API_URL}/verification/doctor?user_id=${backendUser.id}`, {
        ...formData,
        license_document_url: uploadResult.url
      });

      showSuccess('Verification submitted successfully! We will review it soon.');
      checkVerificationStatus();
    } catch (error) {
      console.error('Error submitting verification:', error);
      showError('Failed to submit verification. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // If already verified
  if (backendUser.role === 'doctor' && backendUser.verified) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">You're Verified!</h2>
        <p className="text-gray-600 mb-6">You are now a verified doctor on Ahkili.</p>
        <button
          onClick={() => navigate('/profile')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-600 transition"
        >
          Go to Profile
        </button>
      </div>
    );
  }

  // If verification pending
  if (verificationStatus && verificationStatus.status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Clock className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Verification Pending</h2>
        <p className="text-gray-600 mb-2">Your verification is under review.</p>
        <p className="text-sm text-gray-500">
          Submitted: {new Date(verificationStatus.submitted_at).toLocaleString()}
        </p>
      </div>
    );
  }

  // If verification rejected
  if (verificationStatus && verificationStatus.status === 'rejected') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Verification Rejected</h2>
        <p className="text-gray-600 mb-2">Unfortunately, your verification was not approved.</p>
        {verificationStatus.rejection_reason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800"><strong>Reason:</strong> {verificationStatus.rejection_reason}</p>
          </div>
        )}
        <p className="text-sm text-gray-500 mb-6">You can submit a new application with correct information.</p>
        <button
          onClick={() => {
            setVerificationStatus(null);
            checkVerificationStatus();
          }}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-600 transition"
        >
          Submit New Application
        </button>
      </div>
    );
  }

  // Verification form
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <Award className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctor Verification</h1>
        <p className="text-gray-600">
          Get verified as a healthcare professional on Ahkili
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Dr. John Smith"
              required
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Specialization *
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Psychiatrist, Psychologist, Therapist, etc."
              required
            />
          </div>

          {/* License Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Medical License Number *
            </label>
            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="License/Registration Number"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+1234567890"
              required
            />
          </div>

          {/* Clinic Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Clinic/Practice Address *
            </label>
            <textarea
              name="clinic_address"
              value={formData.clinic_address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Full address of your practice"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Professional Bio *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Brief description of your experience and expertise..."
              required
            />
          </div>

          {/* License Document Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              License Document *
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Upload a clear photo/scan of your medical license or certification
            </p>
            
            {licensePreview ? (
              <div className="relative">
                <img 
                  src={licensePreview} 
                  alt="License preview" 
                  className="w-full h-64 object-contain border border-gray-300 rounded-lg mb-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    setLicenseFile(null);
                    setLicensePreview(null);
                  }}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  id="license-upload"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="license-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-600">Click to upload document</span>
                  <span className="text-sm text-gray-400">PNG, JPG or PDF</span>
                </label>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your information will be reviewed by our admin team. 
              Please ensure all details are accurate and your license document is clearly visible.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Award className="w-5 h-5" />
                <span>Submit for Verification</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorVerification;