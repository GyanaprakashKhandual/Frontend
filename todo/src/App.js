import React, { useState } from 'react';
import { TodoProvider } from './context'

function App() {

  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev]);
  }

  const updateTodo = (id, todo) => {
    setTodos((prev) => prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo)));
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  const completed = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: true } : todo
      )
    );
  }
  return (
    <TodoProvider value={{ todos, addTodo, updateTodo, deleteTodo, completed }}>
      <div>

        <h1>
          Manage Your To Dos
        </h1>
        <div>

        </div>

        <div>

        </div>

      </div>
    </TodoProvider>
  )
}

export default App