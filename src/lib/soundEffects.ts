// Sound effects utility using Web Audio API
class SoundEffects {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  // Play a bell/chime sound for countdown
  playCountdown(number: number) {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Higher pitch for higher numbers, creating a descending scale
    const frequencies = [880, 784, 698, 622, 523]; // A5, G5, F5, Eb5, C5
    oscillator.frequency.value = frequencies[5 - number] || 523;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }

  // Play a festive jingle for the reveal
  playReveal() {
    const ctx = this.getContext();
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6 - triumphant chord
    
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + i * 0.1;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);

      oscillator.start(startTime);
      oscillator.stop(startTime + 1.5);
    });
  }

  // Celebratory fanfare for results
  playCelebration() {
    const ctx = this.getContext();
    
    // Play a festive arpeggio
    const melody = [
      { freq: 523, time: 0 },      // C5
      { freq: 659, time: 0.1 },    // E5
      { freq: 784, time: 0.2 },    // G5
      { freq: 1047, time: 0.3 },   // C6
      { freq: 784, time: 0.45 },   // G5
      { freq: 1047, time: 0.55 },  // C6
      { freq: 1319, time: 0.7 },   // E6
    ];

    melody.forEach(({ freq, time }) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'triangle';

      const startTime = ctx.currentTime + time;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.5);
    });

    // Add some sparkle/shimmer effect
    setTimeout(() => this.playSparkle(), 800);
  }

  // Sparkle sound effect
  playSparkle() {
    const ctx = this.getContext();
    
    for (let i = 0; i < 5; i++) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 2000 + Math.random() * 2000;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + i * 0.08;
      gainNode.gain.setValueAtTime(0.05, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.15);
    }
  }

  // Click/pop sound for button interactions
  playClick() {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 600;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }

  // Add name sound
  playAdd() {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.1);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  // Remove name sound
  playRemove() {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.15);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  // Shuffle/dice rolling sound
  playShuffle() {
    const ctx = this.getContext();
    
    // Create a shuffling/whoosh sound
    for (let i = 0; i < 8; i++) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 200 + Math.random() * 400;
      oscillator.type = 'sawtooth';

      const startTime = ctx.currentTime + i * 0.05;
      gainNode.gain.setValueAtTime(0.03, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.1);
    }
  }

  // Jingle bells ambient sound
  playJingleBells() {
    const ctx = this.getContext();
    
    const bellFreqs = [2000, 2500, 3000, 2200, 2800];
    
    bellFreqs.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + i * 0.12;
      gainNode.gain.setValueAtTime(0.03, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.35);
    });
  }

  // Gift unwrap sound
  playUnwrap() {
    const ctx = this.getContext();
    
    // Rustling paper effect
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.15;
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    noise.start();
  }
}

export const soundEffects = new SoundEffects();
