// components/CommentComponents.tsx
import React from 'react';

// Shared types
export interface User {
  id: number;
  username?: string;
}

export interface Comment {
  id: number;
  body: string;
  postId: number;
  user?: User;
  userId: number;
}

export interface CommentForm {
  body: string;
  userId: number;
  postId: number;
}

export interface Post {
  id: number;
  title: string;
}

// CommentForm Component
interface CommentFormProps {
  commentForm: CommentForm;
  editMode: boolean;
  loading: boolean;
  posts: Post[];
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCancelClick: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  commentForm,
  editMode,
  loading,
  posts,
  handleInputChange,
  handleCancelClick,
  handleSubmit
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editMode ? 'Edit Comment' : 'Add a Comment'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="postId">Post</label>
          <select
            id="postId"
            name="postId"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={commentForm.postId}
            onChange={handleInputChange}
            disabled={editMode}
          >
            {posts.map(post => (
              <option key={post.id} value={post.id}>
                {post.title.length > 50 
                  ? `${post.title.substring(0, 50)}...` 
                  : post.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="body">Your Comment</label>
          <textarea
            id="body"
            name="body"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md"
            value={commentForm.body}
            onChange={handleInputChange}
            placeholder="Write your comment here..."
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          {editMode && (
            <button
              type="button"
              onClick={handleCancelClick}
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
              ? (editMode ? 'Saving...' : 'Posting...') 
              : (editMode ? 'Save Changes' : 'Post Comment')}
          </button>
        </div>
      </form>
    </div>
  );
};

// CommentItem Component
interface CommentItemProps {
  comment: Comment;
  handleEditClick: (comment: Comment) => void;
  handleDeleteClick: (commentId: number) => Promise<void>;
  isDeleting?: boolean;
}

export const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  handleEditClick, 
  handleDeleteClick,
  isDeleting = false
}) => {
  const formatDate = (): string => {
    return new Date().toLocaleDateString();
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-medium">
            {comment.user ? comment.user.username : `User #${comment.userId}`}
          </span>
          <span className="text-gray-500 text-sm ml-2">
            on Post #{comment.postId}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 text-sm">{formatDate()}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditClick(comment)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
              disabled={isDeleting}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(comment.id)}
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
      <p className="text-gray-800">{comment.body}</p>
    </div>
  );
};

// CommentList Component
interface CommentListProps {
  comments: Comment[];
  loading: boolean;
  deletingComments: Record<number, boolean>;
  handleEditClick: (comment: Comment) => void;
  handleDeleteClick: (commentId: number) => Promise<void>;
}

export const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  loading, 
  deletingComments,
  handleEditClick,
  handleDeleteClick
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Comments</h2>
      
      {loading && comments.length === 0 ? (
        <div className="text-center py-4">Loading comments...</div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              isDeleting={deletingComments[comment.id]}
            />
          ))}
          
          {!loading && comments.length === 0 && (
            <div className="text-center py-4 text-gray-500">No comments yet</div>
          )}
        </div>
      )}
    </div>
  );
};

// ErrorMessage Component
interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  return (
    <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4 relative">
      <span>Error: {message}</span>
      <button 
        onClick={onDismiss}
        className="absolute right-2 top-2 text-red-500 hover:text-red-700"
      >
        &times;
      </button>
    </div>
  );
};