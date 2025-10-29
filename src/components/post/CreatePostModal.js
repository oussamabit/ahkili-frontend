import React, { useState } from 'react';
import { X, Image as ImageIcon, Video as VideoIcon, Loader } from 'lucide-react';
import { uploadImage, uploadVideo } from '../../services/api';
import { useTranslation } from 'react-i18next';

const CreatePostModal = ({ isOpen, onClose, onSubmit, defaultCommunity }) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    communityId: 1,
    isAnonymous: false
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleRemoveVideo();
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setMediaType('image');
    }
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert('Video file is too large. Maximum size is 50MB.');
        return;
      }
      handleRemoveImage();
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setMediaType('video');
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    if (mediaType === 'image') {
      setMediaType(null);
    }
  };

  const handleRemoveVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
    if (mediaType === 'video') {
      setMediaType(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = null;
      let videoUrl = null;

      if (imageFile) {
        const uploadResult = await uploadImage(imageFile);
        imageUrl = uploadResult.url;
      }

      if (videoFile) {
        const uploadResult = await uploadVideo(videoFile);
        videoUrl = uploadResult.url;
      }

      await onSubmit({
        title: formData.title,
        content: formData.content,
        community_id: formData.communityId,
        image_url: imageUrl,
        video_url: videoUrl,
        is_anonymous: formData.isAnonymous
      });

      setFormData({ 
        title: '', 
        content: '', 
        communityId: 1,
        isAnonymous: false 
      });
      setImageFile(null);
      setImagePreview(null);
      setVideoFile(null);
      setVideoPreview(null);
      setMediaType(null);
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
              name="communityId"
              value={formData.communityId}
              onChange={(e) => setFormData({...formData, communityId: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value={1}>Anxiety Support</option>
              <option value={2}>Depression Support</option>
              <option value={3}>Mindfulness & Meditation</option>
              <option value={4}>PTSD Recovery</option>
              <option value={5}>Self-Care & Wellness</option>
              <option value={6}>Stress Management</option>
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
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Video Preview */}
          {videoPreview && (
            <div className="mb-4 relative">
              <video
                controls
                className="w-full max-h-96 rounded-lg border border-gray-200"
              >
                <source src={videoPreview} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Media Upload Options */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t('post.addMedia')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Image Upload */}
              <div>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={videoFile !== null}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed rounded-lg transition cursor-pointer ${
                    videoFile 
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
                      : imageFile
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <ImageIcon className={`w-5 h-5 ${imageFile ? 'text-green-600' : 'text-primary'}`} />
                  <span className={`font-medium text-sm ${imageFile ? 'text-green-700' : 'text-gray-700'}`}>
                    {imageFile ? '✓ Image' : t('post.addImage')}
                  </span>
                </label>
              </div>

              {/* Video Upload */}
              <div>
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  disabled={imageFile !== null}
                  className="hidden"
                />
                <label
                  htmlFor="video-upload"
                  className={`flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed rounded-lg transition cursor-pointer ${
                    imageFile 
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
                      : videoFile
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <VideoIcon className={`w-5 h-5 ${videoFile ? 'text-green-600' : 'text-primary'}`} />
                  <span className={`font-medium text-sm ${videoFile ? 'text-green-700' : 'text-gray-700'}`}>
                    {videoFile ? '✓ Video' : t('post.addVideo')}
                  </span>
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {t('post.mediaNote')}
            </p>
          </div>

          {/* Anonymous Toggle - IMPROVED DESIGN */}
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border-2 border-purple-200 shadow-sm">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex-1 pr-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">🕶️</span>
                  <p className="font-bold text-gray-900 text-lg">{t('post.postAnonymously')}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('post.anonymousDescription')}
                </p>
              </div>
              <div className="flex-shrink-0">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="sr-only"
                />
                <div className={`relative w-14 h-8 rounded-full transition-all duration-300 ease-in-out ${
                  formData.isAnonymous 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-300' 
                    : 'bg-gray-300'
                }`}>
                  <div className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out top-1 ${
                    formData.isAnonymous ? 'translate-x-7' : 'translate-x-1'
                  }`}>
                    {formData.isAnonymous && (
                      <span className="flex items-center justify-center text-purple-600 text-xs font-bold">✓</span>
                    )}
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* Guidelines - IMPROVED DESIGN */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-5 mb-6 border-2 border-blue-200 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center text-base">
              <span className="text-2xl mr-2">ℹ️</span>
              {t('post.guidelines')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-600 text-lg mr-3 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-gray-700 leading-relaxed">{t('post.guidelineRespect')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 text-lg mr-3 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-gray-700 leading-relaxed">{t('post.guidelineNoHarm')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 text-lg mr-3 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-gray-700 leading-relaxed">{t('post.guidelinePrivacy')}</span>
              </li>
              <li className="flex items-start bg-red-50 rounded-lg p-3 border border-red-200">
                <span className="text-red-600 text-lg mr-3 mt-0.5 flex-shrink-0">⚠</span>
                <span className="text-sm text-red-900 leading-relaxed font-semibold">{t('post.guidelineCrisis')}</span>
              </li>
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