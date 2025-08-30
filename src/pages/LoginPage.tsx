import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (type: 'ash' | 'misty') => {
    if (type === 'ash') {
      setEmail('ash@pokemon.com');
    } else {
      setEmail('misty@pokemon.com');
    }
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gameboy-dark">
      <div className="max-w-md mx-auto bg-gameboy-medium min-h-screen border-l-4 border-r-4 border-gameboy-border">
        
        {/* Header */}
        <div className="bg-gameboy-dark border-b-4 border-gameboy-border p-4 flex items-center">
          <Link to="/" className="mr-4 p-2 hover:bg-gameboy-medium rounded transition-colors">
            <ArrowLeft size={16} className="text-gameboy-lightest" />
          </Link>
          <h1 className="font-pixel text-sm text-gameboy-lightest">Login</h1>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gameboy-light border-4 border-gameboy-lightest rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">🎮</span>
            </div>
            <h2 className="font-pixel text-sm text-gameboy-lightest">Welcome Back!</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-800 border-2 border-red-600 rounded p-3">
                <p className="font-pixel text-xs text-red-200">{error}</p>
              </div>
            )}

            <div>
              <label className="block font-pixel text-xs text-gameboy-lightest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gameboy-dark border-2 border-gameboy-border rounded p-3 text-gameboy-lightest font-pixel text-xs focus:border-gameboy-light focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-pixel text-xs text-gameboy-lightest mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gameboy-dark border-2 border-gameboy-border rounded p-3 text-gameboy-lightest font-pixel text-xs focus:border-gameboy-light focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gameboy-light text-gameboy-dark font-pixel text-xs py-3 px-4 border-4 border-gameboy-lightest rounded-lg hover:bg-gameboy-lightest disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
            >
              {loading ? 'Loading...' : 'LOGIN'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-gameboy-dark border-2 border-gameboy-border rounded-lg">
            <p className="font-pixel text-xs text-gameboy-light mb-3 text-center">Try Demo Accounts:</p>
            <div className="flex space-x-2">
              <button
                onClick={() => fillDemoAccount('ash')}
                className="flex-1 bg-orange-600 text-orange-100 font-pixel text-xs py-2 px-3 border-2 border-orange-400 rounded hover:bg-orange-500 transition-colors"
              >
                Ash
              </button>
              <button
                onClick={() => fillDemoAccount('misty')}
                className="flex-1 bg-blue-600 text-blue-100 font-pixel text-xs py-2 px-3 border-2 border-blue-400 rounded hover:bg-blue-500 transition-colors"
              >
                Misty
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="font-pixel text-xs text-gameboy-light">
              New trainer?{' '}
              <Link to="/register" className="text-gameboy-lightest hover:text-gameboy-light">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;