import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAchievement } from '../contexts/AchievementContext';
import PokemonSelector from '../components/PokemonSelector';
import { Pokemon } from '../data/pokemon';
import soundEffects from '../utils/soundEffects';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showAchievement } = useAchievement();
  const [step, setStep] = useState<'form' | 'pokemon'>('form');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    color: 'text-red-500'
  });

  // Validation states
  const [validation, setValidation] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string) => {
    // Username: 3-20 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        feedback = 'Very Weak';
        break;
      case 2:
        feedback = 'Weak';
        break;
      case 3:
        feedback = 'Fair';
        break;
      case 4:
        feedback = 'Good';
        break;
      case 5:
        feedback = 'Strong';
        break;
    }

    const colors = ['text-red-500', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-green-600'];

    return {
      score,
      feedback,
      color: colors[score]
    };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');

    // Real-time validation
    switch (field) {
      case 'email':
        setValidation(prev => ({ ...prev, email: validateEmail(value) }));
        break;
      case 'username':
        setValidation(prev => ({ ...prev, username: validateUsername(value) }));
        break;
      case 'password':
        const strength = checkPasswordStrength(value);
        setPasswordStrength(strength);
        setValidation(prev => ({ ...prev, password: strength.score >= 3 }));
        break;
      case 'confirmPassword':
        setValidation(prev => ({ ...prev, confirmPassword: value === formData.password }));
        break;
    }
  };

  const handlePokemonSelect = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    soundEffects.playMenuSelect();
  };

  const nextStep = () => {
    // Validate all fields before proceeding
    const isEmailValid = validateEmail(formData.email);
    const isUsernameValid = validateUsername(formData.username);
    const isPasswordValid = passwordStrength.score >= 3;
    const isConfirmPasswordValid = formData.confirmPassword === formData.password;

    if (!isEmailValid) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isUsernameValid) {
      setError('Username must be 3-20 characters, letters, numbers, and underscores only');
      return;
    }

    if (!isPasswordValid) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }

    if (!isConfirmPasswordValid) {
      setError('Passwords do not match');
      return;
    }

    setStep('pokemon');
    soundEffects.playMenuConfirm();
  };

  const prevStep = () => {
    setStep('form');
    soundEffects.playMenuCancel();
  };

  const handleSubmit = async () => {
    if (!selectedPokemon) {
      setError('Please select a Pokemon companion');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register(formData.email, formData.username, formData.password, selectedPokemon);
      showAchievement(`Welcome to RetroQuest, ${formData.username}!`, 'pokemon');
      soundEffects.playVictory();
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      soundEffects.playError();
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormStep = () => (
    <div className="nes-container with-title is-rounded">
      <p className="title">Create Your Account</p>
      <div className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-xs text-gameboy-lightest mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`nes-input w-full ${validation.email ? 'is-success' : formData.email ? 'is-error' : ''}`}
            placeholder="your.email@example.com"
            required
          />
          {formData.email && !validation.email && (
            <p className="text-xs text-red-400 mt-1">Please enter a valid email address</p>
          )}
        </div>

        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-xs text-gameboy-lightest mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className={`nes-input w-full ${validation.username ? 'is-success' : formData.username ? 'is-error' : ''}`}
            placeholder="Choose a username (3-20 characters)"
            required
          />
          {formData.username && !validation.username && (
            <p className="text-xs text-red-400 mt-1">Username must be 3-20 characters, letters, numbers, and underscores only</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-xs text-gameboy-lightest mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`nes-input w-full ${validation.password ? 'is-success' : formData.password ? 'is-error' : ''}`}
            placeholder="Create a strong password"
            required
          />
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${passwordStrength.color}`}>
                  Strength: {passwordStrength.feedback}
                </span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-2 h-2 rounded-full ${
                        level <= passwordStrength.score ? passwordStrength.color.replace('text-', 'bg-') : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gameboy-light mt-1">
                Must include: 8+ characters, uppercase, lowercase, number, special character
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-xs text-gameboy-lightest mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`nes-input w-full ${validation.confirmPassword ? 'is-success' : formData.confirmPassword ? 'is-error' : ''}`}
            placeholder="Confirm your password"
            required
          />
          {formData.confirmPassword && !validation.confirmPassword && (
            <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="nes-container is-rounded bg-red-900 border-red-500">
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={nextStep}
          disabled={!validation.email || !validation.username || !validation.password || !validation.confirmPassword}
          className="nes-btn is-primary w-full touch-button"
        >
          Choose Your Pokemon →
        </button>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-xs text-gameboy-light">
            Already have an account?{' '}
            <Link to="/login" className="text-gameboy-lightest hover:text-gameboy-light">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );

  const renderPokemonStep = () => (
    <div className="space-y-4">
      <div className="nes-container with-title is-rounded">
        <p className="title">Choose Your Pokemon Companion</p>
        <p className="text-xs text-gameboy-light mb-4">
          Select your starter Pokemon! This will be your companion throughout your adventure.
        </p>
        <PokemonSelector
          selectedPokemon={selectedPokemon}
          onSelect={handlePokemonSelect}
        />
      </div>

      {/* Selected Pokemon Display */}
      {selectedPokemon && (
        <div className="nes-container with-title is-rounded">
          <p className="title">Your Choice</p>
          <div className="flex items-center space-x-4">
            <img
              src={selectedPokemon.spriteStage1}
              alt={selectedPokemon.name}
              className="w-16 h-16 object-contain"
            />
            <div>
              <h3 className="text-sm font-bold text-gameboy-lightest">{selectedPokemon.name}</h3>
              <p className="text-xs text-gameboy-light">{selectedPokemon.type}</p>
              <p className="text-xs text-gameboy-light">{selectedPokemon.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={prevStep}
          className="nes-btn w-1/2 touch-button"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedPokemon || isLoading}
          className="nes-btn is-success w-1/2 touch-button"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gameboy-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gameboy-lightest mb-2">Join RetroQuest</h1>
          <p className="text-sm text-gameboy-light">Begin your Pokemon adventure!</p>
        </div>

        {step === 'form' ? renderFormStep() : renderPokemonStep()}
      </div>
    </div>
  );
};

export default RegisterPage;