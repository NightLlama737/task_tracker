import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';
import io from 'socket.io-client';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const socket = io('http://localhost:4000');

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks().then(setTasks);

    socket.on('task_added', task => setTasks(prev => [...prev, task]));
    socket.on('task_updated', updated => setTasks(prev => prev.map(t => t.id === updated.id ? updated : t)));
    socket.on('task_deleted', deleted => setTasks(prev => prev.filter(t => t.id !== deleted.id)));
  }, []);

  const addTask = async (task) => {
    await createTask(task);
  };

  const toggleComplete = async (task) => {
    await updateTask(task.id, { ...task, completed: !JSON.parse(task.completed) });
  };

  const removeTask = async (id) => {
    await deleteTask(id);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Task Tracker</h1>
      <TaskForm onAdd={addTask} />
      <TaskList tasks={tasks} onToggle={toggleComplete} onDelete={removeTask} />
    </div>
  );
}

export default App;
