// PostForm.tsx - Component for creating/editing blog posts
import React, { useState, useEffect } from 'react';

// TypeScript interfaces for post data structures
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: number | { likes?: number; dislikes?: number; [key: string]: number | undefined };
  authorName?: string;
}

export interface PostForm {
  title: string;
  body: string;
  userId: number;
  tags: string[];
  authorName: string;
}

interface PostFormProps {
  postForm: PostForm;
  setPostForm: React.Dispatch<React.SetStateAction<PostForm>>;
  editMode: boolean;
  loading: boolean;
  users: { id: number; username: string }[];
  useCustomAuthor: boolean;
  setUseCustomAuthor: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
}

const PostFormComponent: React.FC<PostFormProps> = ({
  postForm,
  setPostForm,
  editMode,
  loading,
  users,
  useCustomAuthor,
  setUseCustomAuthor,
  onSubmit,
  onCancel
}) => {
  const [newTag, setNewTag] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    
    if (name === 'userId') {
      setPostForm({
        ...postForm,
        [name]: parseInt(value, 10)
      });
    } else {
      setPostForm({
        ...postForm,
        [name]: value
      });
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewTag(e.target.value);
  };

  const addTag = (): void => {
    if (newTag.trim() && !postForm.tags.includes(newTag.trim())) {
      setPostForm({
        ...postForm,
        tags: [...postForm.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string): void => {
    setPostForm({
      ...postForm,
      tags: postForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Function to handle 'Enter' key in tag input
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const getUsernameById = (userId: number): string => {
    return users.find(user => user.id === userId)?.username || `User ${userId}`;
  };

  const toggleAuthorMode = (): void => {
    setUseCustomAuthor(!useCustomAuthor);
    if (!useCustomAuthor) {
      // If switching to custom author, initialize with the current user's name
      const currentUsername = getUsernameById(postForm.userId);
      setPostForm({
        ...postForm,
        authorName: currentUsername
      });
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-8 shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {editMode ? 'Edit Post' : 'Create New Post'}
      </h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={postForm.title}
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
            value={postForm.body}
            onChange={handleInputChange}
            placeholder="Write your post content here..."
            required
          />
        </div>
        
        {/* Author selection with toggle for custom name */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700" htmlFor={useCustomAuthor ? "authorName" : "userId"}>
              Author
            </label>
            <button 
              type="button" 
              onClick={toggleAuthorMode}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {useCustomAuthor ? "Use system users" : "Use custom name"}
            </button>
          </div>
          
          {useCustomAuthor ? (
            <input
              type="text"
              id="authorName"
              name="authorName"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={postForm.authorName}
              onChange={handleInputChange}
              placeholder="Enter author name"
              required
            />
          ) : (
            <select
              id="userId"
              name="userId"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={postForm.userId}
              onChange={handleInputChange}
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          )}
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
            {postForm.tags.map((tag, index) => (
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
            {postForm.tags.length === 0 && (
              <span className="text-gray-500 text-sm">No tags added yet</span>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          {editMode && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading 
              ? (editMode ? 'Saving...' : 'Creating...') 
              : (editMode ? 'Save Changes' : 'Publish Post')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostFormComponent;