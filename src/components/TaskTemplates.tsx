import React from 'react';
import { Zap, Heart, BookOpen, Home, Briefcase, Star } from 'lucide-react';

interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  icon: React.ReactNode;
}

interface TaskTemplatesProps {
  onSelectTemplate: (template: Omit<TaskTemplate, 'id' | 'icon'>) => void;
  onClose: () => void;
}

const TaskTemplates: React.FC<TaskTemplatesProps> = ({ onSelectTemplate, onClose }) => {
  const templates: TaskTemplate[] = [
    {
      id: '1',
      title: 'Morning Exercise',
      description: 'Complete 30 minutes of physical activity',
      category: 'Health',
      priority: 'High',
      icon: <Heart className="w-4 h-4" />
    },
    {
      id: '2',
      title: 'Study Session',
      description: 'Focus on learning for 1 hour',
      category: 'Learning',
      priority: 'Medium',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: '3',
      title: 'Clean Room',
      description: 'Organize and tidy up living space',
      category: 'Chores',
      priority: 'Low',
      icon: <Home className="w-4 h-4" />
    },
    {
      id: '4',
      title: 'Work Project',
      description: 'Complete important work assignment',
      category: 'Work',
      priority: 'High',
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      id: '5',
      title: 'Pokémon Training',
      description: 'Train with your Pokémon partner',
      category: 'Training',
      priority: 'Medium',
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: '6',
      title: 'Personal Goal',
      description: 'Work on personal development',
      category: 'Personal',
      priority: 'Medium',
      icon: <Star className="w-4 h-4" />
    }
  ];

  const handleTemplateSelect = (template: TaskTemplate) => {
    onSelectTemplate({
      title: template.title,
      description: template.description,
      category: template.category,
      priority: template.priority
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-gameboy-medium border-4 border-gameboy-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-pixel text-sm text-gameboy-lightest">
            Quick Task Templates
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 bg-gameboy-dark border border-gameboy-border rounded flex items-center justify-center hover:bg-red-800 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="bg-gameboy-dark border-2 border-gameboy-border rounded-lg p-4 text-left hover:border-gameboy-light transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gameboy-light rounded flex items-center justify-center">
                  {template.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-pixel text-xs text-gameboy-lightest mb-1">
                    {template.title}
                  </h3>
                  <p className="font-pixel text-xs text-gameboy-light mb-2">
                    {template.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="font-pixel text-xs text-gameboy-light">
                      {template.category}
                    </span>
                    <span className="font-pixel text-xs text-gameboy-light">
                      • {template.priority}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskTemplates;
