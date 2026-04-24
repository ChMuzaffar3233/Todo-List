import { useState } from 'react'
function Create({ onAdd }) {
  const [task, setTask] = useState('');

  const handleAdd = () => {
    if (!task.trim()) return;
    onAdd(task.trim());
    setTask('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="create_form">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a task..."
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  )
}

export default Create