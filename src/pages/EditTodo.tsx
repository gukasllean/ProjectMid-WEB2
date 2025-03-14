import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance';
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import TodoForm from '../components/TodoForm';


interface Todo {
  todo : string,
  completed : boolean,
  userId : number
}

const TodoEdit = async (data: Todo, id: string | undefined) => {
  return await axios.put(`/todo/${id}`, data);
};

const fetchTodoDat = (id: string | undefined) => {
  return axios.get<Todo>(`/todo/${id}`);
}

const EditTodo = () => {
  const { id } = useParams();

  

  const getTodoDat = useQuery({
    queryKey: ["TodoDat", id],
    queryFn: () => fetchTodoDat(id)
  });


  const navigate = useNavigate();

  const editTodoMutation = useMutation({
    mutationFn: (data: Todo) => TodoEdit(data, id)
  });

  useEffect(() => {
    if (editTodoMutation.isSuccess) {
      navigate("/todo", { replace: true });
    }
  }, [editTodoMutation.isSuccess]);

  return (
    <div className="relative">
      {editTodoMutation.isPending && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex items-center bg-white/90 px-6 py-3 rounded-lg shadow-lg">
            <span className="text-2xl mr-4 text-gray-800">Adding...</span>
            <svg
              className="animate-spin h-5 w-5 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"   
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-6 mt-25 text-center">Edit Todo</h2>
      <TodoForm isEdit={true} mutateFn={editTodoMutation.mutate} defaultInputData={getTodoDat.data?.data} />
    </div>
    );
}

export default EditTodo