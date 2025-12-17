import React, { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !category) return;
    onAdd({ title, category, completed: false });
    setTitle('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Název úkolu"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <input
        type="text"
        placeholder="Kategorie"
        value={category}
        onChange={e => setCategory(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <button type="submit">Přidat úkol</button>
    </form>
  );
}
