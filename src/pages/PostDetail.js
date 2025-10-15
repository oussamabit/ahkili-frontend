import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Send, ArrowLeft, Loader, Copy, Check } from 'lucide-react';
import { getPost, getComments, createComment as createCommentAPI, toggleReaction } from '../services/api';
import { useUserSync } from '../hooks/useUserSync';
import { useToast } from '../context/ToastContext';
import Comment from '../components/post/Comment';
import { useTranslation } from 'react-i18next';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingReaction, setLoadingReaction] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { backendUser } = useUserSync();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      console.log('Fetching post with ID:', id);
      const [postData, commentsData] = await Promise.all([
        getPost(id),
        getComments(id)
      ]);
      
      console.log('Post data:', postData);
      console.log('Comments data:', commentsData);
      
      if (!postData || !postData.id) {
        throw new Error('Invalid post data');
      }
      
      setPost(postData);
      setComments(commentsData || []);
      setLikesCount(postData.reactions_count || postData.likes || 0);
      setLiked(postData.user_has_reacted || false);
    } catch (error) {
      console.error('Error fetching post:', error);
      showError('Failed to load post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!backendUser) return;
    
    setLoadingReaction(true);
    try {
      const result = await toggleReaction(parseInt(id), backendUser.id);
      setLikesCount(result.reactions_count);
      setLiked(result.user_has_reacted);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoadingReaction(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !backendUser) return;

    setSubmitting(true);
    try {
      const createdComment = await createCommentAPI(
        parseInt(id),
        { content: newComment },
        backendUser.id
      );
      
      setComments([...comments, createdComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyAdded = (reply) => {
    fetchData();
  };

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    showSuccess('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareToTwitter = () => {
    const postUrl = `${window.location.origin}/post/${id}`;
    const text = `Check out this post on Ahkili: "${post.title}"`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleShareToFacebook = () => {
    const postUrl = `${window.location.origin}/post/${id}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleShareToWhatsApp = () => {
    const postUrl = `${window.location.origin}/post/${id}`;
    const text = `Check out this post on Ahkili: "${post.title}" ${postUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return t('common.justNow');
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{t('common.error')}</p>
      </div>
    );
  }

  const authorName = post.author?.username || 'Anonymous';
  const communityName = post.community?.name || 'General';
  const isDoctorVerified = post.author?.role === 'doctor' && post.author?.verified;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t('common.back')}</span>
      </button>

      {/* Post Detail */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Post Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-gray-800">{authorName}</p>
              {isDoctorVerified && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                  Verified Doctor
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {communityName} • {getTimeAgo(post.created_at)}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h1>

        {/* Post Image */}
        {(post.image_url || post.imageUrl) && (
          <img 
            src={post.image_url || post.imageUrl} 
            alt={post.title}
            className="w-full h-auto max-h-96 object-cover rounded-lg mb-6"
          />
        )}

        <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
          {post.content}
        </div>

        {/* Post Actions */}
        <div className="flex items-center space-x-6 pt-4 border-t">
          <button 
            onClick={handleLike}
            disabled={loadingReaction}
            className={`flex items-center space-x-2 transition ${
              liked 
                ? 'text-red-600' 
                : 'text-gray-600 hover:text-red-600'
            } disabled:opacity-50`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm font-semibold">{likesCount}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-600 hover:text-primary transition">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{comments.length}</span>
          </button>

          {/* Share Button with Menu */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm">{t('post.share')}</span>
            </button>

            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
                <button
                  onClick={handleCopyLink}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-2 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 text-gray-600" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShareToTwitter}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-2 transition border-t"
                >
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9 1.5 11-4.5a17.84 17.84 0 001-4c0-.5.5-1.5 1-2z"/>
                  </svg>
                  <span>Twitter</span>
                </button>

                <button
                  onClick={handleShareToFacebook}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-2 transition border-t"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z"/>
                  </svg>
                  <span>Facebook</span>
                </button>

                <button
                  onClick={handleShareToWhatsApp}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-2 transition border-t"
                >
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.281-3.89 6.347-1.608 9.402a9.9 9.9 0 001.640 1.618l.105.061a9.9 9.9 0 005.116 1.536h.004c5.514 0 10-4.486 10-10s-4.486-10-10-10z"/>
                  </svg>
                  <span>WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Comment */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">{t('post.reply')}</h3>
        <form onSubmit={handleAddComment} className="flex space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {backendUser?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t('post.writeReply')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{t('common.send')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-6">
          {t('post.comments')} ({comments.length})
        </h3>
        
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t('post.noPosts')}</p>
        ) : (
          <div className="space-y-6">
            {comments.map(comment => (
              <Comment
                key={comment.id}
                comment={comment}
                postId={parseInt(id)}
                onReplyAdded={handleReplyAdded}
                depth={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;