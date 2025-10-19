import React, { useState } from 'react';
import { X, Image as ImageIcon, Loader } from 'lucide-react';
import { uploadImage } from '../../services/api';
import { useTranslation } from 'react-i18next';

const CreatePostModal = ({ isOpen, onClose, onSubmit, defaultCommunity }) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    community: defaultCommunity || 'Anxiety Support'
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const communities = [
    'Anxiety Support',
    'Depression Support',
    'Mindfulness & Meditation',
    'PTSD Recovery',
    'Self-Care & Wellness',
    'Stress Management'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = null;

      // Upload image if selected
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile);
        imageUrl = uploadResult.url;
      }

      // Submit post with image URL
      await onSubmit({
        ...formData,
        imageUrl
      });

      // Reset form
      setFormData({ title: '', content: '', community: defaultCommunity || 'Anxiety Support' });
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">{t('post.createPost')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Community Selector */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('post.chooseComm')}
            </label>
            <select
              name="community"
              value={formData.community}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {communities.map(community => (
                <option key={community} value={community}>
                  {community}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('post.title')}
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t('post.titlePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('post.content')}
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder={t('post.contentPlaceholder')}
              rows="8"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
              />

              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Image Upload */}
          <div className="mb-6">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition cursor-pointer"
            >
              <ImageIcon className="w-5 h-5" />
              <span>{imageFile ? t('post.changeImage') : t('post.addImage')}</span>
            </label>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">{t('post.guidelines')}</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• {t('post.guidelineRespect')}</li>
              <li>• {t('post.guidelineNoHarm')}</li>
              <li>• {t('post.guidelinePrivacy')}</li>
              <li>• {t('post.guidelineCrisis')}</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold disabled:opacity-50"
            >
              {t('post.cancel')}
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-600 transition font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>{t('post.posting')}</span>
                </>
              ) : (
                <span>{t('post.post')}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;