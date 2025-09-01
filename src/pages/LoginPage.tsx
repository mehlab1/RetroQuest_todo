import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import soundEffects from '../utils/soundEffects';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Demo account functionality removed for security

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      soundEffects.playVictory();
      navigate('/dashboard');
    } catch (error: { response?: { data?: { error?: string } } }) {
      setError(error.response?.data?.error || 'Login failed');
      soundEffects.playError();
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth removed as requested

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    soundEffects.playNavigate();
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
              <span className="text-2xl">🕹️</span>
            </div>
            <h2 className="font-pixel text-sm text-gameboy-lightest">Welcome Back!</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900 border-2 border-red-600 rounded p-3">
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
                className="w-full bg-gameboy-dark border-2 border-gameboy-border rounded p-3 font-pixel text-xs text-gameboy-lightest focus:border-gameboy-light focus:outline-none transition-colors"
                placeholder="trainer@pokemon.com"
                required
              />
            </div>

            <div>
              <label className="block font-pixel text-xs text-gameboy-lightest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gameboy-dark border-2 border-gameboy-border rounded p-3 pr-12 font-pixel text-xs text-gameboy-lightest focus:border-gameboy-light focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gameboy-light hover:text-gameboy-lightest transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gameboy-light text-gameboy-dark font-pixel text-xs py-3 px-4 border-2 border-gameboy-lightest rounded hover:bg-gameboy-lightest transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'LOADING...' : 'LOGIN'}
            </button>



            <div className="text-center mt-6">
              <p className="text-gameboy-light font-pixel text-xs">
                Secure login with email and password
              </p>
            </div>

            <div className="text-center mt-4">
              <p className="font-pixel text-xs text-gameboy-light">
                Don't have an account?{' '}
                <Link to="/register" className="text-gameboy-lightest hover:text-gameboy-light underline transition-colors">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;