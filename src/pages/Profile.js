import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Edit2, Settings, Loader, Award } from 'lucide-react';
import PostCard from '../components/post/PostCard';
import { useAuth } from '../context/AuthContext';
import { useUserSync } from '../hooks/useUserSync';
import { getUserPosts } from '../services/api';
import { Link } from 'react-router-dom';


const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { backendUser, loading: userLoading, error } = useUserSync();
  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (backendUser) {
        try {
          const posts = await getUserPosts(backendUser.id);
          setUserPosts(posts);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserPosts();
  }, [backendUser]);

  if (!backendUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const user = {
    username: backendUser.username || 'User',
    displayName: currentUser.displayName || backendUser.username,
    email: backendUser.email,
    bio: 'Mental health advocate | Sharing my journey | Remember: you are not alone 💚',
    location: 'Online',
    joinedDate: new Date(backendUser.created_at).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }),
    profilePicture: currentUser.photoURL,
    stats: {
      posts: userPosts.length,
      communities: 0,
      helpfulVotes: 0
    }
  };

  // Mock communities
  const joinedCommunities = [
    { id: 1, name: 'Anxiety Support', members: 12543 },
    { id: 2, name: 'Depression Support', members: 9821 },
    { id: 3, name: 'Mindfulness', members: 15672 },
  ];

  const handleDeletePost = (postId) => {
    setUserPosts(userPosts.filter(post => post.id !== postId));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary to-green-500 rounded-lg shadow-lg p-8 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* User Info */}
          <div className="flex items-start space-x-4 flex-1">
            {/* Profile Picture */}
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.displayName}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary text-3xl font-bold flex-shrink-0 shadow-md">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* User Details */}
            <div className="text-white">
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              <p className="text-green-100 text-lg">@{user.username}</p>
              
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-green-50">
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-1.5" />
                  {user.email}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {user.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Joined {user.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Link to="/profile/edit" className="w-full md:w-auto">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white text-primary rounded-lg hover:bg-gray-100 transition font-semibold">
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </Link>
            {backendUser.role !== 'doctor' && (
              <Link to="/doctor-verification" className="w-full md:w-auto">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold">
                  <Award className="w-4 h-4" />
                  <span>Become Verified Doctor</span>
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-white mt-6 leading-relaxed text-center md:text-left">{user.bio}</p>

        {/* Stats */}
        <div className="flex justify-center md:justify-start space-x-8 mt-6 pt-6 border-t border-green-300">
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-white">{user.stats.posts}</p>
            <p className="text-sm text-green-100">Posts</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-white">{user.stats.communities}</p>
            <p className="text-sm text-green-100">Communities</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold text-white">{user.stats.helpfulVotes}</p>
            <p className="text-sm text-green-100">Helpful Votes</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-4 px-4 text-center font-semibold transition ${
              activeTab === 'posts'
                ? 'text-primary border-b-4 border-primary bg-green-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('communities')}
            className={`flex-1 py-4 px-4 text-center font-semibold transition ${
              activeTab === 'communities'
                ? 'text-primary border-b-4 border-primary bg-green-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Communities
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-4 px-4 text-center font-semibold transition ${
              activeTab === 'saved'
                ? 'text-primary border-b-4 border-primary bg-green-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Saved
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : userPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No posts yet. Share your first thought!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map(post => <PostCard key={post.id} post={post} onDelete={handleDeletePost} />)}
            </div>
          )}
        </div>
      )}

      {activeTab === 'communities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {joinedCommunities.map(community => (
            <div key={community.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:border-l-4 hover:border-primary transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{community.name}</h3>
                  <p className="text-sm text-gray-600">{community.members.toLocaleString()} members</p>
                </div>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {community.name.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No saved posts yet</p>
        </div>
      )}
    </div>
  );
};

export default Profile;