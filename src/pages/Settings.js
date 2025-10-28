import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Globe, Bell, Lock, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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

  useEffect(() => {
    fetchNotificationPreferences();
  }, []);

  const fetchNotificationPreferences = async () => {
    if (!currentUser?.id) return;
    
    try {
      const response = await api.get(`/notification-preferences/${currentUser.id}`);
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
  };

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    if (!currentUser?.id) {
      showError('Please log in to save settings');
      return;
    }

    try {
      // Save notification preferences to backend
      await api.put(`/notification-preferences/${currentUser.id}`, {
        email_notifications: settings.emailNotifications,
        push_notifications: settings.pushNotifications,
        comment_reactions: settings.commentReactions,
        comment_replies: settings.commentReplies,
        post_reactions: settings.postReactions,
        new_posts: settings.newPosts
      });

      // Save other settings to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      showSuccess(t('settings.saved'));
    } catch (error) {
      console.error('Error saving settings:', error);
      showError('Failed to save settings');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-8">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <button 
        onClick={() => navigate('/profile')}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t('common.back')}</span>
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('settings.title')}</h1>

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
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-700 font-medium">{t('settings.emailNotif')}</span>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative w-12 h-6 rounded-full transition ${
                settings.emailNotifications ? 'bg-primary' : 'bg-gray-300'
              }`}
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
              className={`relative w-12 h-6 rounded-full transition ${
                settings.pushNotifications ? 'bg-primary' : 'bg-gray-300'
              }`}
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
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.commentReactions ? 'bg-primary' : 'bg-gray-300'
                  }`}
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
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.commentReplies ? 'bg-primary' : 'bg-gray-300'
                  }`}
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
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.postReactions ? 'bg-primary' : 'bg-gray-300'
                  }`}
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
                  className={`relative w-12 h-6 rounded-full transition ${
                    settings.newPosts ? 'bg-primary' : 'bg-gray-300'
                  }`}
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

     
      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-600 transition font-semibold"
      >
        <Save className="w-5 h-5" />
        <span>{t('settings.saveChanges')}</span>
      </button>
    </div>
  );
};

export default Settings;