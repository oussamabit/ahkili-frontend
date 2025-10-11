import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreVertical, Trash2, Flag } from 'lucide-react';
import { useUserSync } from '../../hooks/useUserSync';
import { deletePost as deletePostAPI, toggleReaction } from '../../services/api';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const PostCard = ({ post, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { backendUser } = useUserSync();

  useEffect(() => {
    // Initialize likes from post data or default to 0
    setLikesCount(post.reactions_count || post.likes || 0);
    setLiked(post.user_has_reacted || false);
  }, [post]);

  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking like
    if (!backendUser) return;

    try {
      const result = await toggleReaction(post.id, backendUser.id);
      setLikesCount(result.reactions_count);
      setLiked(result.user_has_reacted);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleReport = async () => {
    if (!backendUser) {
      alert('Please log in to report posts.');
      return;
    }

    const reason = prompt('Why are you reporting this post?');
    if (!reason) return;

    try {
      await axios.post(`${API_URL}/admin/reports?user_id=${backendUser.id}`, {
        target_type: 'post',
        target_id: post.id,
        reason: reason
      });
      alert('Report submitted. Thank you!');
      setShowMenu(false);
    } catch (error) {
      console.error('Error reporting post:', error);
      alert('Failed to submit report.');
    }
  };

  // Format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePostAPI(post.id, backendUser.id);
      if (onDelete) onDelete(post.id);
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. You can only delete your own posts.');
    }
  };

  // Get author name (from backend or default)
  const authorName = post.author?.username || 'Anonymous';
  const communityName = post.community?.name || 'General';
  const timeAgo = post.created_at ? getTimeAgo(post.created_at) : 'Recently';
  const isOwner = backendUser && post.user_id === backendUser.id;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{authorName}</p>
            <p className="text-xs text-gray-500">{communityName} • {timeAgo}</p>
          </div>
        </div>
        
        {/* Menu Button (visible for all users) */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
              {isOwner ? (
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Post</span>
                </button>
              ) : (
                <button
                  onClick={handleReport}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                >
                  <Flag className="w-4 h-4" />
                  <span>Report Post</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <Link to={`/post/${post.id}`}>
        <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-primary transition cursor-pointer">
          {post.title}
        </h2>
      </Link>
      <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>

      {/* Post Image (if exists) */}
      {post.image_url && (
        <img 
          src={post.image_url} 
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

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
          <span className="text-sm">{post.comments?.length || 0}</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-primary transition">
          <Share2 className="w-5 h-5" />
          <span className="text-sm">Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;