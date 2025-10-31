import React, { useState, useEffect } from 'react';
import PostCard from '../components/post/PostCard';
import { MessageCircle, Sparkles, TrendingUp } from 'lucide-react';
import { getPosts } from '../services/api';
import { useUserSync } from '../hooks/useUserSync';
import { PostSkeleton } from '../components/common/SkeletonLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts();
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

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <div className="min-h-screen">
      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Header */}
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

      {/* Loading */}
      {loading && (
        <div className="space-y-6">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <ErrorMessage message={error} onRetry={fetchPosts} />
        </div>
      )}

      {/* Posts Feed */}
      {!loading && !error && (
        <div className="space-y-6">
          {posts.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title="No posts yet"
              message="Be the first to share your thoughts with the community!"
            />
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