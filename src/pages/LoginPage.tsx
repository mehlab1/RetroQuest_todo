import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';
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

  const handleGoogleLogin = () => {
    authApi.googleLogin();
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

          {/* Google OAuth Button */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gameboy-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gameboy-medium px-2 text-gameboy-light">Or</span>
              </div>
            </div>
            
            <button
              onClick={handleGoogleLogin}
              className="w-full mt-4 bg-white text-gray-800 font-pixel text-xs py-3 px-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

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