import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, User, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCommunities } from '../services/api';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [interests, setInterests] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    agreedToRules: false,
    selectedInterests: []
  });

  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Fetch communities for interests
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const data = await getCommunities();
        const communityInterests = data.map(community => ({
          id: community.id,
          name: community.name,
          icon: community.icon || '💚'
        }));
        setInterests(communityInterests);
      } catch (error) {
        console.error('Error fetching communities:', error);
        setInterests([
          { id: 1, name: 'Anxiety Support', icon: '💭' },
          { id: 2, name: 'Depression Help', icon: '🌧️' },
          { id: 3, name: 'Stress Management', icon: '😌' },
          { id: 4, name: 'Sleep Issues', icon: '😴' },
          { id: 5, name: 'Work-Life Balance', icon: '⚖️' },
          { id: 6, name: 'Self Care', icon: '💚' },
          { id: 7, name: 'Mindfulness', icon: '🧘' },
          { id: 8, name: 'Relationships', icon: '💑' },
          { id: 9, name: 'Grief & Loss', icon: '🕊️' },
          { id: 10, name: 'PTSD Support', icon: '🛡️' },
          { id: 11, name: 'Eating Disorders', icon: '🍽️' },
          { id: 12, name: 'Addiction Recovery', icon: '🌟' }
        ]);
      }
    };

    if (signupStep === 3) {
      fetchCommunities();
    }
  }, [signupStep]);

  const appRules = [
    'Be respectful and supportive to all community members',
    'No harassment, bullying, or hate speech',
    'Keep personal information private and secure',
    'Share experiences, not medical advice',
    'Report inappropriate content immediately',
    'No promotional or commercial content',
    'Respect confidentiality and privacy of others',
    'Use content warnings for sensitive topics'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleInterest = (interestId) => {
    setFormData(prev => {
      const selectedInterests = prev.selectedInterests.includes(interestId)
        ? prev.selectedInterests.filter(id => id !== interestId)
        : [...prev.selectedInterests, interestId];
      return { ...prev, selectedInterests };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (signupStep === 1) {
        if (!formData.username || !formData.email || !formData.password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        setSignupStep(2);
        setLoading(false);
        return;
      } else if (signupStep === 2) {
        if (!formData.agreedToRules) {
          setError('Please agree to the app rules');
          setLoading(false);
          return;
        }
        setSignupStep(3);
        setLoading(false);
        return;
      } else if (signupStep === 3) {
        if (formData.selectedInterests.length < 3) {
          setError('Please select at least 3 interests');
          setLoading(false);
          return;
        }
        await signup(formData.email, formData.password, formData.username);
        
        // TODO: Save selected interests to user profile in Firestore
        console.log('Selected interests:', formData.selectedInterests);
        
        navigate('/');
        return;
      }
    } catch (err) {
      console.error('Auth error:', err);
      let errorMessage = err.message;
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already registered';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error('Google signup error:', err);
      setError(err.message || 'Failed to sign up with Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/logo/ahkili-01.png" 
            alt="Ahkili Logo" 
            className="h-16 mx-auto mb-4"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-orange-500 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Create Account</h1>
            <p className="text-orange-100">Step {signupStep} of 3</p>
            <div className="flex gap-2 mt-3">
              {[1, 2, 3].map(step => (
                <div 
                  key={step}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    step <= signupStep ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* SIGNUP STEP 1: Basic Info */}
            {signupStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? 'Loading...' : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* SIGNUP STEP 2: Rules Agreement */}
            {signupStep === 2 && (
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                    Community Rules
                  </h3>
                  <ul className="space-y-2">
                    {appRules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-orange-600 font-bold mt-0.5">{index + 1}.</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreedToRules}
                      onChange={(e) => setFormData({...formData, agreedToRules: e.target.checked})}
                      className="mt-1 w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      I have read and agree to follow the community rules and guidelines
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? 'Loading...' : (
                      <>
                        Continue
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* SIGNUP STEP 3: Interests Selection */}
            {signupStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Choose Your Interests</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Select at least 3 topics you're interested in ({formData.selectedInterests.length} selected)
                  </p>
                  <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                    {interests.map(interest => (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => toggleInterest(interest.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          formData.selectedInterests.includes(interest.id)
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{interest.icon}</span>
                          <span className="text-sm font-medium text-gray-700">
                            {interest.name}
                          </span>
                        </div>
                        {formData.selectedInterests.includes(interest.id) && (
                          <CheckCircle className="w-4 h-4 text-orange-600 mt-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSignupStep(2)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? 'Creating Account...' : (
                      <>
                        Create Account
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Divider and Google Signup - Only show on step 1 */}
            {signupStep === 1 && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* Google Signup Button */}
                <button 
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  type="button"
                  className="w-full flex items-center justify-center space-x-2 border-2 border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-semibold text-gray-700">Continue with Google</span>
                </button>
              </>
            )}

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?
                {' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-orange-600 font-semibold hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;