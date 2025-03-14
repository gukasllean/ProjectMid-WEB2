// TodosPage.tsx - Page component for managing todo tasks
import React, { useState, useEffect } from 'react';
import TodoComponent, { Todo } from '../components/TodoForm';

interface TodosResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

interface TodoForm {
  todo: string;
  completed: boolean;
  userId: number;
}

const TodosPage: React.FC = () => {
  // State for todos list
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for todo form
  const [todoForm, setTodoForm] = useState<TodoForm>({
    todo: '',
    completed: false,
    userId: 1
  });
  
  // UI state
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentTodoId, setCurrentTodoId] = useState<number | null>(null);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  
  useEffect(() => {
    fetchTodos();
    fetchUsers();
  }, []);

  const fetchTodos = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // First check localStorage
      const localTodos = localStorage.getItem('dummyjson_todos');
      
      if (localTodos) {
        // Use local todos if available
        setTodos(JSON.parse(localTodos));
        setLoading(false);
      } else {
        // Otherwise fetch from API
        const response = await fetch('https://dummyjson.com/todos');
        const data: TodosResponse = await response.json();
        
        if (data && data.todos) {
          setTodos(data.todos);
          // Save to localStorage
          localStorage.setItem('dummyjson_todos', JSON.stringify(data.todos));
        }
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to fetch todos');
      setLoading(false);
      console.error('Error fetching todos:', err);
    }
  };
  
  const fetchUsers = async (): Promise<void> => {
    try {
      // First check localStorage
      const localUsers = localStorage.getItem('dummyjson_users');
      
      if (localUsers) {
        // Use local users if available
        setUsers(JSON.parse(localUsers));
      } else {
        // Otherwise fetch from API
        const response = await fetch('https://dummyjson.com/users?limit=10');
        const data = await response.json();
        
        if (data && data.users) {
          const usersList = data.users.map((user: any) => ({ 
            id: user.id, 
            username: user.username || `User ${user.id}` 
          }));
          
          setUsers(usersList);
          // Save to localStorage
          localStorage.setItem('dummyjson_users', JSON.stringify(usersList));
        }
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setTodoForm({
        ...todoForm,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (name === 'userId') {
      setTodoForm({
        ...todoForm,
        [name]: parseInt(value, 10)
      });
    } else {
      setTodoForm({
        ...todoForm,
        [name]: value
      });
    }
  };

  const resetForm = (): void => {
    setTodoForm({
      todo: '',
      completed: false,
      userId: 1
    });
    setEditMode(false);
    setCurrentTodoId(null);
  };

  const handleEditClick = (todo: Todo): void => {
    setTodoForm({
      todo: todo.todo,
      completed: todo.completed,
      userId: todo.userId
    });
    setCurrentTodoId(todo.id);
    setEditMode(true);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id: number): Promise<void> => {
    try {
      setActionLoading(true);
      
      // Call the API (this is for consistency, though we know it doesn't actually delete)
      await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'DELETE'
      });
      
      // Update local state
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
      
      // Update localStorage
      localStorage.setItem('dummyjson_todos', JSON.stringify(updatedTodos));
      
      setActionLoading(false);
    } catch (err) {
      setError('Failed to delete todo');
      setActionLoading(false);
      console.error('Error deleting todo:', err);
    }
  };

  const handleToggleComplete = async (todo: Todo): Promise<void> => {
    try {
      setActionLoading(true);
      
      // Call the API
      const response = await fetch(`https://dummyjson.com/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      });
      
      const updatedTodo: Todo = await response.json();
      
      // Handle the case where the API doesn't return the full object
      const completeUpdatedTodo = {
        ...todo,
        completed: !todo.completed
      };
      
      // Update todo in state
      const updatedTodos = todos.map(t => 
        t.id === todo.id ? completeUpdatedTodo : t
      );
      
      setTodos(updatedTodos);
      
      // Update localStorage
      localStorage.setItem('dummyjson_todos', JSON.stringify(updatedTodos));
      
      setActionLoading(false);
    } catch (err) {
      setError('Failed to update todo status');
      setActionLoading(false);
      console.error('Error updating todo status:', err);
    }
  };

  const handleCancelClick = (): void => {
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!todoForm.todo.trim()) {
      setError('Todo cannot be empty');
      return;
    }
    
    try {
      setActionLoading(true);
      
      let updatedTodos: Todo[];
      
      if (editMode && currentTodoId) {
        // Update existing todo
        const response = await fetch(`https://dummyjson.com/todos/${currentTodoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todoForm)
        });
        
        const updatedTodo = await response.json();
        
        // Find the original todo to preserve fields not changed
        const originalTodo = todos.find(todo => todo.id === currentTodoId);
        if (!originalTodo) throw new Error('Todo not found');
        
        // Merge the updated todo with original values for any missing fields
        const fullUpdatedTodo: Todo = {
          ...originalTodo,
          todo: todoForm.todo,
          completed: todoForm.completed,
          userId: todoForm.userId
        };
        
        // Update in state
        updatedTodos = todos.map(todo => 
          todo.id === currentTodoId ? fullUpdatedTodo : todo
        );
      } else {
        // Create new todo
        const response = await fetch('https://dummyjson.com/todos/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todoForm)
        });
        
        let newTodo = await response.json();
        
        // If API didn't provide an ID, generate one
        if (!newTodo.id) {
          const highestId = Math.max(...todos.map(todo => todo.id), 0);
          newTodo.id = highestId + 1;
        }
        
        // Make sure all required fields are set
        newTodo = {
          id: newTodo.id,
          todo: todoForm.todo,
          completed: todoForm.completed,
          userId: todoForm.userId
        };
        
        // Add to state
        updatedTodos = [newTodo, ...todos];
      }
      
      // Update state and localStorage
      setTodos(updatedTodos);
      localStorage.setItem('dummyjson_todos', JSON.stringify(updatedTodos));
      
      // Reset form
      resetForm();
      setActionLoading(false);
      
    } catch (err) {
      setError(`Failed to ${editMode ? 'update' : 'create'} todo`);
      setActionLoading(false);
      console.error(`Error ${editMode ? 'updating' : 'creating'} todo:`, err);
    }
  };

  const getUsernameById = (userId: number): string => {
    return users.find(user => user.id === userId)?.username || `User ${userId}`;
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  // Show error banner with reset option
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
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
        <button 
          onClick={fetchTodos}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      
      {/* Todo form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8 shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? 'Edit Todo' : 'Add a Todo'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="todo">Task</label>
            <input
              type="text"
              id="todo"
              name="todo"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={todoForm.todo}
              onChange={handleInputChange}
              placeholder="What needs to be done?"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="userId">Assigned To</label>
            <select
              id="userId"
              name="userId"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={todoForm.userId}
              onChange={handleInputChange}
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="completed"
                className="mr-2 h-4 w-4"
                checked={todoForm.completed}
                onChange={handleInputChange}
              />
              <span className="text-gray-700">Mark as completed</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3">
            {editMode && (
              <button
                type="button"
                onClick={handleCancelClick}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                disabled={actionLoading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              disabled={actionLoading}
            >
              {actionLoading 
                ? (editMode ? 'Saving...' : 'Adding...') 
                : (editMode ? 'Save Changes' : 'Add Todo')}
            </button>
          </div>
        </form>
      </div>
      
      {/* Todos list */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 rounded ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.length > 0 ? (
              filteredTodos.map(todo => (
                <TodoComponent
                  key={todo.id}
                  todo={todo}
                  onDelete={handleDeleteClick}
                  onEdit={handleEditClick}
                  onToggleComplete={handleToggleComplete}
                  userName={getUsernameById(todo.userId)}
                  isLoading={actionLoading}
                />
              ))
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {filter === 'all' 
                    ? 'No todos yet' 
                    : filter === 'completed' 
                      ? 'No completed todos' 
                      : 'No active todos'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === 'all' 
                    ? 'Get started by creating a new todo.' 
                    : 'Change your filter or add new tasks.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodosPage;