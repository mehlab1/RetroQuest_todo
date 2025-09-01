import React, { useState, useRef, useEffect } from 'react';
import soundEffects from '../utils/soundEffects';

interface Task {
  taskId: number;
  title: string;
  isDone: boolean;
}

interface SwipeableTaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: number, isDone: boolean) => void;
  maxVisible?: number;
}

const SwipeableTaskList: React.FC<SwipeableTaskListProps> = ({ 
  tasks, 
  onToggleTask, 
  maxVisible = 3 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(tasks.length / maxVisible);
  const visibleTasks = tasks.slice(currentIndex * maxVisible, (currentIndex + 1) * maxVisible);

  // Touch/Mouse event handlers for retro-style swiping
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setTranslateX(0);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Determine swipe direction based on threshold
    const threshold = 50;
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0 && currentIndex > 0) {
        // Swipe right - go to previous page
        setCurrentIndex(prev => prev - 1);
        soundEffects.playNavigate();
      } else if (translateX < 0 && currentIndex < totalPages - 1) {
        // Swipe left - go to next page
        setCurrentIndex(prev => prev + 1);
        soundEffects.playNavigate();
      }
    }
    
    setTranslateX(0);
  };

  // Navigation buttons
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      soundEffects.playNavigate();
    }
  };

  const goToNext = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(prev => prev + 1);
      soundEffects.playNavigate();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, totalPages, goToNext, goToPrevious]);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 opacity-50">🎯</div>
        <p className="font-pixel text-xs text-gameboy-light">No tasks for today</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Task List Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        <div 
          className="transition-transform duration-200 ease-out"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          <div className="space-y-2">
            {visibleTasks.map((task) => (
              <div
                key={task.taskId}
                className="flex items-center space-x-3 p-2 bg-gameboy-medium border-2 border-gameboy-border rounded hover:border-gameboy-light transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
                onClick={() => {
                  onToggleTask(task.taskId, task.isDone);
                  if (task.isDone) {
                    soundEffects.playMenuSelect();
                  } else {
                    soundEffects.playTaskComplete();
                  }
                }}
              >
                {/* Retro-style checkbox */}
                <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                  task.isDone 
                    ? 'bg-gameboy-light border-gameboy-lightest text-gameboy-dark shadow-lg' 
                    : 'border-gameboy-border bg-gameboy-dark hover:border-gameboy-light'
                }`}>
                  {task.isDone && (
                    <span className="font-pixel text-xs animate-pulse">✓</span>
                  )}
                </div>
                <span className={`font-pixel text-xs flex-1 transition-all duration-200 ${
                  task.isDone ? 'line-through text-gameboy-light' : 'text-gameboy-lightest'
                }`}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`w-8 h-8 border-2 border-gameboy-border rounded flex items-center justify-center transition-all duration-200 ${
              currentIndex === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:border-gameboy-light hover:bg-gameboy-medium cursor-pointer'
            }`}
          >
            <span className="font-pixel text-xs text-gameboy-lightest">◀</span>
          </button>

          {/* Page Indicator */}
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 border border-gameboy-border rounded transition-all duration-200 ${
                  i === currentIndex 
                    ? 'bg-gameboy-light border-gameboy-lightest' 
                    : 'bg-gameboy-dark'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            disabled={currentIndex === totalPages - 1}
            className={`w-8 h-8 border-2 border-gameboy-border rounded flex items-center justify-center transition-all duration-200 ${
              currentIndex === totalPages - 1 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:border-gameboy-light hover:bg-gameboy-medium cursor-pointer'
            }`}
          >
            <span className="font-pixel text-xs text-gameboy-lightest">▶</span>
          </button>
        </div>
      )}

      {/* Retro-style Instructions */}
      {totalPages > 1 && (
        <div className="text-center mt-2">
          <p className="font-pixel text-xs text-gameboy-light opacity-75">
            Swipe or use ← → keys to navigate
          </p>
        </div>
      )}
    </div>
  );
};

export default SwipeableTaskList;
