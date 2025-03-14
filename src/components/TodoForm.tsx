// TodoComponent.tsx - Component for displaying and managing a todo item
import React from 'react';

// TypeScript interfaces
export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface TodoComponentProps {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onToggleComplete: (todo: Todo) => Promise<void>;
  userName: string;
  isLoading: boolean;
}

const TodoComponent: React.FC<TodoComponentProps> = ({ 
  todo, 
  onDelete, 
  onEdit,
  onToggleComplete,
  userName,
  isLoading
}) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      onDelete(todo.id);
    }
  };

  return (
    <div className="flex items-center bg-white p-4 rounded-lg shadow">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo)}
        className="h-5 w-5 mr-3"
        disabled={isLoading}
      />
      <div className="flex-grow">
        <p className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {todo.todo}
        </p>
        <p className="text-sm text-gray-500">
          Assigned to: {userName}
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(todo)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
          disabled={isLoading}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm"
          disabled={isLoading}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoComponent;