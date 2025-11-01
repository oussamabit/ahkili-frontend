import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Loader, X } from 'lucide-react';
import { searchPosts, searchCommunities } from '../../services/api';

const SearchDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setPosts([]);
        setCommunities([]);
        return;
      }

      setLoading(true);
      try {
        const [postsData, communitiesData] = await Promise.all([
          searchPosts(query),
          searchCommunities(query)
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

    const debounceTimer = setTimeout(() => {
      if (query) {
        performSearch();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleCommunityClick = (communityId) => {
    navigate(`/community/${communityId}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleClear = () => {
    setQuery('');
    setPosts([]);
    setCommunities([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-xl" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search posts and communities..."
          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white shadow-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[600px] overflow-hidden z-50">
          {/* Tabs */}
          <div className="flex border-b sticky top-0 bg-white z-10">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-3 text-center font-semibold transition ${
                activeTab === 'posts'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Posts ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`flex-1 py-3 text-center font-semibold transition ${
                activeTab === 'communities'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Communities ({communities.length})
            </button>
          </div>

          {/* Results Content */}
          <div className="overflow-y-auto max-h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">Searching...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Posts Tab */}
                {activeTab === 'posts' && (
                  <div>
                    {posts.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-gray-600">No posts found for "{query}"</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {posts.map((post) => (
                          <button
                            key={post.id}
                            onClick={() => handlePostClick(post.id)}
                            className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <h4 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                              {post.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {post.content}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">
                                by {post.is_anonymous ? 'Anonymous' : post.username}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {post.community_name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Communities Tab */}
                {activeTab === 'communities' && (
                  <div>
                    {communities.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-gray-600">No communities found for "{query}"</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {communities.map((community) => (
                          <button
                            key={community.id}
                            onClick={() => handleCommunityClick(community.id)}
                            className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <h4 className="font-semibold text-gray-800 mb-1">
                              {community.name}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {community.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">
                                {community.member_count || 0} members
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;