export interface SpeechState {
  isPlaying: boolean;
  isPaused: boolean;
  hasSpeechSynthesis: boolean;
}

class StoryNarrator {
  private utterance: SpeechSynthesisUtterance | null = null;
  private onStateChangeCallback: ((state: SpeechState) => void) | null = null;
  private isPaused: boolean = false;
  private isPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
      };
    }
  }

  public subscribe(callback: (state: SpeechState) => void) {
    this.onStateChangeCallback = callback;
    this.notify();
  }

  private notify() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({
        isPlaying: this.isPlaying,
        isPaused: this.isPaused,
        hasSpeechSynthesis: typeof window !== 'undefined' && 'speechSynthesis' in window,
      });
    }
  }

  public speak(text: string, language: string = 'en') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    this.stop();

    const cleanText = text
      .replace(/[*#_~]/g, '')
      .replace(/\n\s*\n/g, '. ')
      .trim();

    this.utterance = new SpeechSynthesisUtterance(cleanText);
    this.utterance.rate = 0.95; // Pleasant storytelling pace
    this.utterance.pitch = 1.0;

    // Try finding appropriate voice
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = language.slice(0, 2).toLowerCase();
    const matchedVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix) && v.name.includes('Natural')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (matchedVoice) {
      this.utterance.voice = matchedVoice;
    }

    this.utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.notify();
    };

    this.utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.notify();
    };

    this.utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.isPlaying = false;
      this.isPaused = false;
      this.notify();
    };

    window.speechSynthesis.speak(this.utterance);
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isPlaying) {
      window.speechSynthesis.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isPaused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isPlaying = false;
      this.isPaused = false;
      this.notify();
    }
  }
}

export const narrator = new StoryNarrator();
