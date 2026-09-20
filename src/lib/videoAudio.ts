/**
 * Web Audio Ambient Synthesizer, High-Definition AI Speech Engine, & Audio Mixer for Danwar AI Video Studio
 */

export class VideoAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: any = null;
  private currentStyle: string = 'cinematic';
  private masterGain: GainNode | null = null;
  private speechGain: GainNode | null = null;
  public destinationNode: MediaStreamAudioDestinationNode | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;

  init(withMediaStreamDestination = false) {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.speechGain = this.ctx.createGain();
        this.speechGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
        this.speechGain.connect(this.ctx.destination);

        if (withMediaStreamDestination) {
          this.destinationNode = this.ctx.createMediaStreamDestination();
          this.masterGain.connect(this.destinationNode);
          this.speechGain.connect(this.destinationNode);
        }
      }
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  setSpeechVolume(volume: number) {
    if (this.speechGain && this.ctx) {
      this.speechGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  playMusic(style: string, volume: number = 0.25) {
    this.stopMusic();
    this.init(true);
    if (!this.ctx || style === 'none') return;

    this.isPlaying = true;
    this.currentStyle = style;
    this.setVolume(volume);

    // Chords and melody patterns
    const chordsMap: Record<string, number[][]> = {
      cinematic: [
        [220, 261.63, 329.63, 392],    // Am7
        [174.61, 220, 261.63, 329.63], // Fmaj7
        [261.63, 329.63, 392, 523.25], // C
        [196, 246.94, 293.66, 392]     // G
      ],
      ambient_lofi: [
        [130.81, 164.81, 196, 246.94], // Cmaj7
        [110, 130.81, 164.81, 196],    // Am7
        [146.83, 174.61, 220, 261.63], // Dm7
        [98, 123.47, 146.83, 174.61]   // G7
      ],
      energetic_beat: [
        [146.83, 174.61, 220],          // Dm
        [130.81, 164.81, 196],          // C
        [110, 130.81, 164.81],          // Am
        [164.81, 196, 246.94]           // Em
      ],
      inspiring_piano: [
        [261.63, 329.63, 392, 493.88], // Cmaj7
        [196, 246.94, 293.66, 392],    // G
        [220, 261.63, 329.63, 440],    // Am
        [174.61, 220, 261.63, 349.23]  // F
      ],
      dramatic_synth: [
        [110, 164.81, 220, 277.18],    // A
        [98, 146.83, 196, 246.94],     // G
        [87.31, 130.81, 174.61, 220],  // F
        [123.47, 164.81, 196, 246.94]  // E
      ],
      cartoon_fun: [
        [261.63, 329.63, 392, 523.25], // C Major bouncy
        [349.23, 440, 523.25, 698.46], // F Major
        [293.66, 369.99, 440, 587.33], // D Minor
        [196, 246.94, 293.66, 392]     // G7 playful
      ],
      kids_playful: [
        [329.63, 392, 493.88, 659.25], // E Minor sweet
        [261.63, 329.63, 392, 523.25], // C Major
        [220, 261.63, 329.63, 440],    // A Minor
        [196, 246.94, 293.66, 392]     // G Major
      ]
    };

    const chords = chordsMap[style] || chordsMap.cinematic;
    let chordIdx = 0;

    const playChordStep = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      const now = this.ctx.currentTime;
      currentChord.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = style === 'dramatic_synth' ? 'sawtooth' : style === 'energetic_beat' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Gentle envelope
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.08 / (i + 1), now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 4.0);
      });
    };

    playChordStep();
    this.intervalId = setInterval(playChordStep, 3500);
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Play generated high-definition AI audio clip
   */
  playAudioClip(audioUrl: string, onEnd?: () => void) {
    this.stopAudioClip();
    try {
      this.init(true);
      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;

      audio.onended = () => {
        onEnd?.();
      };
      audio.onerror = (e) => {
        console.warn("Audio clip playback error, falling back to speech synthesis:", e);
        onEnd?.();
      };

      audio.play().catch(e => {
        console.warn("Audio play rejected:", e);
        onEnd?.();
      });
    } catch (e) {
      console.warn("Failed to play audio clip:", e);
      onEnd?.();
    }
  }

  stopAudioClip() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
  }

  /**
   * Synthesize real-time Cartoon Sound Effects (Pop, Whoosh, Sparkle, Boing, Cheer)
   */
  playCartoonSoundEffect(effect: 'pop' | 'whoosh' | 'sparkle' | 'boing' | 'magic') {
    try {
      this.init(true);
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      if (effect === 'pop') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (effect === 'boing') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.15);
        osc.frequency.linearRampToValueAtTime(250, now + 0.35);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (effect === 'sparkle' || effect === 'magic') {
        const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        freqs.forEach((f, idx) => {
          if (!this.ctx || !this.masterGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + idx * 0.05;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + 0.3);
        });
      } else if (effect === 'whoosh') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      console.warn("Sound effect synthesis notice:", e);
    }
  }
}

export const globalVideoAudio = new VideoAudioEngine();

/**
 * Fetch high-definition AI Voiceover from server
 */
export async function fetchAiVoiceover(
  text: string,
  language: string,
  gender: 'female' | 'male' | 'robot' | 'animal' | string = 'female',
  voiceId: string = 'kore',
  emotion: string = 'natural',
  pitch: number = 1.0,
  rate: number = 1.0
): Promise<{ audioData: string | null; source: string; voice: string }> {
  try {
    const res = await fetch('/api/video/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        language,
        gender,
        voiceId,
        emotion,
        pitch,
        rate
      })
    });

    const data = await res.json();
    return {
      audioData: data.audioData || null,
      source: data.source || 'browser_neural',
      voice: data.voice || voiceId
    };
  } catch (e) {
    console.warn("TTS API fetch error, will use optimized local neural speech:", e);
    return {
      audioData: null,
      source: 'browser_neural',
      voice: voiceId
    };
  }
}

/**
 * Optimize text pronunciation for human realism (Urdu, Hindi, English, Arabic)
 */
function polishPronunciation(text: string, lang: string): string {
  let polished = text
    .replace(/[*#`_~[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Natural pause markers for human breathing cadence
  polished = polished.replace(/([.?!,،۔؛])/g, '$1 ');

  return polished;
}

/**
 * Speech synthesis with tuned human-like voice selection per language
 */
export function speakNarrationText(
  text: string,
  lang: string,
  gender: 'female' | 'male' | 'robot' | 'animal' | string = 'female',
  pitch: number = 1.0,
  rate: number = 1.0,
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return null;
  }

  window.speechSynthesis.cancel();

  const clean = polishPronunciation(text, lang);
  if (!clean) {
    onEnd?.();
    return null;
  }

  const utterance = new SpeechSynthesisUtterance(clean);
  const voices = window.speechSynthesis.getVoices();

  // Match target language prefix
  const langLower = lang.toLowerCase();
  let targetPrefix = 'en';
  let targetLocale = 'en-US';

  if (langLower.includes('urdu') || langLower.includes('اردو')) {
    targetPrefix = 'ur';
    targetLocale = 'ur-PK';
  } else if (langLower.includes('hindi') || langLower.includes('हिंदी')) {
    targetPrefix = 'hi';
    targetLocale = 'hi-IN';
  } else if (langLower.includes('arabic') || langLower.includes('العربية')) {
    targetPrefix = 'ar';
    targetLocale = 'ar-SA';
  } else if (langLower.includes('spanish') || langLower.includes('español')) {
    targetPrefix = 'es';
    targetLocale = 'es-ES';
  } else if (langLower.includes('french') || langLower.includes('français')) {
    targetPrefix = 'fr';
    targetLocale = 'fr-FR';
  } else if (langLower.includes('german') || langLower.includes('deutsch')) {
    targetPrefix = 'de';
    targetLocale = 'de-DE';
  } else if (langLower.includes('turkish') || langLower.includes('türkçe')) {
    targetPrefix = 'tr';
    targetLocale = 'tr-TR';
  } else if (langLower.includes('russian') || langLower.includes('русский')) {
    targetPrefix = 'ru';
    targetLocale = 'ru-RU';
  } else if (langLower.includes('japanese') || langLower.includes('日本語')) {
    targetPrefix = 'ja';
    targetLocale = 'ja-JP';
  } else if (langLower.includes('chinese') || langLower.includes('中文')) {
    targetPrefix = 'zh';
    targetLocale = 'zh-CN';
  }

  utterance.lang = targetLocale;

  const matchedVoices = voices.filter(v => 
    v.lang.toLowerCase().startsWith(targetPrefix) || 
    v.lang.toLowerCase().includes(targetPrefix)
  );

  let chosenVoice = null;

  if (matchedVoices.length > 0) {
    if (gender === 'female') {
      chosenVoice = matchedVoices.find(v => 
        v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('zira') || 
        v.name.toLowerCase().includes('samantha')
      ) || matchedVoices[0];
    } else {
      chosenVoice = matchedVoices.find(v => 
        v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('male') || 
        v.name.toLowerCase().includes('david') || 
        v.name.toLowerCase().includes('guy')
      ) || matchedVoices[0];
    }
  } else if (targetPrefix === 'ur') {
    // If exact Urdu voice is absent on this browser, fall back to Hindi/Indian English voice which speaks Urdu text phonetically with crystal clarity
    const indianVoices = voices.filter(v => v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('in'));
    if (indianVoices.length > 0) {
      chosenVoice = indianVoices[0];
    }
  }

  if (!chosenVoice) {
    // English crystal clear natural fallback
    chosenVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Enhanced'))) || voices[0];
  }

  if (chosenVoice) {
    utterance.voice = chosenVoice;
  }

  // Optimize pitch and rate for crystal clarity and natural human resonance
  utterance.pitch = Math.max(0.8, Math.min(1.2, pitch));
  utterance.rate = Math.max(0.85, Math.min(1.15, rate));

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = () => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

