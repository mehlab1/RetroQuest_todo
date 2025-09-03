import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tasksApi } from '../services/api';
import { X, Calendar, CheckCircle, Circle } from 'lucide-react';
import soundEffects from '../utils/soundEffects';

interface TaskHistoryItem {
  historyId: number;
  taskId: number;
  title: string;
  description?: string;
  category?: string;
  priority?: string;
  date: string;
  isDone: boolean;
  completedAt?: string;
}

interface TaskHistoryProps {
  onClose: () => void;
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [taskHistory, setTaskHistory] = useState<TaskHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState(7);

  useEffect(() => {
    loadTaskHistory();
  }, [selectedDays]);

  const loadTaskHistory = async () => {
    try {
      setLoading(true);
      const response = await tasksApi.getTaskHistory(selectedDays);
      setTaskHistory(response.data);
    } catch (error) {
      console.error('Failed to load task history:', error);
      soundEffects.playError();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Work': return 'bg-blue-600';
      case 'Personal': return 'bg-green-600';
      case 'Health': return 'bg-red-600';
      case 'Learning': return 'bg-purple-600';
      case 'Training': return 'bg-orange-600';
      case 'Chores': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const groupTasksByDate = (tasks: TaskHistoryItem[]) => {
    const grouped: { [key: string]: TaskHistoryItem[] } = {};
    tasks.forEach(task => {
      const dateKey = task.date.split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(task);
    });
    return grouped;
  };

  const groupedTasks = groupTasksByDate(taskHistory);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="nes-container with-title is-rounded">
          <p className="title">Loading History...</p>
          <div className="flex justify-center p-4">
            <div className="spinner-gameboy"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="nes-container with-title is-rounded w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <p className="title">Task History</p>
        <div className="p-3 sm:p-6">
          {/* Mobile-responsive header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gameboy-lightest" />
              <span className="font-pixel text-sm text-gameboy-lightest">
                Past {selectedDays} days
              </span>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={selectedDays}
                onChange={(e) => setSelectedDays(parseInt(e.target.value))}
                className="nes-select bg-gameboy-dark border-2 border-gameboy-border text-gameboy-lightest font-pixel text-xs flex-1 sm:flex-none"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
              <button
                onClick={() => {
                  soundEffects.playMenuCancel();
                  onClose();
                }}
                className="nes-btn is-error touch-button w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
                title="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {Object.keys(groupedTasks).length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 opacity-50">📚</div>
              <p className="font-pixel text-sm text-gameboy-lightest mb-2">
                No task history found
              </p>
              <p className="font-pixel text-xs text-gameboy-light">
                Completed tasks will appear here after daily reset
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedTasks)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([date, tasks]) => (
                  <div key={date} className="border-2 border-gameboy-border rounded p-3">
                    <h3 className="font-pixel text-sm text-gameboy-lightest mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(date)}
                      <span className="ml-2 text-xs text-gameboy-light">
                        ({tasks.length} tasks)
                      </span>
                    </h3>
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <div
                          key={task.historyId}
                          className="flex items-start justify-between p-2 bg-gameboy-dark border border-gameboy-border rounded"
                        >
                          <div className="flex items-start space-x-2 flex-1 min-w-0">
                            {task.isDone ? (
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`font-pixel text-xs ${task.isDone ? 'line-through text-gray-400' : 'text-gameboy-lightest'} break-words`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="font-pixel text-xs text-gameboy-light mt-1 break-words">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1 ml-2">
                            {task.category && (
                              <span className={`px-2 py-1 rounded text-xs font-pixel text-white ${getCategoryColor(task.category)} whitespace-nowrap`}>
                                {task.category}
                              </span>
                            )}
                            {task.priority && (
                              <span className={`font-pixel text-xs ${getPriorityColor(task.priority)} whitespace-nowrap`}>
                                {task.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskHistory;
