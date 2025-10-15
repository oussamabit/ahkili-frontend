import React, { useState, useEffect } from 'react';
import CommunityCard from '../components/community/CommunityCard';
import { getCommunities } from '../services/api';
import { CommunitySkeleton } from '../components/common/SkeletonLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { Users, Sparkles } from 'lucide-react';

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCommunities();
      setCommunities(data);
    } catch (error) {
      console.error('Error fetching communities:', error);
      setError('Failed to load communities. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header Section with Gradient */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-3xl blur-2xl" />
        <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <Users className="w-10 h-10 text-primary" />
                  <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Communities
                </h1>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                Find your support community. Join, share, and grow together in a safe space.
              </p>
            </div>
            
            {!loading && !error && communities.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl border border-primary/20">
                <Users className="w-5 h-5 text-primary" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{communities.length}</div>
                  <div className="text-xs text-gray-600">Communities</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          <CommunitySkeleton />
          <CommunitySkeleton />
          <CommunitySkeleton />
          <CommunitySkeleton />
          <CommunitySkeleton />
          <CommunitySkeleton />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <ErrorMessage message={error} onRetry={fetchCommunities} />
        </div>
      )}

      {/* Communities Grid */}
      {!loading && !error && (
        <>
          {communities.length === 0 ? (
            <div className="transform transition-all duration-300">
              <EmptyState
                icon={Users}
                title="No communities yet"
                message="Communities will appear here once they are created."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community, index) => (
                <div 
                  key={community.id}
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <CommunityCard community={community} />
                </div>
              ))}
            </div>
          )}
        </>
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

export default Communities;