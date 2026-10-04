/**
 * Procedural Romantic Web Audio API Sound Engine
 * Zero external audio files required — reliable, instantaneous, works offline & on mobile!
 */

class RomanticSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playChimeNote(523.25, 0.15); // C5 soft feedback
    }
    return this.isMuted;
  }

  // Soft single chime note
  public playChimeNote(freq = 587.33, duration = 0.4) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio safety
    }
  }

  // Playful bubble/pop when hovering or attempting to click the evasive "No" button
  public playDodgingPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = this.ctx.currentTime;
      osc.type = 'sine';
      // cute upward frequency glide
      osc.frequency.setValueAtTime(260 + Math.random() * 80, startTime);
      osc.frequency.exponentialRampToValueAtTime(650 + Math.random() * 100, startTime + 0.12);

      gain.gain.setValueAtTime(0.01, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.14);
    } catch {
      // Audio safety
    }
  }

  // Soft paper rustle / letter opening whoosh
  public playEnvelopeOpen() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      // Pinkish/soft filtered noise
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.2;
        output[i] = (b0 + b1 + b2) * 0.3;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2400, this.ctx.currentTime + 0.15);
      filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();

      // Pair with a sweet low bell
      this.playChimeNote(659.25, 0.8); // E5
    } catch {
      // Audio safety
    }
  }

  // Romantic deep heartbeat double thump
  public playHeartbeat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const beatFrequencies = [85, 70];
      const offsets = [0, 0.18];

      offsets.forEach((offset, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(beatFrequencies[idx], now + offset);
        osc.frequency.exponentialRampToValueAtTime(45, now + offset + 0.15);

        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.35, now + offset + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
      });
    } catch {
      // Audio safety
    }
  }

  // Heavenly melodic chime chord (for page transitions and selections)
  public playCelestialChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      // E major 9th pentatonic chord arpeggio
      const notes = [329.63, 493.88, 659.25, 830.61, 987.77, 1318.51];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        const startTime = now + idx * 0.07;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.12 - idx * 0.015, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.25);
      });
    } catch {
      // Audio safety
    }
  }

  // Grand YES! celebration cascade with sweeping warm orchestral chords and golden bell glissando
  public playYesCelebration() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Majestic ascending harp glissando
      const notes = [
        392.00, // G4
        493.88, // B4
        587.33, // D5
        659.25, // E5
        783.99, // G5
        987.77, // B5
        1174.66, // D6
        1318.51, // E6
        1567.98  // G6
      ];

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        const startTime = now + idx * 0.065;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.85);
      });

      // Warm background chord pad (G major add9)
      const padNotes = [196.00, 246.94, 293.66, 392.00, 440.00];
      padNotes.forEach((freq) => {
        const padOsc = this.ctx!.createOscillator();
        const padGain = this.ctx!.createGain();

        padOsc.type = 'sine';
        padOsc.frequency.setValueAtTime(freq, now + 0.4);

        const padStart = now + 0.4;
        padGain.gain.setValueAtTime(0.001, padStart);
        padGain.gain.linearRampToValueAtTime(0.08, padStart + 0.4);
        padGain.gain.exponentialRampToValueAtTime(0.0001, padStart + 3.2);

        padOsc.connect(padGain);
        padGain.connect(this.ctx!.destination);

        padOsc.start(padStart);
        padOsc.stop(padStart + 3.3);
      });
    } catch {
      // Audio safety
    }
  }

  // Soft romantic selection click
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio safety
    }
  }
}

export const soundEngine = new RomanticSoundEngine();
