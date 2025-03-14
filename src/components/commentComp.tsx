// CommentComponent.tsx - Component for displaying and editing comments
import React, { useState } from 'react';

// TypeScript interfaces
export interface User {
  id: number;
  username: string;
}

export interface Comment {
  id: number;
  body: string;
  postId: number;
  user: User;
}

interface CommentComponentProps {
  comment: Comment;
  onUpdate: (updatedComment: Comment) => void;
  onDelete: (id: number) => void;
}

const CommentComponent: React.FC<CommentComponentProps> = ({
  comment,
  onUpdate,
  onDelete
}) => {
  // State
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedBody, setEditedBody] = useState<string>(comment.body);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Handlers
  const handleEdit = (): void => {
    setIsEditing(true);
  };

  const handleCancel = (): void => {
    setEditedBody(comment.body);
    setIsEditing(false);
  };

  const handleSave = async (): Promise<void> => {
    try {
      const response = await fetch(`https://dummyjson.com/comments/${comment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: editedBody,
        }),
      });
      
      const updatedComment: Comment = await response.json();
      onUpdate(updatedComment);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      setIsDeleting(true);
      await fetch(`https://dummyjson.com/comments/${comment.id}`, {
        method: 'DELETE',
      });
      
      onDelete(comment.id);
    } catch (error) {
      setIsDeleting(false);
      console.error('Error deleting comment:', error);
    }
  };

  // Render
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden mb-4 ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="font-medium text-gray-900">
            {comment.user.username}
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
                  disabled={isDeleting}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <textarea
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md resize-y min-h-[60px] mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-700 mb-3">{comment.body}</p>
        )}
        
        <div className="text-xs text-gray-500">
          <span>Post ID: {comment.postId}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentComponent;