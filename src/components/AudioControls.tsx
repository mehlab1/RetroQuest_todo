import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Volume1 } from 'lucide-react';
import backgroundMusic from '../utils/backgroundMusic';
import soundEffects from '../utils/soundEffects';

const AudioControls: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isSfxMuted, setIsSfxMuted] = useState(false);

  useEffect(() => {
    // Initialize volumes from storage or defaults
    const savedMusicVolume = localStorage.getItem('musicVolume');
    const savedSfxVolume = localStorage.getItem('sfxVolume');
    
    if (savedMusicVolume) {
      const volume = parseFloat(savedMusicVolume);
      setMusicVolume(volume);
      backgroundMusic.setVolume(volume);
    }
    
    if (savedSfxVolume) {
      const volume = parseFloat(savedSfxVolume);
      setSfxVolume(volume);
      soundEffects.setVolume(volume);
    }

    // Start music automatically
    backgroundMusic.play();
    setIsMusicPlaying(true);
  }, []);

  const handleMusicToggle = () => {
    if (isMusicPlaying) {
      backgroundMusic.pause();
      setIsMusicPlaying(false);
    } else {
      backgroundMusic.play();
      setIsMusicPlaying(true);
    }
  };

  const handleMusicMute = () => {
    if (isMusicMuted) {
      backgroundMusic.unmute();
      setIsMusicMuted(false);
    } else {
      backgroundMusic.mute();
      setIsMusicMuted(true);
    }
  };

  const handleSfxMute = () => {
    if (isSfxMuted) {
      soundEffects.unmute();
      setIsSfxMuted(false);
    } else {
      soundEffects.mute();
      setIsSfxMuted(true);
    }
  };

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setMusicVolume(volume);
    backgroundMusic.setVolume(volume);
    localStorage.setItem('musicVolume', volume.toString());
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setSfxVolume(volume);
    soundEffects.setVolume(volume);
    localStorage.setItem('sfxVolume', volume.toString());
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    soundEffects.playMenuSelect();
  };

  return (
    <div className="audio-controls">
      {/* Main Audio Button */}
      <button
        onClick={toggleMenu}
        className="audio-control touch-button"
        title="Audio Settings"
      >
        {isMusicPlaying ? <Music size={16} /> : <Volume1 size={16} />}
      </button>

      {/* Audio Menu */}
      {isMenuOpen && (
        <div className="audio-menu nes-container with-title is-rounded">
          <p className="title">Audio Settings</p>
          <div className="audio-menu-content">
            
            {/* Music Controls */}
            <div className="audio-section">
              <div className="audio-header">
                <span className="audio-label">Music</span>
                <div className="audio-buttons">
                  <button
                    onClick={handleMusicToggle}
                    className="nes-btn is-small"
                    title={isMusicPlaying ? "Pause Music" : "Play Music"}
                  >
                    {isMusicPlaying ? <Volume1 size={12} /> : <Music size={12} />}
                  </button>
                  <button
                    onClick={handleMusicMute}
                    className="nes-btn is-small"
                    title={isMusicMuted ? "Unmute Music" : "Mute Music"}
                  >
                    {isMusicMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={musicVolume}
                onChange={handleMusicVolumeChange}
                className="volume-slider"
                disabled={isMusicMuted}
              />
              <span className="volume-text">{Math.round(musicVolume * 100)}%</span>
            </div>

            {/* Sound Effects Controls */}
            <div className="audio-section">
              <div className="audio-header">
                <span className="audio-label">Sound Effects</span>
                <button
                  onClick={handleSfxMute}
                  className="nes-btn is-small"
                  title={isSfxMuted ? "Unmute SFX" : "Mute SFX"}
                >
                  {isSfxMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={sfxVolume}
                onChange={handleSfxVolumeChange}
                className="volume-slider"
                disabled={isSfxMuted}
              />
              <span className="volume-text">{Math.round(sfxVolume * 100)}%</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AudioControls;
