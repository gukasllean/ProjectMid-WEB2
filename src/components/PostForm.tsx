// PostComponent.tsx - Component for displaying and managing a post
import React, { useState } from 'react';

// TypeScript interfaces
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: number | { likes?: number; dislikes?: number; [key: string]: number | undefined };
  isDeleting?: boolean;
}

interface PostComponentProps {
  post: Post;
  onDelete: (id: number) => Promise<void>;
  onEdit: (post: Post) => void;
  isDeleting: boolean;
}

const PostComponent: React.FC<PostComponentProps> = ({ 
  post, 
  onDelete, 
  onEdit,
  isDeleting
}) => {
  // Helper function to display reactions properly
  const displayReactions = (reactions: number | { [key: string]: number | undefined } | undefined): string => {
    if (typeof reactions === 'number') {
      return `${reactions}`;
    } else if (reactions && typeof reactions === 'object') {
      // If it's an object with likes/dislikes
      if ('likes' in reactions && 'dislikes' in reactions) {
        const likes = reactions.likes || 0;
        const dislikes = reactions.dislikes || 0;
        return `${likes} likes, ${dislikes} dislikes`;
      } else {
        // Sum all reaction values
        const total = Object.values(reactions).reduce(
          (sum: number, val) => sum + (typeof val === 'number' ? val : 0), 
          0
        );
        return `${total}`;
      }
    }
    return "0"; // Fallback
  };
  // State for expanded view (to show full content)
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post.id);
    }
  };

  const handleEdit = () => {
    onEdit(post);
    // Scroll to top where the form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
          <div className="flex space-x-2">
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
          </div>
        </div>
        
        <div className="mb-4">
          {expanded ? (
            <p className="text-gray-600">{post.body}</p>
          ) : (
            <p className="text-gray-600">{truncateText(post.body, 150)}</p>
          )}
          
          {post.body.length > 150 && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="text-blue-600 hover:text-blue-800 text-sm mt-2"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag: string, index: number) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>
            <span className="font-medium">Post ID: </span>
            {post.id}
          </div>
          <div className="flex items-center">
            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            {displayReactions(post.reactions)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;