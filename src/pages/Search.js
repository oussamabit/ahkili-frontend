import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Loader } from 'lucide-react';
import { searchPosts, searchCommunities } from '../services/api';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const [postsData, communitiesData] = await Promise.all([
        searchPosts(searchQuery),
        searchCommunities(searchQuery)
      ]);
      setPosts(postsData || []);
      setCommunities(communitiesData || []);
    } catch (error) {
      console.error('Search error:', error);
      setPosts([]);
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleCommunityClick = (communityId) => {
    navigate(`/community/${communityId}`);
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Search</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative">
          <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts and communities..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </form>
      </div>

      {/* Results */}
      {searchParams.get('q') && (
        <>
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 py-4 text-center font-semibold transition ${
                  activeTab === 'posts'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Posts ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('communities')}
                className={`flex-1 py-4 text-center font-semibold transition ${
                  activeTab === 'communities'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Communities ({communities.length})
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Searching...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Posts Tab */}
              {activeTab === 'posts' && (
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                      <p className="text-gray-600">
                        No posts found for "{searchParams.get('q')}"
                      </p>
                    </div>
                  ) : (
                    posts.map(post => (
                      <div
                        key={post.id}
                        onClick={() => handlePostClick(post.id)}
                        className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <h3 className="font-bold text-gray-800 mb-2 text-lg line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>by {post.is_anonymous ? 'Anonymous' : post.username}</span>
                          <span>•</span>
                          <span>{post.community_name}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Communities Tab */}
              {activeTab === 'communities' && (
                <div className="space-y-4">
                  {communities.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                      <p className="text-gray-600">
                        No communities found for "{searchParams.get('q')}"
                      </p>
                    </div>
                  ) : (
                    communities.map(community => (
                      <div
                        key={community.id}
                        onClick={() => handleCommunityClick(community.id)}
                        className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <h3 className="font-bold text-gray-800 mb-2 text-lg">
                          {community.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {community.description}
                        </p>
                        <div className="text-xs text-gray-500">
                          {community.member_count || 0} members
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Initial State */}
      {!searchParams.get('q') && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Search for posts, communities, and more
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;