// Retro Pokemon-style sound effects utility
class SoundEffects {
  private audioContext: AudioContext | null = null;
  private volume: number = 0.5;
  private isMuted: boolean = false;
  private enabled: boolean = true;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    } catch {
      console.warn('Web Audio API not supported');
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'square') {
    if (!this.audioContext || this.isMuted || !this.enabled) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;

      // Apply volume
      gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Failed to play sound effect:', error);
    }
  }

  // Navigation sounds
  playMenuSelect() {
    this.playTone(800, 0.1);
  }

  playMenuConfirm() {
    this.playTone(1000, 0.15);
  }

  playMenuCancel() {
    this.playTone(400, 0.2);
  }

  playNavigate() {
    this.playTone(600, 0.08);
  }

  playItemPickup() {
    this.playTone(900, 0.12);
  }

  // Pokemon-specific sounds
  playPokemonSelect() {
    this.playTone(700, 0.1);
    setTimeout(() => this.playTone(900, 0.1), 80);
  }

  playPokemonCatch() {
    // Classic Pokemon catch sound
    this.playTone(600, 0.15);
    setTimeout(() => this.playTone(800, 0.15), 100);
    setTimeout(() => this.playTone(1000, 0.2), 200);
    setTimeout(() => this.playTone(1200, 0.25), 350);
  }

  playPokemonSuccess() {
    // Successful catch celebration
    this.playTone(523, 0.2);
    setTimeout(() => this.playTone(659, 0.2), 200);
    setTimeout(() => this.playTone(784, 0.2), 400);
    setTimeout(() => this.playTone(1047, 0.3), 600);
    setTimeout(() => this.playTone(1319, 0.4), 800);
  }

  playVictory() {
    // Victory fanfare
    this.playTone(523, 0.2);
    setTimeout(() => this.playTone(659, 0.2), 200);
    setTimeout(() => this.playTone(784, 0.2), 400);
    setTimeout(() => this.playTone(1047, 0.3), 600);
  }

  // Game progression sounds
  playTaskComplete() {
    this.playTone(800, 0.15);
    setTimeout(() => this.playTone(1000, 0.2), 150);
  }

  playBadgeUnlock() {
    this.playTone(1200, 0.15);
    setTimeout(() => this.playTone(1400, 0.15), 150);
    setTimeout(() => this.playTone(1600, 0.2), 300);
  }

  playLevelUp() {
    // Level up sound
    this.playTone(523, 0.2);
    setTimeout(() => this.playTone(659, 0.2), 200);
    setTimeout(() => this.playTone(784, 0.2), 400);
    setTimeout(() => this.playTone(1047, 0.2), 600);
    setTimeout(() => this.playTone(1319, 0.3), 800);
  }

  playStreakMilestone() {
    this.playTone(1000, 0.12);
    setTimeout(() => this.playTone(1200, 0.12), 120);
    setTimeout(() => this.playTone(1000, 0.12), 240);
    setTimeout(() => this.playTone(1200, 0.2), 360);
  }

  playSave() {
    this.playTone(700, 0.15);
    setTimeout(() => this.playTone(900, 0.15), 150);
  }

  playError() {
    // Error sound
    this.playTone(200, 0.3);
    setTimeout(() => this.playTone(150, 0.3), 300);
  }

  playAchievement() {
    // Achievement sound
    this.playTone(800, 0.1);
    setTimeout(() => this.playTone(1000, 0.1), 100);
    setTimeout(() => this.playTone(1200, 0.1), 200);
    setTimeout(() => this.playTone(1400, 0.2), 300);
  }

  // Volume control methods
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    console.log(`🔊 Sound effects volume: ${Math.round(this.volume * 100)}%`);
  }

  getVolume(): number {
    return this.volume;
  }

  mute() {
    this.isMuted = true;
    console.log('🔇 Sound effects muted');
  }

  unmute() {
    this.isMuted = false;
    console.log('🔊 Sound effects unmuted');
  }

  isMutedState(): boolean {
    return this.isMuted;
  }

  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  // Sound state management
  toggleSound(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isSoundEnabled(): boolean {
    return this.enabled;
  }
}

const soundEffects = new SoundEffects();
export default soundEffects;
