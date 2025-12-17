import React from 'react';

export default function TaskItem({ task, onToggle, onDelete }) {
  const completed = JSON.parse(task.completed);

  return (
    <li style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: completed ? '#d4edda' : '#fff'
    }}>
      <div>
        <strong>{task.title}</strong> ({task.category})<br />
        <small>{completed ? 'Dokončeno' : 'Nedokončeno'}</small>
      </div>
      <div>
        <button onClick={() => onToggle(task)} style={{ marginRight: '5px' }}>
          {completed ? 'Zpět' : 'Dokončit'}
        </button>
        <button onClick={() => onDelete(task.id)}>Smazat</button>
      </div>
    </li>
  );
}
