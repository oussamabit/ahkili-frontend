import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Edit2, Settings, Loader,Award } from 'lucide-react';
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
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          {/* User Info */}
          <div className="flex items-start space-x-4 mb-4 md:mb-0">
            {/* Profile Picture */}
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.displayName}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* User Details */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.displayName}</h1>
              <p className="text-gray-600">@{user.username}</p>
              
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {user.email}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {user.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <Link to="/profile/edit">
            <button className="flex items-center space-x-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition">
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </Link>
        </div>
        {backendUser.role !== 'doctor' && (
          <Link to="/doctor-verification">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Award className="w-4 h-4" />
              <span>Become Verified Doctor</span>
            </button>
          </Link>
        )}

        {/* Bio */}
        <p className="text-gray-700 mt-4 leading-relaxed">{user.bio}</p>

        {/* Stats */}
        <div className="flex space-x-8 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{user.stats.posts}</p>
            <p className="text-sm text-gray-600">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{user.stats.communities}</p>
            <p className="text-sm text-gray-600">Communities</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{user.stats.helpfulVotes}</p>
            <p className="text-sm text-gray-600">Helpful Votes</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-4 text-center font-semibold transition ${
              activeTab === 'posts'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('communities')}
            className={`flex-1 py-4 text-center font-semibold transition ${
              activeTab === 'communities'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Communities
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-4 text-center font-semibold transition ${
              activeTab === 'saved'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-800'
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
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">No posts yet. Share your first thought!</p>
            </div>
          ) : (
            userPosts.map(post => <PostCard key={post.id} post={post} onDelete={handleDeletePost} />)
          )}
        </div>
      )}

      {activeTab === 'communities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {joinedCommunities.map(community => (
            <div key={community.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
              <h3 className="font-bold text-gray-800">{community.name}</h3>
              <p className="text-sm text-gray-600">{community.members.toLocaleString()} members</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No saved posts yet</p>
        </div>
      )}
    </div>
  );
};

export default Profile;