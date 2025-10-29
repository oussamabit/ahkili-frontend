import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Send, ArrowLeft, Loader, Copy, Check, Sparkles } from 'lucide-react';
import { getPost, getComments, createComment as createCommentAPI, toggleReaction, checkUserReaction } from '../services/api';
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
      
      const postData = await getPost(id);

      
      const commentsData = await getComments(id);
      
      if (!postData || !postData.id) {
        throw new Error('Invalid post data returned');
      }
      
      // Ensure comments is always an array
      const validComments = Array.isArray(commentsData) ? commentsData : [];
      
      setPost(postData);
      setComments(validComments);
      setLikesCount(postData.reactions_count || 0);
      
      // Check if user has reacted to this post
      if (backendUser) {
        try {
          const reaction = await checkUserReaction(postData.id, backendUser.id);
          setLiked(reaction.has_reacted);
        } catch (error) {
          console.error('Error checking reaction:', error);
          setLiked(false);
        }
      } else {
        setLiked(false);
      }
    } catch (error) {
      console.error('=== Error fetching post:', error);
      console.error('=== Error details:', error.response?.data || error.message);
      showError('Failed to load post. Check console for details.');
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
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <MessageCircle className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-2xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-100">
            <p className="text-gray-600 text-lg">{t('common.error')}</p>
          </div>
        </div>
      </div>
    );
  }

  const authorName = post.is_anonymous ? 'Anonymous' : (post.author?.username || 'Anonymous');  const communityName = post.community?.name || 'General';
  const isDoctorVerified = post.author?.role === 'doctor' && post.author?.verified;

  return (
    <div className="max-w-4xl mx-auto min-h-screen">
      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition-all duration-300 font-medium"
      >
        <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-lg transition-all group-hover:scale-110">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span>{t('common.back')}</span>
      </button>

      {/* Post Detail Card */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-3xl blur-xl" />
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-100">
          {/* Post Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              {communityName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-gray-800 text-lg">
                  <span className="font-bold hover:underline cursor-pointer">{communityName}</span>
                  {!post.is_anonymous && (
                    <>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="font-medium text-gray-600">{authorName}</span>
                    </>
                  )}
                </p>
                {isDoctorVerified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-primary/20 text-blue-800 text-xs rounded-full font-bold border border-blue-200">
                    <Sparkles className="w-3 h-3" />
                    Verified Doctor
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {getTimeAgo(post.created_at)}
              </p>
            </div>
          </div>

          {/* Post Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6 leading-tight" dir="auto">{post.title}</h1>
          {/* Post Image */}
      {(post.image_url || post.imageUrl) && (
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <img
            src={post.image_url || post.imageUrl}
            alt={post.title}
            className="w-full max-h-96 object-contain rounded-lg border border-green-100"
          />
        </div>
      )}

      {/* Post Video */}
      {(post.video_url || post.videoUrl) && (
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <video
            controls
            className="w-full max-h-96 rounded-lg border border-green-100"
          >
            <source src={post.video_url || post.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

          {/* Post Content */}
          <div className="text-gray-700 leading-relaxed mb-8 whitespace-pre-line text-lg" dir="auto">
            {post.content}
          </div>

          {/* Post Actions */}
          <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
            <button 
              onClick={handleLike}
              disabled={loadingReaction || !backendUser}
              className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                liked 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              } disabled:opacity-50`}
            >
              <Heart className={`w-6 h-6 transition-transform group-hover:scale-110 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm font-bold">{likesCount}</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-600 bg-gray-50">
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm font-bold">{comments.length}</span>
            </div>

            {/* Share Button with Menu */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-all"
              >
                <Share2 className="w-6 h-6" />
                <span className="text-sm font-bold">{t('post.share')}</span>
              </button>

              {/* Share Menu */}
              {showShareMenu && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl z-10 border border-gray-100 overflow-hidden">
                  <button
                    onClick={handleCopyLink}
                    className="w-full px-5 py-4 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-green-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShareToTwitter}
                    className="w-full px-5 py-4 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-t"
                  >
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9 1.5 11-4.5a17.84 17.84 0 001-4c0-.5.5-1.5 1-2z"/>
                    </svg>
                    <span className="font-medium">Twitter</span>
                  </button>

                  <button
                    onClick={handleShareToFacebook}
                    className="w-full px-5 py-4 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-t"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z"/>
                    </svg>
                    <span className="font-medium">Facebook</span>
                  </button>

                  <button
                    onClick={handleShareToWhatsApp}
                    className="w-full px-5 py-4 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-t"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.281-3.89 6.347-1.608 9.402a9.9 9.9 0 001.640 1.618l.105.061a9.9 9.9 0 005.116 1.536h.004c5.514 0 10-4.486 10-10s-4.486-10-10-10z"/>
                    </svg>
                    <span className="font-medium">WhatsApp</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Comment Section */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl blur-xl" />
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">{t('post.reply')}</h3>
          <form onSubmit={handleAddComment} className="flex gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
              {backendUser?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('post.writeReply')}
                className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                {submitting ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">{t('common.send')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Comments Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-3xl blur-xl" />
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6 text-xl flex items-center gap-2">
            {t('post.comments')} 
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {comments.length}
            </span>
          </h3>
          
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{t('post.noPosts')}</p>
            </div>
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
    </div>
  );
};

export default PostDetail;