import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Globe, Sun, Moon, Bell, Lock, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Settings = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { showSuccess } = useToast();
  
  const [settings, setSettings] = useState({
    language: i18n.language || 'en',
    theme: localStorage.getItem('theme') || 'light',
    emailNotifications: true,
    pushNotifications: false,
    publicProfile: true,
    showEmail: false
  });

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

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

  const handleThemeChange = (theme) => {
    setSettings({ ...settings, theme });
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    showSuccess(t('settings.saved'));
  };

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

      {/* Theme Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          {settings.theme === 'light' ? (
            <Sun className="w-6 h-6 text-primary" />
          ) : (
            <Moon className="w-6 h-6 text-primary" />
          )}
          <h2 className="text-xl font-bold text-gray-800">{t('settings.theme')}</h2>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => handleThemeChange('light')}
            className={`flex-1 p-4 border-2 rounded-lg transition ${
              settings.theme === 'light'
                ? 'border-primary bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Sun className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold">{t('settings.light')}</div>
          </button>

          <button
            onClick={() => handleThemeChange('dark')}
            className={`flex-1 p-4 border-2 rounded-lg transition ${
              settings.theme === 'dark'
                ? 'border-primary bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Moon className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold">{t('settings.dark')}</div>
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
            <span className="text-gray-700">{t('settings.emailNotif')}</span>
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
            <span className="text-gray-700">{t('settings.pushNotif')}</span>
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