import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Loader } from 'lucide-react';
import PostCard from '../components/post/PostCard';
import CommunityCard from '../components/community/CommunityCard';
import { searchPosts, searchCommunities } from '../services/api';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
      setPosts(postsData);
      setCommunities(communitiesData);
    } catch (error) {
      console.error('Search error:', error);
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

  return (
    <div>
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
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </form>
      </div>

      {/* Results */}
      {searchParams.get('q') && (
        <>
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
                <div>
                  {posts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <p className="text-gray-600">
                        No posts found for "{searchParams.get('q')}"
                      </p>
                    </div>
                  ) : (
                    posts.map(post => <PostCard key={post.id} post={post} />)
                  )}
                </div>
              )}

              {/* Communities Tab */}
              {activeTab === 'communities' && (
                <div>
                  {communities.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <p className="text-gray-600">
                        No communities found for "{searchParams.get('q')}"
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {communities.map(community => (
                        <CommunityCard key={community.id} community={community} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Initial State */}
      {!searchParams.get('q') && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
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