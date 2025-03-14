'use client';

// CommentsPage.tsx - Main page for comments management
import React, { useState, useEffect } from 'react';
import CommentComponent, { Comment, User } from '../components/commentComp';

interface CommentsResponse {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
}

interface NewComment {
  body: string;
  postId: number;
  userId: number;
}

const CommentsPage: React.FC = () => {
  // Constants
  const COMMENTS_PER_PAGE = 10;
  
  // State
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>(1);

  // Effects
  useEffect(() => {
    fetchComments();
    fetchUsers();
  }, [currentPage]);

  // API Methods
  const fetchComments = async (): Promise<void> => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * COMMENTS_PER_PAGE;
      const response = await fetch(`https://dummyjson.com/comments?limit=${COMMENTS_PER_PAGE}&skip=${skip}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data: CommentsResponse = await response.json();
      
      setComments(data.comments);
      setTotalPages(Math.ceil(data.total / COMMENTS_PER_PAGE));
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
      setLoading(false);
    }
  };

  const fetchUsers = async (): Promise<void> => {
    try {
      const response = await fetch('https://dummyjson.com/users?limit=10');
      const data = await response.json();
      
      if (data && data.users) {
        setUsers(data.users.map((user: any) => ({ 
          id: user.id, 
          username: user.username || `User ${user.id}` 
        })));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const addComment = async (): Promise<void> => {
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    try {
      setLoading(true);
      
      const commentData: NewComment = {
        body: newComment,
        postId: 1, // Default post ID
        userId: selectedUserId
      };
      
      const response = await fetch('https://dummyjson.com/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      const addedComment: Comment = await response.json();
      
      setComments([addedComment, ...comments]);
      setNewComment('');
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
      setLoading(false);
    }
  };

  // Event Handlers
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setNewComment(e.target.value);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedUserId(parseInt(e.target.value, 10));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFilter(e.target.value);
  };

  const handleUpdateComment = (updatedComment: Comment): void => {
    setComments(comments.map(comment => 
      comment.id === updatedComment.id ? updatedComment : comment
    ));
  };

  const handleDeleteComment = (commentId: number): void => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handlePreviousPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = (): void => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Computed Properties
  const filteredComments = comments.filter(comment => 
    comment.body.toLowerCase().includes(filter.toLowerCase()) ||
    comment.user.username.toLowerCase().includes(filter.toLowerCase())
  );

  // Render
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Comments</h1>
      
      {/* Error message */}
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
      
      {/* Add comment form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Comment</h2>
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Write your comment here..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[100px]"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="user">User</label>
          <select
            id="user"
            value={selectedUserId}
            onChange={handleUserChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={addComment} 
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      </div>
      
      {/* Filter comments */}
      <div className="mb-6">
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Filter comments..."
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* Comments list */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">All Comments</h2>
        
        {loading && comments.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredComments.length > 0 ? (
              <div className="space-y-4">
                {filteredComments.map(comment => (
                  <CommentComponent
                    key={comment.id}
                    comment={comment}
                    onUpdate={handleUpdateComment}
                    onDelete={handleDeleteComment}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No comments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter ? 'Try adjusting your filter.' : 'Add a comment to get started.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Pagination */}
      {filteredComments.length > 0 && (
        <div className="flex justify-center items-center space-x-6">
          <button 
            onClick={handlePreviousPage} 
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentPage === 1 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentPage === totalPages 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;