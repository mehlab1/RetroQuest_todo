class BackgroundMusic {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.05; // Much lower volume for theme music
  private isMuted: boolean = false;
  private enabled: boolean = true;

  constructor() {
    this.initAudio();
  }

  private initAudio() {
    try {
      // Use the Pallet Town theme music
      this.audio = new Audio('/audio/pallet-town-theme.mp3');
      this.audio.loop = true;
      this.audio.volume = this.volume;
      this.audio.preload = 'auto';
      
      // Handle audio loading
      this.audio.addEventListener('canplaythrough', () => {
        console.log('🎵 Pallet Town theme loaded successfully');
      });
      
      this.audio.addEventListener('error', (error) => {
        console.error('Failed to load Pallet Town theme:', error);
      });
      
    } catch (error) {
      console.error('Failed to initialize background music:', error);
    }
  }

  play() {
    if (this.isPlaying || this.isMuted || !this.enabled) return;

    if (this.audio) {
      try {
        this.audio.volume = this.isMuted ? 0 : this.volume;
        this.audio.play().then(() => {
          this.isPlaying = true;
          console.log('🎵 Pallet Town theme started playing');
        }).catch((error) => {
          // Handle autoplay policy - user needs to interact first
          if (error.name === 'NotAllowedError') {
            console.log('🎵 Audio autoplay blocked - waiting for user interaction');
            // Set up a one-time click listener to start music
            const startMusicOnInteraction = () => {
              this.audio?.play().then(() => {
                this.isPlaying = true;
                console.log('🎵 Pallet Town theme started after user interaction');
              }).catch((e) => {
                console.warn('Failed to play after interaction:', e);
              });
              // Remove the listener after first interaction
              document.removeEventListener('click', startMusicOnInteraction);
              document.removeEventListener('touchstart', startMusicOnInteraction);
            };
            document.addEventListener('click', startMusicOnInteraction, { once: true });
            document.addEventListener('touchstart', startMusicOnInteraction, { once: true });
          } else {
            console.warn('Failed to play Pallet Town theme:', error);
          }
        });
      } catch (error) {
        console.warn('Failed to start background music:', error);
      }
    } else {
      // Reinitialize if needed
      this.initAudio();
      setTimeout(() => this.play(), 100);
    }
  }

  pause() {
    if (this.audio) {
      try {
        this.audio.pause();
      } catch (error) {
        console.warn('Failed to pause background music:', error);
      }
    }
    
    this.isPlaying = false;
    console.log('🔇 Pallet Town theme paused');
  }

  stop() {
    this.pause();
    console.log('⏹️ Background music stopped');
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    
    console.log(`🔊 Background music volume: ${Math.round(this.volume * 100)}%`);
  }

  getVolume(): number {
    return this.volume;
  }

  mute() {
    this.isMuted = true;
    if (this.audio) {
      this.audio.volume = 0;
    }
    console.log('🔇 Background music muted');
  }

  unmute() {
    this.isMuted = false;
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    console.log('🔊 Background music unmuted');
  }

  isMutedState(): boolean {
    return this.isMuted;
  }

  isPlayingState(): boolean {
    return this.isPlaying;
  }

  toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  isMusicEnabled(): boolean {
    return this.enabled;
  }
}

// Create a singleton instance
const backgroundMusic = new BackgroundMusic();

export default backgroundMusic;

