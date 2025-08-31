import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Zap, Target, Trophy } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gameboy-dark">
      {/* Game Boy Screen Container */}
      <div className="max-w-md mx-auto bg-gameboy-medium min-h-screen border-l-4 border-r-4 border-gameboy-border">
        
        {/* Header */}
        <div className="bg-gameboy-dark border-b-4 border-gameboy-border p-4 text-center">
          <h1 className="font-pixel text-lg text-gameboy-lightest mb-2">RetroQuest</h1>
          <p className="font-pixel text-xs text-gameboy-light">Game Boy To-Do</p>
        </div>

        {/* Hero Section */}
        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gameboy-light border-4 border-gameboy-lightest rounded-lg mb-4 flex items-center justify-center animate-float">
              <span className="text-4xl">🎮</span>
            </div>
            <h2 className="font-pixel text-sm text-gameboy-lightest mb-2">
              Level Up Your Life!
            </h2>
            <p className="font-pixel text-xs text-gameboy-light leading-relaxed">
              Complete tasks, earn points, evolve your Pokémon companion!
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <FeatureCard icon={<Target size={16} />} title="Daily Quests" />
            <FeatureCard icon={<Zap size={16} />} title="Level System" />
            <FeatureCard icon={<Trophy size={16} />} title="Achievements" />
            <FeatureCard icon={<Gamepad2 size={16} />} title="Pokémon Pets" />
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              to="/register"
              className="block w-full bg-gameboy-light text-gameboy-dark font-pixel text-xs py-3 px-4 border-4 border-gameboy-lightest rounded-lg hover:bg-gameboy-lightest transition-colors duration-200 transform hover:scale-105"
            >
              START QUEST
            </Link>
            <Link
              to="/login"
              className="block w-full bg-gameboy-medium text-gameboy-lightest font-pixel text-xs py-3 px-4 border-4 border-gameboy-border rounded-lg hover:bg-gameboy-light hover:text-gameboy-dark transition-colors duration-200"
            >
              CONTINUE
            </Link>
          </div>

          {/* Security Info */}
          <div className="mt-8 p-4 bg-gameboy-dark border-2 border-gameboy-border rounded-lg">
            <p className="font-pixel text-xs text-gameboy-light mb-2">🔐 Secure Authentication:</p>
            <p className="font-pixel text-xs text-gameboy-lightest">• Google OAuth 2.0</p>
            <p className="font-pixel text-xs text-gameboy-lightest">• JWT Token Security</p>
            <p className="font-pixel text-xs text-gameboy-lightest">• Encrypted Passwords</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className="bg-gameboy-dark border-2 border-gameboy-border rounded-lg p-3 hover:border-gameboy-light transition-colors duration-200">
    <div className="w-8 h-8 mx-auto mb-2 bg-gameboy-medium border-2 border-gameboy-lightest rounded flex items-center justify-center text-gameboy-lightest">
      {icon}
    </div>
    <p className="font-pixel text-xs text-gameboy-lightest">{title}</p>
  </div>
);

export default LandingPage;