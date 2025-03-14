// pages/Comments.tsx
import React, { useState, useEffect } from 'react';
import AxiosInstance from '../utils/AxiosInstance';
import { 
  CommentForm, 
  CommentList, 
  ErrorMessage,
  Comment,
  CommentForm as CommentFormType,
  Post
} from '../components/commentComp';

// Interface for API response
interface CommentsResponse {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
}

// API Services
const fetchComments = async (): Promise<Comment[]> => {
  const response = await AxiosInstance.get<CommentsResponse>('/comments');
  return response.data.comments || [];
};

const fetchPosts = async (): Promise<Post[]> => {
  const response = await AxiosInstance.get('/posts', { params: { limit: 10 } });
  return response.data.posts?.map((post: any) => ({ 
    id: post.id, 
    title: post.title 
  })) || [];
};

const addComment = async (commentForm: CommentFormType): Promise<Comment> => {
  const response = await AxiosInstance.post<Comment>('/comments/add', commentForm);
  return response.data;
};

const updateComment = async (id: number, body: string): Promise<Comment> => {
  const response = await AxiosInstance.put<Comment>(`/comments/${id}`, { body });
  return response.data;
};

const deleteComment = async (id: number): Promise<{ id: number; isDeleted: boolean }> => {
  const response = await AxiosInstance.delete(`/comments/${id}`);
  return response.data;
};

// Main Comments Component
const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState<CommentFormType>({
    body: '',
    userId: 1,
    postId: 1
  });
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentCommentId, setCurrentCommentId] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [deletingComments, setDeletingComments] = useState<Record<number, boolean>>({});
  
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [commentsData, postsData] = await Promise.all([
          fetchComments(),
          fetchPosts()
        ]);
        
        setComments(commentsData);
        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load initial data');
        setLoading(false);
        console.error('Error loading initial data:', err);
      }
    };
    
    loadInitialData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    
    if (name === 'postId' || name === 'userId') {
      setCommentForm({
        ...commentForm,
        [name]: parseInt(value, 10)
      });
    } else {
      setCommentForm({
        ...commentForm,
        [name]: value
      });
    }
  };

  const resetForm = (): void => {
    setCommentForm({
      body: '',
      userId: 1,
      postId: 1
    });
    setEditMode(false);
    setCurrentCommentId(null);
  };

  const handleEditClick = (comment: Comment): void => {
    setCommentForm({
      body: comment.body,
      userId: comment.userId,
      postId: comment.postId
    });
    setCurrentCommentId(comment.id);
    setEditMode(true);
  };

  const handleCancelClick = (): void => {
    resetForm();
  };

  const handleDeleteClick = async (commentId: number): Promise<void> => {
    try {
      // Set deleting state for visual feedback
      setDeletingComments(prev => ({ ...prev, [commentId]: true }));
      
      const result = await deleteComment(commentId);
      
      if (result.isDeleted) {
        // Remove from the comments list
        setComments(comments.filter(comment => comment.id !== commentId));
        
        // If currently editing this comment, reset the form
        if (currentCommentId === commentId) {
          resetForm();
        }
      } else {
        // If delete failed, reset the deleting state
        setDeletingComments(prev => ({ ...prev, [commentId]: false }));
        setError('Failed to delete comment');
      }
    } catch (err) {
      // Reset deleting state and show error
      setDeletingComments(prev => ({ ...prev, [commentId]: false }));
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!commentForm.body.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    try {
      setLoading(true);
      
      if (editMode && currentCommentId) {
        // Update existing comment
        const updatedComment = await updateComment(
          currentCommentId, 
          commentForm.body
        );
        
        // Update the comment in the state
        setComments(comments.map(comment => 
          comment.id === currentCommentId ? updatedComment : comment
        ));
      } else {
        // Add new comment
        const addedComment = await addComment(commentForm);
        
        // Add the new comment to the list
        setComments([addedComment, ...comments]);
      }
      
      // Reset form
      resetForm();
      setLoading(false);
    } catch (err) {
      setError(`Failed to ${editMode ? 'update' : 'add'} comment`);
      setLoading(false);
      console.error(`Error ${editMode ? 'updating' : 'adding'} comment:`, err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Comments</h1>
      
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      
      {/* Comment form */}
      <CommentForm
        commentForm={commentForm}
        editMode={editMode}
        loading={loading}
        posts={posts}
        handleInputChange={handleInputChange}
        handleCancelClick={handleCancelClick}
        handleSubmit={handleSubmit}
      />
      
      {/* Comments list */}
      <CommentList
        comments={comments}
        loading={loading}
        deletingComments={deletingComments}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />
    </div>
  );
};

export default Comments;