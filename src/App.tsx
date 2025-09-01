import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import AudioControls from './components/AudioControls';
import PokemonCatching from './components/PokemonCatching';
import MyPokemons from './components/MyPokemons';
import { AchievementProvider } from './contexts/AchievementContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import soundEffects from './utils/soundEffects';

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [showPokemonCatching, setShowPokemonCatching] = useState(false);
  const [showMyPokemons, setShowMyPokemons] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <Router>
          <div className="min-h-screen bg-gameboy-dark text-gameboy-lightest font-pixel safe-area">
            
            {/* Fixed Mobile Header */}
            <header className="mobile-header">
              <div className="mobile-header-content">
                <h1 className="mobile-header-title">RetroQuest</h1>
                <div className="mobile-header-actions">
                  <AudioControls />
                  {user && (
                    <>
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
                      <button
                        onClick={() => {
                          soundEffects.playMenuCancel();
                          logout();
                        }}
                        className="nes-btn is-error touch-button w-12 h-12"
                        title="Logout"
                      >
                        <span className="text-gameboy-lightest text-lg">🔌</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </header>

            {/* Main Content with Header Padding */}
            <main className="mobile-main-content">
              <AppRoutes />
            </main>
            
            {/* Mobile Menu Overlay */}
            {showMobileMenu && user && (
              <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
                <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
                  <div className="mobile-menu-item nes-btn is-primary"
                    onClick={() => {
                      setShowPokemonCatching(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    <div className="mobile-menu-icon">
                      <div className="pokeball-icon"></div>
                    </div>
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
                    <div className="mobile-menu-icon">
                      <div className="collection-box-icon"></div>
                    </div>
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
  );
};



const App: React.FC = () => {
  return (
    <AuthProvider>
      <AchievementProvider>
        <AppContent />
      </AchievementProvider>
    </AuthProvider>
  );
};

export default App;