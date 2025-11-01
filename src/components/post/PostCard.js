import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreVertical, Trash2, Flag } from 'lucide-react';
import { useUserSync } from '../../hooks/useUserSync';
import { deletePost as deletePostAPI, toggleReaction, checkUserReaction } from '../../services/api';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const PostCard = ({ post, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingReaction, setLoadingReaction] = useState(false);
  const { backendUser } = useUserSync();

  // Check if post is by a verified doctor
  const isDoctorPost = post.author?.role === 'doctor' && post.author?.verified;

  // Check if user has liked this post
  useEffect(() => {
    const checkReaction = async () => {
      if (backendUser && post.id) {
        try {
          const reaction = await checkUserReaction(post.id, backendUser.id);
          setLiked(reaction.has_reacted);
          setLikesCount(post.reactions_count || 0);
        } catch (error) {
          setLiked(false);
          setLikesCount(post.reactions_count || 0);
        }
      } else {
        setLiked(false);
        setLikesCount(post.reactions_count || 0);
      }
    };

    checkReaction();
  }, [post, backendUser]);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!backendUser) return;

    setLoadingReaction(true);
    try {
      const result = await toggleReaction(post.id, backendUser.id);
      setLikesCount(result.reactions_count);
      setLiked(result.user_has_reacted);
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Error toggling like');
    } finally {
      setLoadingReaction(false);
    }
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

  const handleReport = async () => {
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

  const authorName = post.is_anonymous ? 'Anonymous' : (post.author?.username || 'Anonymous');
  const communityName = post.community?.name || 'General';
  const timeAgo = post.created_at ? getTimeAgo(post.created_at) : 'Recently';
  const isOwner = backendUser && post.user_id === backendUser.id;
  const commentCount = post.comments_count || post.comments?.length || 0;

  return (
    <div className={`relative rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition ${
      isDoctorPost 
        ? 'bg-white border-2 border-blue-100' 
        : 'bg-white border border-gray-100'
    }`}>
      {/* Doctor Post Accent Line */}
      {isDoctorPost && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-t-lg" />
      )}

      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
            isDoctorPost 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
              : 'bg-primary'
          }`}>
            {communityName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-800">
                <span className="font-bold hover:underline cursor-pointer">{communityName}</span>
                {!post.is_anonymous && (
                  <>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-gray-600">{authorName}</span>
                  </>
                )}
              </p>
              {isDoctorPost && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-semibold border border-blue-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Verified Doctor
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
        
        {/* Menu Button */}
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
        <h2 className={`text-xl font-bold mb-2 hover:text-primary transition cursor-pointer ${
          isDoctorPost ? 'text-gray-900' : 'text-gray-800'
        }`} dir="auto">
          {post.title}
        </h2>
      </Link>
      <p className="text-gray-600 mb-4 line-clamp-3 whitespace-pre-line" dir="auto">{post.content}</p>

      {/* Post Image */}
      {(post.image_url || post.imageUrl) && (
        <div className={`rounded-lg mb-4 overflow-hidden ${
          isDoctorPost 
            ? 'bg-blue-50 border border-blue-100' 
            : 'bg-gray-50 border border-gray-100'
        }`}>
          <img
            src={post.image_url || post.imageUrl}
            alt={post.title}
            className="w-full max-h-96 object-contain"
          />
        </div>
      )}

      {/* Post Video */}
      {(post.video_url || post.videoUrl) && (
        <div className={`rounded-lg mb-4 overflow-hidden ${
          isDoctorPost 
            ? 'bg-blue-50 border border-blue-100' 
            : 'bg-gray-50 border border-gray-100'
        }`}>
          <video
            controls
            className="w-full max-h-96"
          >
            <source src={post.video_url || post.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center space-x-6 pt-4 border-t">
        <button 
          onClick={handleLike}
          disabled={loadingReaction || !backendUser}
          className={`flex items-center space-x-2 transition ${
            liked 
              ? 'text-red-600' 
              : 'text-gray-600 hover:text-red-600'
          } disabled:opacity-50`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          <span className="text-sm font-semibold">{likesCount}</span>
        </button>

        <Link to={`/post/${post.id}`}>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-primary transition">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{commentCount}</span>
          </button>
        </Link>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareMenu(!showShareMenu);
            }}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>

          {showShareMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-xl z-20 border border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const postUrl = `${window.location.origin}/post/${post.id}`;
                  navigator.clipboard.writeText(postUrl);
                  alert('Link copied!');
                  setShowShareMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors rounded-t-lg"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Copy Link</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const postUrl = `${window.location.origin}/post/${post.id}`;
                  const text = `Check out this post: "${post.title}"`;
                  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(text)}`;
                  window.open(twitterUrl, '_blank');
                  setShowShareMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors border-t"
              >
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9 1.5 11-4.5a17.84 17.84 0 001-4c0-.5.5-1.5 1-2z"/>
                </svg>
                <span className="text-sm font-medium">Twitter</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const postUrl = `${window.location.origin}/post/${post.id}`;
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check out: "${post.title}" ${postUrl}`)}`;
                  window.open(whatsappUrl, '_blank');
                  setShowShareMenu(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors border-t rounded-b-lg"
              >
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.281-3.89 6.347-1.608 9.402a9.9 9.9 0 001.640 1.618l.105.061a9.9 9.9 0 005.116 1.536h.004c5.514 0 10-4.486 10-10s-4.486-10-10-10z"/>
                </svg>
                <span className="text-sm font-medium">WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;