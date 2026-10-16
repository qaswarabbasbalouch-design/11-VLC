import { AudioEqualizerPreset } from '../types/player.ts';

export const EQUALIZER_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export const EQUALIZER_PRESETS: AudioEqualizerPreset[] = [
  { name: 'Flat', bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Bass Boost', bands: [7, 6, 4, 2, 0, 0, 0, 0, 0, 0] },
  { name: 'Rock', bands: [4, 3, -1, -2, 0, 2, 4, 5, 5, 4] },
  { name: 'Pop', bands: [-1, 1, 3, 4, 3, 0, -1, -1, 1, 2] },
  { name: 'Jazz', bands: [3, 2, 1, 2, -1, -1, 0, 1, 2, 3] },
  { name: 'Electronic', bands: [5, 4, 1, 0, -2, 2, 1, 3, 4, 5] },
  { name: 'Vocal', bands: [-2, -2, 0, 3, 5, 5, 3, 1, -1, -2] },
  { name: 'Classical', bands: [4, 3, 2, 2, -1, -1, 0, 2, 3, 3] },
  { name: 'Treble Boost', bands: [0, 0, 0, 0, 0, 1, 3, 5, 7, 8] }
];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private filterNodes: BiquadFilterNode[] = [];
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private currentElement: HTMLMediaElement | null = null;
  private isInitialized = false;

  public init(mediaElement: HTMLMediaElement) {
    if (this.currentElement === mediaElement && this.isInitialized) {
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.ctx) {
        this.ctx = new AudioCtxClass();
      }

      if (this.ctx.state === 'suspended') {
        const resume = () => {
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
          }
          window.removeEventListener('click', resume);
          window.removeEventListener('keydown', resume);
        };
        window.addEventListener('click', resume);
        window.addEventListener('keydown', resume);
      }

      // Disconnect prior source if applicable
      if (this.sourceNode) {
        try {
          this.sourceNode.disconnect();
        } catch (e) {}
      }

      this.currentElement = mediaElement;

      // Note: createMediaElementSource can only be called once per media element
      try {
        this.sourceNode = this.ctx.createMediaElementSource(mediaElement);
      } catch (err) {
        // Element already has a source attached
      }

      if (!this.sourceNode) return;

      // Create 10 Equalizer Filters
      this.filterNodes = EQUALIZER_FREQUENCIES.map((freq, index) => {
        const filter = this.ctx!.createBiquadFilter();
        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === EQUALIZER_FREQUENCIES.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
      });

      // Create Gain Node (for volume boost up to 200%)
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = 1.0;

      // Create Analyser Node (for dynamic audio visualizer)
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 128;
      this.analyserNode.smoothingTimeConstant = 0.8;

      // Connect graph: Source -> Filter 0 -> Filter 1 ... -> Filter 9 -> Gain -> Analyser -> Destination
      let currentNode: AudioNode = this.sourceNode;
      for (const filter of this.filterNodes) {
        currentNode.connect(filter);
        currentNode = filter;
      }
      currentNode.connect(this.gainNode);
      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.ctx.destination);

      this.isInitialized = true;
    } catch (err) {
      console.warn('Web Audio API initialization notice:', err);
    }
  }

  public setEqualizerBand(index: number, gainDb: number) {
    if (this.filterNodes[index]) {
      this.filterNodes[index].gain.value = Math.max(-12, Math.min(12, gainDb));
    }
  }

  public applyPreset(bands: number[]) {
    bands.forEach((gainDb, index) => {
      this.setEqualizerBand(index, gainDb);
    });
  }

  public setBoostGain(gainFactor: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(gainFactor, this.ctx.currentTime, 0.05);
    }
  }

  public getFrequencyData(array: any) {
    if (this.analyserNode) {
      this.analyserNode.getByteFrequencyData(array);
    }
  }

  public resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }
}

export const audioEngine = new AudioEngine();
