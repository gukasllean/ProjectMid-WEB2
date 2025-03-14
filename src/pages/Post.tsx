// PostPage.tsx - Page component for displaying and managing posts
import React, { useState, useEffect } from 'react';
import PostComponent, { Post } from '../components/PostForm';

interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

const PostPage: React.FC = () => {
  // State for posts list
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for post form
  const [formData, setFormData] = useState<Omit<Post, 'id' | 'reactions'> & { id?: number }>({
    title: '',
    body: '',
    userId: 1,
    tags: []
  });
  
  // UI state
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to fetch posts (first from localStorage, then from API)
  const fetchPosts = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // First check localStorage
      const localPosts = localStorage.getItem('dummyjson_posts');
      
      if (localPosts) {
        // Use local posts if available
        setPosts(JSON.parse(localPosts));
        setLoading(false);
      } else {
        // Otherwise fetch from API
        const response = await fetch('https://dummyjson.com/posts?limit=20');
        const data: PostsResponse = await response.json();
        
        if (data && data.posts) {
          setPosts(data.posts);
          // Save to localStorage
          localStorage.setItem('dummyjson_posts', JSON.stringify(data.posts));
        }
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to fetch posts');
      setLoading(false);
      console.error('Error fetching posts:', err);
    }
  };

  // Form input handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Tag handlers
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewTag(e.target.value);
  };

  const addTag = (): void => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string): void => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Form reset function
  const resetForm = (): void => {
    setFormData({
      title: '',
      body: '',
      userId: 1,
      tags: []
    });
    setEditMode(false);
    setNewTag('');
  };

  // Function to handle editing a post
  const handleEditClick = (post: Post): void => {
    setFormData({
      id: post.id,
      title: post.title,
      body: post.body,
      userId: post.userId,
      tags: [...post.tags]
    });
    setEditMode(true);
  };

  // Function to delete a post
  const handleDeletePost = async (id: number): Promise<void> => {
    try {
      // Mark as deleting for UI feedback
      setIsDeleting(prev => ({ ...prev, [id]: true }));
      
      // Call the API (this is for consistency, though we know it doesn't actually delete)
      await fetch(`https://dummyjson.com/posts/${id}`, {
        method: 'DELETE'
      });
      
      // Update local state
      const updatedPosts = posts.filter(post => post.id !== id);
      setPosts(updatedPosts);
      
      // Update localStorage
      localStorage.setItem('dummyjson_posts', JSON.stringify(updatedPosts));
      
    } catch (err) {
      setError('Failed to delete post');
      setIsDeleting(prev => ({ ...prev, [id]: false }));
      console.error('Error deleting post:', err);
    }
  };

  // Function to handle form submission (create/edit)
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.body.trim()) {
      setError('Title and body cannot be empty');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      let updatedPosts: Post[];
      
      if (editMode && formData.id) {
        // Edit existing post
        const response = await fetch(`https://dummyjson.com/posts/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            body: formData.body,
            userId: formData.userId,
            tags: formData.tags
          })
        });
        
        const updatedPost = await response.json();
        
        // Find the original post to preserve fields not changed
        const originalPost = posts.find(post => post.id === formData.id);
        if (!originalPost) throw new Error('Post not found');
        
        // Merge the updated post with original values for any missing fields
        const fullUpdatedPost: Post = {
          ...originalPost,
          title: formData.title,
          body: formData.body,
          userId: formData.userId,
          tags: formData.tags
        };
        
        // Update in state
        updatedPosts = posts.map(post => 
          post.id === formData.id ? fullUpdatedPost : post
        );
      } else {
        // Create new post
        const response = await fetch('https://dummyjson.com/posts/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            body: formData.body,
            userId: formData.userId,
            tags: formData.tags
          })
        });
        
        let newPost = await response.json();
        
        // If API didn't provide an ID, generate one
        if (!newPost.id) {
          const highestId = Math.max(...posts.map(post => post.id), 0);
          newPost.id = highestId + 1;
        }
        
        // Add default reactions if not provided
        if (newPost.reactions === undefined) {
          newPost.reactions = 0;
        }
        
        // Ensure newPost has all required fields and correct types
        newPost = {
          ...newPost,
          id: newPost.id || highestId + 1,
          title: formData.title,
          body: formData.body, 
          userId: formData.userId,
          tags: [...formData.tags],
          reactions: typeof newPost.reactions === 'number' ? newPost.reactions : 0
        };
        
        // Add to state
        updatedPosts = [newPost, ...posts];
      }
      
      // Update state and localStorage
      setPosts(updatedPosts);
      localStorage.setItem('dummyjson_posts', JSON.stringify(updatedPosts));
      
      // Reset form
      resetForm();
      setIsSubmitting(false);
      
    } catch (err) {
      setError(`Failed to ${editMode ? 'update' : 'create'} post`);
      setIsSubmitting(false);
      console.error(`Error ${editMode ? 'updating' : 'creating'} post:`, err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Posts Manager</h1>
      
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}
      
      {/* Post form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8 shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? 'Edit Post' : 'Create New Post'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter post title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="body">Content</label>
            <textarea
              id="body"
              name="body"
              rows={6}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.body}
              onChange={handleInputChange}
              placeholder="Write your post content here..."
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Tags</label>
            <div className="flex mb-2">
              <input
                type="text"
                placeholder="Add a tag"
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newTag}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
              />
              <button 
                type="button" 
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                onClick={addTag}
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag: string, index: number) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button 
                    type="button" 
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    onClick={() => removeTag(tag)}
                  >
                    &times;
                  </button>
                </span>
              ))}
              {formData.tags.length === 0 && (
                <span className="text-gray-500 text-sm">No tags added yet</span>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (editMode ? 'Saving...' : 'Creating...') 
                : (editMode ? 'Save Changes' : 'Create Post')}
            </button>
          </div>
        </form>
      </div>
      
      {/* Posts list */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Post List</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map(post => (
                <PostComponent
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost}
                  onEdit={handleEditClick}
                  isDeleting={Boolean(isDeleting[post.id])}
                />
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPage;