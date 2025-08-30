import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Task {
  taskId: number;
  title: string;
  description?: string;
  category?: string;
}

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (taskData: { title: string; description?: string; category?: string }) => Promise<void>;
  onCancel: () => void;
  categories: string[];
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, categories }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategory(task.category || '');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        category: category || undefined
      });
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-gameboy-medium border-4 border-gameboy-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-pixel text-sm text-gameboy-lightest">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onCancel}
            className="w-6 h-6 bg-gameboy-dark border border-gameboy-border rounded flex items-center justify-center hover:bg-red-800 transition-colors"
          >
            <X size={12} className="text-gameboy-lightest" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-pixel text-xs text-gameboy-lightest mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gameboy-dark border-2 border-gameboy-border rounded p-2 text-gameboy-lightest font-pixel text-xs focus:border-gameboy-light focus:outline-none"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block font-pixel text-xs text-gameboy-lightest mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gameboy-dark border-2 border-gameboy-border rounded p-2 text-gameboy-lightest font-pixel text-xs focus:border-gameboy-light focus:outline-none resize-none"
              rows={3}
              maxLength={250}
            />
          </div>

          <div>
            <label className="block font-pixel text-xs text-gameboy-lightest mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gameboy-dark border-2 border-gameboy-border rounded p-2 text-gameboy-lightest font-pixel text-xs focus:border-gameboy-light focus:outline-none"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gameboy-dark text-gameboy-lightest font-pixel text-xs py-2 px-4 border-2 border-gameboy-border rounded hover:bg-gameboy-medium transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 bg-gameboy-light text-gameboy-dark font-pixel text-xs py-2 px-4 border-2 border-gameboy-lightest rounded hover:bg-gameboy-lightest disabled:opacity-50 transition-colors"
            >
              {loading ? 'SAVING...' : (task ? 'UPDATE' : 'CREATE')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;