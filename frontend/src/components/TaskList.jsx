import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (!tasks.length) return <p>Žádné úkoly.</p>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
