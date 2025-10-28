import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, Heart, MessageCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';

const Notifications = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser?.id) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications(currentUser.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await api.getUnreadNotificationsCount(currentUser.id);
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId, currentUser.id);
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      showError('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead(currentUser.id);
      setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));
      setUnreadCount(0);
      showSuccess('All notifications marked as read');
    } catch (error) {
      showError('Failed to mark all as read');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await api.deleteNotification(notificationId, currentUser.id);
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
      showSuccess('Notification deleted');
    } catch (error) {
      showError('Failed to delete notification');
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate to target
    if (notification.target_type === 'post') {
      navigate(`/post/${notification.target_id}`);
    } else if (notification.target_type === 'comment') {
      // Navigate to post with comment
      navigate(`/post/${notification.target_id}`);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'post_reaction':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment_reaction':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment_reply':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'new_post':
        return <FileText className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 text-primary hover:bg-green-50 rounded-lg transition"
          >
            <Check className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-md p-4 transition hover:shadow-lg cursor-pointer ${
                !notification.is_read ? 'border-l-4 border-primary' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatTimeAgo(notification.created_at)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {!notification.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      className="p-2 text-gray-400 hover:text-primary transition"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;