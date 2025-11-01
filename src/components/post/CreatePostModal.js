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
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 pb-8 overflow-y-auto bg-black/60 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl mb-8">
        {/* Header - Sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">{t('post.createPost')}</h2>
          <button
            onClick={onClose}
            disabled={uploading}
            className="p-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* LEFT COLUMN */}
            <div className="space-y-5">
              {/* Community Selector */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  {t('post.chooseComm')}
                </label>
                <select
                  name="communityId"
                  value={formData.communityId}
                  onChange={(e) => setFormData({...formData, communityId: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 transition-all border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={uploading}
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
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  {t('post.title')}
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={t('post.titlePlaceholder')}
                  className="w-full px-4 py-3 transition-all border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={uploading}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  {t('post.content')}
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder={t('post.contentPlaceholder')}
                  rows="6"
                  className="w-full px-4 py-3 transition-all border border-gray-300 resize-none rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={uploading}
                />
              </div>

              {/* Media Upload Options */}
              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">
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
                      disabled={videoFile !== null || uploading}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed rounded-xl transition ${
                        videoFile || uploading
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
                          : imageFile
                          ? 'border-green-500 bg-green-50 cursor-pointer'
                          : 'border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer'
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
                      disabled={imageFile !== null || uploading}
                      className="hidden"
                    />
                    <label
                      htmlFor="video-upload"
                      className={`flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed rounded-xl transition ${
                        imageFile || uploading
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
                          : videoFile
                          ? 'border-green-500 bg-green-50 cursor-pointer'
                          : 'border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer'
                      }`}
                    >
                      <VideoIcon className={`w-5 h-5 ${videoFile ? 'text-green-600' : 'text-primary'}`} />
                      <span className={`font-medium text-sm ${videoFile ? 'text-green-700' : 'text-gray-700'}`}>
                        {videoFile ? '✓ Video' : t('post.addVideo')}
                      </span>
                    </label>
                  </div>
                </div>
                <p className="mt-2 text-xs text-center text-gray-500">
                  {t('post.mediaNote')}
                </p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-contain w-full border-2 border-gray-200 max-h-60 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={uploading}
                    className="absolute p-2 text-white transition bg-red-500 rounded-full shadow-lg top-2 right-2 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Video Preview */}
              {videoPreview && (
                <div className="relative">
                  <video
                    controls
                    className="w-full border-2 border-gray-200 max-h-60 rounded-xl"
                  >
                    <source src={videoPreview} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    disabled={uploading}
                    className="absolute p-2 text-white transition bg-red-500 rounded-full shadow-lg top-2 right-2 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5">
              {/* Anonymous Toggle */}
              <div className="p-5 border-2 border-purple-200 shadow-sm bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center mb-2 space-x-2">
                      <span className="text-xl">🕶️</span>
                      <p className="text-base font-bold text-gray-900">{t('post.postAnonymously')}</p>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600">
                      {t('post.anonymousDescription')}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      name="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                      disabled={uploading}
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
                          <span className="flex items-center justify-center text-xs font-bold text-purple-600">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Guidelines */}
              <div className="p-5 border-2 border-blue-200 shadow-sm bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl">
                <h4 className="flex items-center mb-3 text-sm font-bold text-gray-900">
                  <span className="mr-2 text-xl">ℹ️</span>
                  {t('post.guidelines')}
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 mt-0.5 mr-2 text-sm text-green-600">✓</span>
                    <span className="text-xs leading-relaxed text-gray-700">{t('post.guidelineRespect')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 mt-0.5 mr-2 text-sm text-green-600">✓</span>
                    <span className="text-xs leading-relaxed text-gray-700">{t('post.guidelineNoHarm')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 mt-0.5 mr-2 text-sm text-green-600">✓</span>
                    <span className="text-xs leading-relaxed text-gray-700">{t('post.guidelinePrivacy')}</span>
                  </li>
                  <li className="flex items-start p-2 bg-red-50 border border-red-200 rounded-lg">
                    <span className="flex-shrink-0 mt-0.5 mr-2 text-sm text-red-600">⚠</span>
                    <span className="text-xs font-semibold leading-relaxed text-red-900">{t('post.guidelineCrisis')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons - Full Width at Bottom */}
          <div className="flex pt-6 mt-6 space-x-3 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-6 py-3 font-semibold text-gray-700 transition-all border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50"
            >
              {t('post.cancel')}
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center justify-center flex-1 px-6 py-3 space-x-2 font-semibold text-white transition-all rounded-xl bg-primary hover:bg-green-600 disabled:opacity-50 shadow-lg hover:shadow-xl"
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