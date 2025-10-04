import React, { useState, useEffect } from 'react';
import CommunityCard from '../components/community/CommunityCard';
import { getCommunities } from '../services/api';
import { CommunitySkeleton } from '../components/common/SkeletonLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { Users } from 'lucide-react';

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
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Communities</h1>
        <p className="text-gray-600">
          Find your support community. Join, share, and grow together.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <ErrorMessage message={error} onRetry={fetchCommunities} />
      )}

      {/* Communities Grid */}
      {!loading && !error && (
        <>
          {communities.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No communities yet"
              message="Communities will appear here once they are created."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map(community => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Communities;