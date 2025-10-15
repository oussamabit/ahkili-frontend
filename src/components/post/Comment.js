import React, { useState } from 'react';
import { Heart, MessageCircle, ThumbsDown, Send, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { toggleCommentReaction, createComment } from '../../services/api';
import { useUserSync } from '../../hooks/useUserSync';

const Comment = ({ comment, postId, onReplyAdded, depth = 0 }) => {
  const { backendUser } = useUserSync();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(depth === 0); // Show replies for top-level comments
  const [replyContent, setReplyContent] = useState('');
  const [replying, setReplying] = useState(false);
  const [likes, setLikes] = useState(comment.reactions?.likes || 0);
  const [dislikes, setDislikes] = useState(comment.reactions?.dislikes || 0);
  const [userReaction, setUserReaction] = useState(null);
  const [loadingReaction, setLoadingReaction] = useState(false);

  const handleLike = async () => {
    if (!backendUser) return;
    
    setLoadingReaction(true);
    try {
      const result = await toggleCommentReaction(comment.id, backendUser.id, 'like');
      setLikes(result.likes);
      setDislikes(result.dislikes);
      setUserReaction(result.user_reaction);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoadingReaction(false);
    }
  };

  const handleDislike = async () => {
    if (!backendUser) return;
    
    setLoadingReaction(true);
    try {
      const result = await toggleCommentReaction(comment.id, backendUser.id, 'dislike');
      setLikes(result.likes);
      setDislikes(result.dislikes);
      setUserReaction(result.user_reaction);
    } catch (error) {
      console.error('Error toggling dislike:', error);
    } finally {
      setLoadingReaction(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !backendUser) return;

    setReplying(true);
    try {
      const reply = await createComment(postId, { content: replyContent }, backendUser.id, comment.id);
      setReplyContent('');
      setShowReplyForm(false);
      setShowReplies(true);
      
      if (onReplyAdded) {
        onReplyAdded(reply);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setReplying(false);
    }
  };

  const isDoctorVerified = comment.author?.role === 'doctor' && comment.author?.verified;
  const marginLeft = depth > 0 ? `ml-${Math.min(depth * 4, 12)}` : '';

  return (
    <div className={`mb-4 ${marginLeft}`}>
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {comment.author?.username?.charAt(0).toUpperCase()}
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          {/* Author Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <p className="font-semibold text-gray-800">{comment.author?.username}</p>
              {isDoctorVerified && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                  Verified Doctor
                </span>
              )}
              <span className="text-xs text-gray-500">
                • {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center space-x-4 mt-2 ml-4">
            <button
              onClick={handleLike}
              disabled={loadingReaction}
              className={`flex items-center space-x-1 text-sm transition ${
                userReaction === 'like'
                  ? 'text-red-600'
                  : 'text-gray-600 hover:text-red-600'
              } disabled:opacity-50`}
            >
              {loadingReaction ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className={`w-4 h-4 ${userReaction === 'like' ? 'fill-current' : ''}`} />
              )}
              <span>{likes}</span>
            </button>

            <button
              onClick={handleDislike}
              disabled={loadingReaction}
              className={`flex items-center space-x-1 text-sm transition ${
                userReaction === 'dislike'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              } disabled:opacity-50`}
            >
              <ThumbsDown className={`w-4 h-4 ${userReaction === 'dislike' ? 'fill-current' : ''}`} />
              <span>{dislikes}</span>
            </button>

            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Reply</span>
            </button>

            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary transition ml-auto"
              >
                {showReplies ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <span>{comment.replies.length} replies</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3 flex space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-xs">
                {backendUser?.username?.charAt(0).toUpperCase()}
              </div>
              <form onSubmit={handleSubmitReply} className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={replying || !replyContent.trim()}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition flex items-center space-x-1 disabled:opacity-50 text-sm"
                >
                  {replying ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* Replies */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map(reply => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  onReplyAdded={onReplyAdded}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;