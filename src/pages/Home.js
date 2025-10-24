import React, { useState, useEffect } from 'react';
import PostCard from '../components/post/PostCard';
import CreatePostModal from '../components/post/CreatePostModal';
import { Plus, MessageCircle, Sparkles, TrendingUp } from 'lucide-react';
import { getPosts, createPost as createPostAPI } from '../services/api';
import { useUserSync } from '../hooks/useUserSync';
import { PostSkeleton } from '../components/common/SkeletonLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendUser } = useUserSync();
  const { showSuccess, showError } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts();
      console.log('Fetched posts:', data);
      console.log('First post image_url:', data[0]?.image_url);
      console.log('First post full data:', JSON.stringify(data[0], null, 2));
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (newPostData) => {
    if (!backendUser) {
      alert('Please wait, syncing user data...');
      return;
    }

    
    try {
      const postPayload = {
        title: newPostData.title,
        content: newPostData.content,
        community_id: null,
        is_anonymous: newPostData.isAnonymous || false,  // Add this line
      };

      if (newPostData.imageUrl) {
        postPayload.image_url = newPostData.imageUrl;
      }
      console.log('Sending to API:', postPayload);

      const createdPost = await createPostAPI(postPayload, backendUser.id);
      
      console.log('Created post is_anonymous:', createdPost.is_anonymous);

      setPosts([createdPost, ...posts]);
      showSuccess('Post created successfully!');
    } catch (error) {
      
      showError('Failed to create post. Please try again.');
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <div className="min-h-screen">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Header Section */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/10 rounded-3xl blur-2xl" />
        <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <MessageCircle className="w-10 h-10 text-primary" />
                  <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {t('home.title')}
                </h1>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('home.subtitle')}
              </p>
            </div>

            {!loading && !error && posts.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl border border-primary/20">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{posts.length}</div>
                  <div className="text-xs text-gray-600">Posts</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Card */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group relative mb-8 cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <span className="text-gray-500 text-lg group-hover:text-gray-700 transition-colors">
                {t('home.createPost')}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:rotate-90 transition-all duration-300">
              <Plus className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <ErrorMessage message={error} onRetry={fetchPosts} />
        </div>
      )}

      {/* Posts Feed */}
      {!loading && !error && (
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="transform transition-all duration-300">
              <EmptyState
                icon={MessageCircle}
                title="No posts yet"
                message="Be the first to share your thoughts with the community!"
                action={
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="group px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Create First Post
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                }
              />
            </div>
          ) : (
            posts.map((post, index) => (
              <div 
                key={post.id}
                className="transform transition-all duration-300 hover:scale-[1.01]"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.5s ease-out forwards',
                  opacity: 0
                }}
              >
                <PostCard post={post} onDelete={handleDeletePost} />
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
      </button>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;