import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Send, ArrowLeft, Loader } from 'lucide-react';
import { getPost, getComments, createComment as createCommentAPI } from '../services/api';
import { useUserSync } from '../hooks/useUserSync';
import Comment from '../components/post/Comment';
import { useTranslation } from 'react-i18next';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { backendUser } = useUserSync();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        getPost(id),
        getComments(id)
      ]);
      setPost(postData);
      setComments(commentsData);
      setLikesCount(postData.reactions_count || postData.likes || 0);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
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
      
      // Add new comment to the list
      setComments([...comments, createdComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyAdded = (reply) => {
    // Refresh comments to get updated structure with replies
    fetchData();
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
          <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-semibold">{likesCount}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-primary transition">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{comments.length}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-primary transition">
            <Share2 className="w-5 h-5" />
            <span className="text-sm">{t('post.share')}</span>
          </button>
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