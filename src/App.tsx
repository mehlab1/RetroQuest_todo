import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import AudioControls from './components/AudioControls';
import PokemonCatching from './components/PokemonCatching';
import MyPokemons from './components/MyPokemons';
import { AchievementProvider } from './contexts/AchievementContext';
import { AuthProvider } from './contexts/AuthContext';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [showPokemonCatching, setShowPokemonCatching] = useState(false);
  const [showMyPokemons, setShowMyPokemons] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <AuthProvider>
      <AchievementProvider>
        <Router>
          <div className="min-h-screen bg-gameboy-dark text-gameboy-lightest font-pixel safe-area">
            
            {/* Fixed Mobile Header */}
            <header className="mobile-header">
              <div className="mobile-header-content">
                <h1 className="mobile-header-title">RetroQuest</h1>
                <div className="mobile-header-actions">
                  <AudioControls />
                  <button
                    onClick={toggleMobileMenu}
                    className="nes-btn touch-button w-12 h-12"
                    title="Menu"
                  >
                    {showMobileMenu ? (
                      <X size={20} className="text-gameboy-lightest" />
                    ) : (
                      <Menu size={20} className="text-gameboy-lightest" />
                    )}
                  </button>
                </div>
              </div>
            </header>

            {/* Main Content with Header Padding */}
            <main className="mobile-main-content">
              <AppRoutes />
            </main>
            
            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
              <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
                <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
                  <div className="mobile-menu-item nes-btn is-primary"
                    onClick={() => {
                      setShowPokemonCatching(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    <span className="mobile-menu-icon nes-icon is-large">🎮</span>
                    <div className="mobile-menu-text">
                      <div>Catch Pokemon</div>
                      <div className="mobile-menu-description">Find new Pokemon</div>
                    </div>
                  </div>
                  
                  <div className="mobile-menu-item nes-btn is-warning"
                    onClick={() => {
                      setShowMyPokemons(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    <span className="mobile-menu-icon nes-icon is-large">⚡</span>
                    <div className="mobile-menu-text">
                      <div>My Pokemons</div>
                      <div className="mobile-menu-description">View collection</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {showPokemonCatching && (
              <PokemonCatching onClose={() => setShowPokemonCatching(false)} />
            )}

            {showMyPokemons && (
              <MyPokemons onClose={() => setShowMyPokemons(false)} />
            )}
          </div>
        </Router>
      </AchievementProvider>
    </AuthProvider>
  );
};

export default App;