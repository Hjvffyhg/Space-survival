export class SoundManager {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3; // Default volume
      this.masterGain.connect(this.ctx.destination);
    }
    // Required by browsers: resume if suspended
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playShoot(isHeavy: boolean = false) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = isHeavy ? 'sawtooth' : 'square';
    
    // Random pitch variation to prevent audio fatigue
    const pitchShift = 1.0 + (Math.random() * 0.2 - 0.1); 
    const baseFreq = isHeavy ? 150 : 300;
    osc.frequency.setValueAtTime(baseFreq * pitchShift, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime((isHeavy ? 50 : 100) * pitchShift, this.ctx.currentTime + (isHeavy ? 0.3 : 0.1));
    
    gain.gain.setValueAtTime(isHeavy ? 0.6 : 0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (isHeavy ? 0.3 : 0.1));
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + (isHeavy ? 0.3 : 0.1));
  }

  playTakeDamage() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playExplosion() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playEnemySpawn() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playEnemyAttack() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playBossWarning() {
    if (!this.ctx || !this.masterGain) return;
    
    const freqs = [350, 450]; 
    const timeOffset = 0.35;
    
    for (let i = 0; i < 10; i++) {
       const osc = this.ctx.createOscillator();
       const gain = this.ctx.createGain();
       
       osc.type = 'sawtooth';
       
       const freq = i % 2 === 0 ? freqs[0] : freqs[1];
       osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * timeOffset);
       
       gain.gain.setValueAtTime(0, this.ctx.currentTime + i * timeOffset);
       gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + i * timeOffset + 0.05);
       gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + i * timeOffset + timeOffset);
       
       osc.connect(gain);
       gain.connect(this.masterGain);
       
       osc.start(this.ctx.currentTime + i * timeOffset);
       osc.stop(this.ctx.currentTime + (i + 1) * timeOffset);
    }
  }

  playGameOver() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 1.5);
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 1.5);
  }

  playWaveCompletion() {
    if (!this.ctx || !this.masterGain) return;
    
    const freqs = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    const timeOffset = 0.1;
    
    freqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, this.ctx!.currentTime + i * timeOffset);
      gain.gain.linearRampToValueAtTime(0.3, this.ctx!.currentTime + i * timeOffset + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + i * timeOffset + 0.3);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(this.ctx!.currentTime + i * timeOffset);
      osc.stop(this.ctx!.currentTime + i * timeOffset + 0.3);
    });
  }

  playCollect(type?: string) {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      let freq1 = 800;
      let freq2 = 1200;

      if (type === 'health') { freq1 = 400; freq2 = 800; }
      else if (type === 'shield') { freq1 = 600; freq2 = 1000; }
      else if (type === 'speed') { freq1 = 1200; freq2 = 1600; }
      else if (type === 'weapon') { freq1 = 300; freq2 = 900; osc.type = 'square'; }
      
      osc.type = osc.type === 'square' ? 'square' : 'sine';
      osc.frequency.setValueAtTime(freq1, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(freq2, this.ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
  }
  playUISelect() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playPowerup() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }
}

export const soundManager = new SoundManager();
