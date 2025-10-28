import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Globe, Bell, Lock, Trash2, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const Settings = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { showSuccess, showError } = useToast();
  const { currentUser } = useAuth();
  
  const [settings, setSettings] = useState({
    language: i18n.language || 'en',
    emailNotifications: true,
    pushNotifications: false,
    commentReactions: true,
    commentReplies: true,
    postReactions: true,
    newPosts: false,
    publicProfile: true,
    showEmail: false
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get user ID from localStorage if currentUser is not available
    const getUserId = async () => {
      if (currentUser?.id) {
        setUserId(currentUser.id);
      } else {
        // Try to get from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            setUserId(user.id);
          } catch (error) {
            console.error('Error parsing stored user:', error);
          }
        }
      }
    };

    getUserId();
  }, [currentUser]);

  useEffect(() => {
    if (userId) {
      fetchNotificationPreferences();
    }
  }, [userId]);

  const fetchNotificationPreferences = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.get(`/notification-preferences/${userId}`);
      setSettings(prev => ({
        ...prev,
        emailNotifications: response.data.email_notifications,
        pushNotifications: response.data.push_notifications,
        commentReactions: response.data.comment_reactions,
        commentReplies: response.data.comment_replies,
        postReactions: response.data.post_reactions,
        newPosts: response.data.new_posts
      }));
    } catch (error) {
      console.error('Error fetching preferences:', error);
      // If 404, preferences don't exist yet - will be created on first save
      if (error.response?.status !== 404) {
        showError('Failed to load notification preferences');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setSettings({ ...settings, language: lang });
    
    // Apply RTL for Arabic
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang;
    }

    // Save to localStorage immediately
    localStorage.setItem('language', lang);
  };

  const handleToggle = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    
    // Auto-save notification preferences
    const notificationKeys = [
      'emailNotifications', 
      'pushNotifications', 
      'commentReactions', 
      'commentReplies', 
      'postReactions', 
      'newPosts'
    ];
    
    if (notificationKeys.includes(key)) {
      await saveNotificationPreferences(newSettings);
    } else {
      // Save other settings to localStorage
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
    }
  };

  const saveNotificationPreferences = async (settingsToSave = settings) => {
    if (!userId) {
      console.error('No user ID available');
      return false;
    }

    setSaving(true);
    try {
      await api.put(`/notification-preferences/${userId}`, {
        email_notifications: settingsToSave.emailNotifications,
        push_notifications: settingsToSave.pushNotifications,
        comment_reactions: settingsToSave.commentReactions,
        comment_replies: settingsToSave.commentReplies,
        post_reactions: settingsToSave.postReactions,
        new_posts: settingsToSave.newPosts
      });

      showSuccess('Preferences saved');
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      showError('Failed to save preferences');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      showError('Please log in to save settings');
      return;
    }

    // Save notification preferences to backend
    const success = await saveNotificationPreferences();
    
    // Save other settings to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    if (success) {
      showSuccess(t('settings.saved'));
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <button 
        onClick={() => navigate('/profile')}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t('common.back')}</span>
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('settings.title')}</h1>
        {saving && (
          <div className="flex items-center space-x-2 text-primary">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Saving...</span>
          </div>
        )}
      </div>

      {/* Language Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-800">{t('settings.language')}</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`p-4 border-2 rounded-lg transition ${
              settings.language === 'en'
                ? 'border-primary bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">🇬🇧</div>
            <div className="font-semibold">English</div>
          </button>

          <button
            onClick={() => handleLanguageChange('ar')}
            className={`p-4 border-2 rounded-lg transition ${
              settings.language === 'ar'
                ? 'border-primary bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">🇩🇿</div>
            <div className="font-semibold">العربية</div>
          </button>

          <button
            onClick={() => handleLanguageChange('fr')}
            className={`p-4 border-2 rounded-lg transition ${
              settings.language === 'fr'
                ? 'border-primary bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">🇫🇷</div>
            <div className="font-semibold">Français</div>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Bell className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-800">{t('settings.notifications')}</h2>
          <span className="text-xs text-gray-500">(Auto-saved)</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-700 font-medium">{t('settings.emailNotif')}</span>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              disabled={saving}
              className={`relative w-12 h-6 rounded-full transition ${
                settings.emailNotifications ? 'bg-primary' : 'bg-gray-300'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-700 font-medium">{t('settings.pushNotif')}</span>
              <p className="text-sm text-gray-500">Receive push notifications</p>
            </div>
            <button
              onClick={() => handleToggle('pushNotifications')}
              disabled={saving}
              className={`relative w-12 h-6 rounded-full transition ${
                settings.pushNotifications ? 'bg-primary' : 'bg-gray-300'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                settings.pushNotifications ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Notification Types</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Comment Reactions</span>
                <button
                  onClick={() => handleToggle('commentReactions')}
                  disabled={saving}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.commentReactions ? 'bg-primary' : 'bg-gray-300'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                    settings.commentReactions ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Comment Replies</span>
                <button
                  onClick={() => handleToggle('commentReplies')}
                  disabled={saving}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.commentReplies ? 'bg-primary' : 'bg-gray-300'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                    settings.commentReplies ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Post Reactions</span>
                <button
                  onClick={() => handleToggle('postReactions')}
                  disabled={saving}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.postReactions ? 'bg-primary' : 'bg-gray-300'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                    settings.postReactions ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">New Posts in Followed Communities</span>
                <button
                  onClick={() => handleToggle('newPosts')}
                  disabled={saving}
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.newPosts ? 'bg-primary' : 'bg-gray-300'
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                    settings.newPosts ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Lock className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-800">{t('settings.privacy')}</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">{t('settings.publicProfile')}</span>
            <button
              onClick={() => handleToggle('publicProfile')}
              className={`relative w-12 h-6 rounded-full transition ${
                settings.publicProfile ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                settings.publicProfile ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">{t('settings.showEmail')}</span>
            <button
              onClick={() => handleToggle('showEmail')}
              className={`relative w-12 h-6 rounded-full transition ${
                settings.showEmail ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                settings.showEmail ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Trash2 className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-800">{t('settings.account')}</h2>
        </div>
        
        <div className="space-y-3">
          <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-left">
            {t('settings.changePassword')}
          </button>
          <button className="w-full px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-left">
            {t('settings.deleteAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;