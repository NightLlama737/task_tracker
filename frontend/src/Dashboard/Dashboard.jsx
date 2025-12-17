import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import io from 'socket.io-client';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from './components/TaskList';
import { useAuth } from './AuthProvider';

const socket = io('http://localhost:4000');

function Dashboard() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!token) return;
    getTasks(token).then(setTasks);

    socket.on('task_added', task => {
      if (task.username === JSON.parse(atob(token.split('.')[1])).username) {
        setTasks(prev => [...prev, task]);
      }
    });
    socket.on('task_updated', updated => {
      if (updated.username === JSON.parse(atob(token.split('.')[1])).username) {
        setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
      }
    });
    socket.on('task_deleted', deleted => {
      if (deleted.username === JSON.parse(atob(token.split('.')[1])).username) {
        setTasks(prev => prev.filter(t => t.id !== deleted.id));
      }
    });
  }, [token]);

  const addTask = async (task) => {
    await createTask(task, token);
  };

  const toggleComplete = async (task) => {
    await updateTask(task.id, { ...task, completed: !JSON.parse(task.completed) }, token);
  };

  const removeTask = async (id) => {
    await deleteTask(id, token);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Task Tracker</h1>
      <TaskForm onAdd={addTask} />
      <TaskList tasks={tasks} onToggle={toggleComplete} onDelete={removeTask} />
    </div>
  );
}

export default Dashboard;
