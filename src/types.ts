export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'document' | 'other';
  mimeType: string;
  data: string; // Base64 data URL
  size?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface VideoScene {
  id: string;
  sceneNumber: number;
  duration: number; // in seconds
  narration: string;
  subtitles: string;
  visualPrompt: string;
  imageUrl: string;
  avatarPreset?: string;
  characterId?: string; // Cartoon character preset ID
  characterAction?: 'talk_wave' | 'talk_point' | 'talk_bounce' | 'talk_think' | 'talk_cheer' | 'talk_fly' | 'idle_nod';
  characterEmotion?: 'happy' | 'excited' | 'surprised' | 'curious' | 'heroic' | 'funny';
  characterPosition?: 'center' | 'left' | 'right' | 'pip_corner';
  backgroundTheme?: string;
  speechBubbleText?: string;
  audioUrl?: string; // High-definition AI TTS audio URL/data
  audioDuration?: number; // Spoken audio duration in seconds
  transition: 'fade' | 'zoom_in' | 'zoom_out' | 'slide_left' | 'slide_right' | 'pan_up';
}

export interface VideoProject {
  id: string;
  title: string;
  prompt: string;
  language: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  videoType: 'short' | 'long';
  videoCategory?: 'realistic_human' | 'cartoon_animation' | 'anime_chibi' | 'kids_story';
  humanStyle: 'female_presenter' | 'male_presenter' | 'cinematic_real' | 'podcast_host' | 'documentary' | 'influencer' | 'female_pro' | 'male_pro' | 'podcast_mic' | 'tech_influencer' | 'cinematic_actor' | 'documentary_host' | string;
  cartoonCharacterId?: string;
  cartoonAction?: 'talk_wave' | 'talk_point' | 'talk_bounce' | 'talk_think' | 'talk_cheer' | 'talk_fly' | 'idle_nod';
  cartoonBackgroundTheme?: string;
  showSpeechBubble?: boolean;
  voiceId?: string;
  voiceGender: 'female' | 'male' | 'robot' | 'animal';
  voiceEmotion?: 'natural' | 'energetic' | 'deep_cinematic' | 'news_anchor' | 'friendly';
  voicePitch: number;
  voiceRate: number;
  ttsEngine?: 'ai_studio' | 'browser_neural';
  bgMusic: 'cinematic' | 'ambient_lofi' | 'energetic_beat' | 'inspiring_piano' | 'dramatic_synth' | 'cartoon_fun' | 'kids_playful' | 'none';
  bgMusicVolume: number;
  captionStyle: 'karaoke' | 'bold_yellow' | 'gradient_box' | 'modern_white' | 'cartoon_comic';
  scenes: VideoScene[];
  createdAt: number;
  updatedAt: number;
}
