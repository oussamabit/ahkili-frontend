import React, { useState, useEffect } from 'react';
import PostCard from '../components/post/PostCard';
import CreatePostModal from '../components/post/CreatePostModal';
import { Plus } from 'lucide-react';
import { getPosts, createPost as createPostAPI } from '../services/api';
import { useUserSync } from '../hooks/useUserSync';
import { PostSkeleton } from '../components/common/SkeletonLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { MessageCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Home = () => {
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
    console.log('First post image_url:', data[0]?.image_url); // Check first post
    console.log('First post full data:', JSON.stringify(data[0], null, 2)); // See all fields
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

    console.log('Creating post with data:', newPostData); // Debug

    try {
      const postPayload = {
        title: newPostData.title,
        content: newPostData.content,
        community_id: null,
      };

      // Only add image_url if it exists
      if (newPostData.imageUrl) {
        postPayload.image_url = newPostData.imageUrl;
      }

      console.log('Sending to API:', postPayload); // Debug

      const createdPost = await createPostAPI(postPayload, backendUser.id);
      
      console.log('Created post response:', createdPost); // Debug
      
      setPosts([createdPost, ...posts]);
      showSuccess('Post created successfully!');
      console.log('Created post response:', createdPost);
      console.log('Created post image_url:', createdPost.image_url);
      console.log('Created post full:', JSON.stringify(createdPost, null, 2));
      
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error details:', error.response?.data);
      showError('Failed to create post. Please try again.');
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to Ahkili
        </h1>
        <p className="text-gray-600">
          A safe space for psychological support and community.
        </p>
      </div>

      {/* Create Post Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-white rounded-lg shadow-md p-4 mb-6 text-left text-gray-500 hover:shadow-lg transition flex items-center justify-between group"
      >
        <span>Share your thoughts...</span>
        <Plus className="w-5 h-5 text-primary group-hover:scale-110 transition" />
      </button>

      {/* Loading State */}
      {loading && (
        <div>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorMessage message={error} onRetry={fetchPosts} />
      )}

      {/* Posts Feed */}
      {!loading && !error && (
        <div>
          {posts.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title="No posts yet"
              message="Be the first to share your thoughts with the community!"
              action={
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-600 transition font-semibold"
                >
                  Create First Post
                </button>
              }
            />
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
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
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-green-600 transition flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Home;