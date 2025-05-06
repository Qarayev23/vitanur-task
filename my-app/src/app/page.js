'use client';

import { useState, useEffect } from 'react';
import '../style/reset.css';
import '../style/main.css';

export default function Home() {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();

    if (/\d/.test(author)) {
      setError('Author name cannot contain numbers.');
      return;
    }

    if (text.trim() !== '' && author.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text,
        author,
        completed: false,
        deleted: false,
      };

      setTasks([...tasks, newTask]);
      setText('');
      setAuthor('');
      setError('');
    }
  };

  const handleComplete = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDelete = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, deleted: true } : task
    );
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    const isNotDeleted = !task.deleted;

    if (filter === 'completed') {
      return task.completed && isNotDeleted;
    }

    if (filter === 'incomplete') {
      return !task.completed && isNotDeleted;
    }

    if (filter === 'deleted') {
      return task.deleted;
    }

    return isNotDeleted;
  });

  return (
    <div className='container'>
      <h1 className='title'>To-Do List App</h1>
      <div className='header'>
        <p className='total-count'>Total Tasks: {tasks.filter(t => !t.deleted).length}</p>
        <p className='completed-count'>
          Completed Tasks: {tasks.filter(t => t.completed && !t.deleted).length}
        </p>

        <div className='filter-group'>
          <label htmlFor="filter-select" style={{ marginRight: '8px' }}>Filter:</label>
          <select
            id="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleAddTask} className='form'>
        <input
          type="text"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className='input'
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className='input'
        />
        <button className='submit-btn'>Submit</button>
        {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
      </form>

      {!!filteredTasks.length && (
        <div className='tasks'>
          {filteredTasks.map((item) => (
            <div key={item.id} className='tasks-item'>
              <span className={`tasks-item-text ${item.completed ? 'completed' : ''}`}>
                {item.text} - Created by: {item.author}
              </span>
              {!item.deleted && (
                <div className="button-group">
                  <button onClick={() => handleComplete(item.id)} className='complete-btn'>
                    {item.completed ? 'Uncomplete' : 'Complete'}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className='delete-btn'>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}