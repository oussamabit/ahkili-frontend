import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Send, ArrowLeft } from 'lucide-react';
import { getPost, getComments, createComment as createCommentAPI , toggleReaction } from '../services/api';
import { useUserSync } from '../hooks/useUserSync';
import { CommentSkeleton } from '../components/common/SkeletonLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import { useToast } from '../context/ToastContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { backendUser } = useUserSync();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const [postData, commentsData] = await Promise.all([
          getPost(id),
          getComments(id)
        ]);
        setPost(postData);
        setComments(commentsData);

        setLikesCount(postData.reactions_count || postData.likes || 0);
        setLiked(postData.user_has_reacted || false);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !backendUser) return;

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
      showError('Failed to post comment. Please try again.');
    }
  };

  const handleLike = async () => {
    if (!backendUser) return;

    try {
      const result = await toggleReaction(parseInt(id), backendUser.id);
      setLikesCount(result.reactions_count);
      setLiked(result.user_has_reacted);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Post not found</p>
      </div>
    );
  }

  const authorName = post.author?.username || 'Anonymous';
  const communityName = post.community?.name || 'General';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Post Detail */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Post Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{authorName}</p>
            <p className="text-sm text-gray-500">
              {communityName} • {getTimeAgo(post.created_at)}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h1>

        {/* Post Image (if exists) */}
        {post.image_url && (
          <img 
            src={post.image_url} 
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
            className={`flex items-center space-x-2 transition ${
              liked 
                ? 'text-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm font-semibold">{likesCount}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-primary transition">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{comments.length}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-primary transition">
            <Share2 className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>

      {/* Add Comment */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Add a comment</h3>
        <form onSubmit={handleAddComment} className="flex space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {backendUser?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Post</span>
            </button>
          </div>
        </form>
      </div>

     
       {/* Comments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-6">
          Comments ({comments.length})
        </h3>
        
        {commentsLoading ? (
          <div>
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-6">
            {comments.map(comment => {
              const commentAuthor = comment.author?.username || 'Anonymous';
              return (
                <div key={comment.id} className="flex space-x-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {commentAuthor.charAt(0).toUpperCase()}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-semibold text-gray-800">{commentAuthor}</p>
                        <span className="text-xs text-gray-500">• {getTimeAgo(comment.created_at)}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 mt-2 ml-4">
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-primary transition text-sm">
                        <Heart className="w-4 h-4" />
                        <span>0</span>
                      </button>
                      <button className="text-gray-600 hover:text-primary transition text-sm">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;