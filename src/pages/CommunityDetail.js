import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Plus, Shield } from 'lucide-react';
import PostCard from '../components/post/PostCard';
import CreatePostModal from '../components/post/CreatePostModal';
import { 
  getCommunity, 
  getPosts, 
  createPost as createPostAPI, 
  checkCommunityMembership, 
  joinCommunity, 
  leaveCommunity 
} from '../services/api';
import { useUserSync } from '../hooks/useUserSync';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [joiningLoading, setJoiningLoading] = useState(false);
  const { backendUser } = useUserSync();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [communityData, postsData] = await Promise.all([
          getCommunity(id),
          getPosts(id)
        ]);
        setCommunity(communityData);
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching community:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const checkMembership = async () => {
      if (backendUser) {
        try {
          const result = await checkCommunityMembership(id, backendUser.id);
          setIsMember(result.is_member);
        } catch (error) {
          console.error('Error checking membership:', error);
        }
      }
    };
    checkMembership();
  }, [id, backendUser]);

  const handleCreatePost = async (newPostData) => {
    if (!backendUser) {
      showSuccess('Please wait, syncing user data...');
      return;
    }

    try {
      const createdPost = await createPostAPI(
        {
          title: newPostData.title,
          content: newPostData.content,
          community_id: parseInt(id),
        },
        backendUser.id
      );

      setPosts([createdPost, ...posts]);
      setIsModalOpen(false);
      showSuccess('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      showError('Failed to create post. Please try again.');
    }
  };

  const handleJoinLeave = async () => {
    if (!backendUser) {
      showError('Please log in first');
      return;
    }
    
    setJoiningLoading(true);
    try {
      if (isMember) {
        await leaveCommunity(id, backendUser.id);
        showSuccess('Left community');
        setIsMember(false);
      } else {
        await joinCommunity(id, backendUser.id);
        showSuccess('Joined community!');
        setIsMember(true);
      }
    } catch (error) {
      console.error('Error updating membership:', error);
      showError('Failed. Try again.');
    } finally {
      setJoiningLoading(false);
    }
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

  if (!community) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Community not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/communities')}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Communities</span>
      </button>

      {/* Community Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{community.name}</h1>
              <p className="text-gray-600 mt-1">{community.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                {posts.length} posts
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={handleJoinLeave}
              disabled={joiningLoading}
              className={`px-6 py-2 rounded-lg transition font-semibold ${
                isMember 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-primary text-white hover:bg-green-600'
              } ${joiningLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {joiningLoading ? 'Loading...' : (isMember ? 'Leave' : 'Join')}
            </button>
            {backendUser && (backendUser.role === 'admin' || backendUser.role === 'moderator') && (
              <Link to={`/community/${id}/moderators`}>
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Manage Moderators</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-white rounded-lg shadow-md p-4 mb-6 text-left text-gray-500 hover:shadow-lg transition flex items-center justify-between group"
      >
        <span>Share your thoughts in {community.name}...</span>
        <Plus className="w-5 h-5 text-primary group-hover:scale-110 transition" />
      </button>

      {/* Posts */}
      <div>
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
        defaultCommunity={community.name}
      />
    </div>
  );
};

export default CommunityDetail;