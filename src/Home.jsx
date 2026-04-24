import { useState, useEffect } from 'react'
import axios from 'axios'
import Create from './Create'

const API = 'http://localhost:5000/api/todos'

function Home() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTodos = async () => {
      try {
        const { data } = await axios.get(API, {
          signal: controller.signal,
        });
        setTodos(data);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          console.error('Failed to load todos:', err);
        }
      }
    };

    fetchTodos();

    return () => {
      controller.abort();
    };
  }, []);

  const handleAddTodo = (task) => {
    axios.post(API, { text: task })
      .then(res => setTodos(prev => [res.data, ...prev]))
      .catch(err => console.error('Failed to add:', err));
  };

  const handleToggle = (id, completed) => {
    axios.patch(`${API}/${id}`, { completed: !completed })
      .then(res => {
        setTodos(prev => prev.map(todo => todo.id === id ? res.data : todo));
      })
      .catch(err => console.error('Failed to toggle:', err));
  };

  const handleDelete = (id) => {
    axios.delete(`${API}/${id}`)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== id)))
      .catch(err => console.error('Failed to delete:', err));
  };

  return (
    <div className="home">
      <h1>Todo List</h1>
      <Create onAdd={handleAddTodo} />
      {todos.length === 0 ? (
        <p className="empty">No tasks yet. Add one above.</p>
      ) : (
        <ul className="todo_list">
          {todos.map(todo => (
            <li key={todo.id} className="todo_item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id, todo.completed)}
                className="todo_checkbox"
              />
              <span className={todo.completed ? 'todo_text done' : 'todo_text'}>
                {todo.text}
              </span>
              <button className="delete_btn" onClick={() => handleDelete(todo.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Home
