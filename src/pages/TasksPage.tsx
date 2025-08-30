import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tasksApi } from '../services/api';
import { Plus, X, Edit3 } from 'lucide-react';
import TaskForm from '../components/TaskForm';

interface Task {
  taskId: number;
  title: string;
  description?: string;
  category?: string;
  isDone: boolean;
  createdAt: string;
}

const TasksPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await tasksApi.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (taskData: { title: string; description?: string; category?: string }) => {
    try {
      if (editingTask) {
        await tasksApi.updateTask(editingTask.taskId, taskData);
      } else {
        await tasksApi.createTask(taskData);
      }
      await loadTasks();
      await refreshUser();
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const toggleTask = async (taskId: number, isDone: boolean) => {
    try {
      await tasksApi.updateTask(taskId, { isDone: !isDone });
      await loadTasks();
      await refreshUser();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const deleteTask = async (taskId: number) => {
    if (confirm('Delete this task?')) {
      try {
        await tasksApi.deleteTask(taskId);
        await loadTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const categories = ['Training', 'Health', 'Learning', 'Chores', 'Work', 'Personal'];
  const completedTasks = tasks.filter(task => task.isDone).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 animate-pulse">📋</div>
          <p className="font-pixel text-xs text-gameboy-light">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gameboy-dark border-4 border-gameboy-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-pixel text-sm text-gameboy-lightest">Task Pokédex</h1>
          <div className="text-right">
            <p className="font-pixel text-xs text-gameboy-light">
              {completedTasks}/{tasks.length} caught
            </p>
            <div className="w-20 h-2 bg-gameboy-medium border border-gameboy-border rounded overflow-hidden mt-1">
              <div 
                className="h-full bg-gameboy-light transition-all duration-500"
                style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-gameboy-light text-gameboy-dark font-pixel text-xs py-3 px-4 border-2 border-gameboy-lightest rounded flex items-center justify-center space-x-2 hover:bg-gameboy-lightest transition-colors duration-200"
        >
          <Plus size={12} />
          <span>NEW TASK</span>
        </button>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleTaskSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          categories={categories}
        />
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.taskId}
              task={task}
              onToggle={() => toggleTask(task.taskId, task.isDone)}
              onEdit={() => startEdit(task)}
              onDelete={() => deleteTask(task.taskId)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 opacity-50">📝</div>
            <p className="font-pixel text-xs text-gameboy-light mb-4">No tasks yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gameboy-light text-gameboy-dark font-pixel text-xs py-2 px-4 border-2 border-gameboy-lightest rounded hover:bg-gameboy-lightest transition-colors"
            >
              Create First Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TaskCard: React.FC<{
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ task, onToggle, onEdit, onDelete }) => {
  const getCategoryEmoji = (category?: string) => {
    switch (category) {
      case 'Training': return '⚡';
      case 'Health': return '❤️';
      case 'Learning': return '📚';
      case 'Chores': return '🧹';
      case 'Work': return '💼';
      case 'Personal': return '🌟';
      default: return '📝';
    }
  };

  return (
    <div className={`bg-gameboy-dark border-2 rounded-lg p-4 transition-all duration-200 ${
      task.isDone ? 'border-gameboy-light opacity-75' : 'border-gameboy-border hover:border-gameboy-light'
    }`}>
      <div className="flex items-start space-x-3">
        {/* Pokéball Checkbox */}
        <button
          onClick={onToggle}
          className={`w-8 h-8 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
            task.isDone
              ? 'bg-gameboy-light border-gameboy-lightest text-gameboy-dark'
              : 'bg-gameboy-medium border-gameboy-border hover:border-gameboy-light'
          }`}
        >
          <div className={`w-4 h-4 rounded-full border transition-all duration-200 ${
            task.isDone ? 'bg-gameboy-dark border-gameboy-dark' : 'border-gameboy-lightest'
          }`} />
        </button>

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            {task.category && (
              <span className="text-sm">{getCategoryEmoji(task.category)}</span>
            )}
            <h3 className={`font-pixel text-xs ${
              task.isDone ? 'line-through text-gameboy-light' : 'text-gameboy-lightest'
            }`}>
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p className={`font-pixel text-xs mt-1 leading-relaxed ${
              task.isDone ? 'text-gameboy-light' : 'text-gameboy-light'
            }`}>
              {task.description}
            </p>
          )}

          {task.category && (
            <span className="inline-block mt-2 px-2 py-1 bg-gameboy-medium border border-gameboy-border rounded font-pixel text-xs text-gameboy-light">
              {task.category}
            </span>
          )}
        </div>

        <div className="flex flex-col space-y-1">
          <button
            onClick={onEdit}
            className="w-6 h-6 bg-gameboy-medium border border-gameboy-border rounded flex items-center justify-center hover:bg-gameboy-light hover:text-gameboy-dark transition-colors"
          >
            <Edit3 size={10} />
          </button>
          <button
            onClick={onDelete}
            className="w-6 h-6 bg-red-800 border border-red-600 rounded flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <X size={10} className="text-red-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;