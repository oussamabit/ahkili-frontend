import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Edit2, Award, Loader, MessageCircle, Users, Heart } from 'lucide-react';
import PostCard from '../components/post/PostCard';
import { useAuth } from '../context/AuthContext';
import { useUserSync } from '../hooks/useUserSync';
import { getUserPosts, getUserProfile } from '../services/api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useAuth();
  const { backendUser, loading: userLoading } = useUserSync();
  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (backendUser) {
        try {
          // Fetch profile with stats
          const profile = await getUserProfile(backendUser.id);
          setProfileData(profile);

          // Fetch user posts
          const posts = await getUserPosts(backendUser.id);
          setUserPosts(posts);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [backendUser]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <User className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!backendUser || !profileData) {
    return (
      <div className="text-center py-12">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-2xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-100">
            <p className="text-gray-600 text-lg">Unable to load profile</p>
          </div>
        </div>
      </div>
    );
  }

  const handleDeletePost = (postId) => {
    setUserPosts(userPosts.filter(post => post.id !== postId));
    setProfileData({ ...profileData, posts_count: profileData.posts_count - 1 });
  };

  const displayName = profileData.username;
  const profilePicture = profileData.profile_picture_url || currentUser?.photoURL;

  return (
    <div className="max-w-5xl mx-auto min-h-screen">
      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Profile Header Card */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-3xl blur-xl" />
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Cover Background */}
          <div className="h-32 bg-gradient-to-r from-primary via-green-500 to-blue-500"></div>
          
          <div className="px-8 pb-8">
            {/* Profile Picture & Info */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 relative">
              {/* Profile Picture */}
              <div className="relative">
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt={displayName}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                {profileData.verified && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 md:mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">{displayName}</h1>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {profileData.email}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link to="/profile/edit">
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:shadow-lg transition-all font-semibold">
                        <Edit2 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    </Link>
                    {profileData.role !== 'doctor' && (
                      <Link to="/doctor-verification">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold">
                          <Award className="w-4 h-4" />
                          <span className="hidden sm:inline">Verify</span>
                        </button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Bio & Location */}
                <div className="mt-4 space-y-2">
                  {profileData.bio && (
                    <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {profileData.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {profileData.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(profileData.created_at).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <p className="text-2xl font-bold text-gray-800">{profileData.posts_count}</p>
                </div>
                <p className="text-sm text-gray-600">Posts</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-primary" />
                  <p className="text-2xl font-bold text-gray-800">{profileData.communities_count}</p>
                </div>
                <p className="text-sm text-gray-600">Communities</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Heart className="w-5 h-5 text-primary" />
                  <p className="text-2xl font-bold text-gray-800">0</p>
                </div>
                <p className="text-sm text-gray-600">Reactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl blur-xl" />
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 px-4 text-center font-semibold transition-all ${
                activeTab === 'posts'
                  ? 'text-primary border-b-4 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Posts ({userPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`flex-1 py-4 px-4 text-center font-semibold transition-all ${
                activeTab === 'communities'
                  ? 'text-primary border-b-4 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Communities
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-4 px-4 text-center font-semibold transition-all ${
                activeTab === 'saved'
                  ? 'text-primary border-b-4 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Saved
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div>
          {userPosts.length === 0 ? (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-3xl blur-xl" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-md p-12 text-center border border-gray-100">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium">No posts yet</p>
                <p className="text-gray-500 mt-2">Share your first thought with the community!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map(post => (
                <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'communities' && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-3xl blur-xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-md p-12 text-center border border-gray-100">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No communities yet</p>
            <p className="text-gray-500 mt-2">Join communities to see them here</p>
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-3xl blur-xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-md p-12 text-center border border-gray-100">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No saved posts yet</p>
            <p className="text-gray-500 mt-2">Save posts to find them easily later</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;