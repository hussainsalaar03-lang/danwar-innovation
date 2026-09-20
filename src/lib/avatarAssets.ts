export interface HumanAvatarPreset {
  id: string;
  name: string;
  gender: 'female' | 'male';
  role: string;
  description: string;
  image: string;
  badgeColor: string;
}

export const HUMAN_AVATAR_PRESETS: HumanAvatarPreset[] = [
  {
    id: 'female_pro',
    name: 'Zara (Realistic Pro Host)',
    gender: 'female',
    role: 'TV / News & Tech Presenter',
    description: 'High-definition realistic female anchor with professional studio presence.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'from-pink-500 to-rose-500'
  },
  {
    id: 'male_pro',
    name: 'Ali (Cinematic Executive)',
    gender: 'male',
    role: 'Business & Tech Host',
    description: 'Charismatic male presenter with confident vocal pacing and studio lighting.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'podcast_mic',
    name: 'Sarah (Podcast Studio Host)',
    gender: 'female',
    role: 'Storyteller & Interviewer',
    description: 'Casual studio setup with broadcast microphone and warm acoustic lighting.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'from-purple-500 to-violet-500'
  },
  {
    id: 'tech_influencer',
    name: 'Hamza (Social Media Creator)',
    gender: 'male',
    role: 'Reels & TikTok Specialist',
    description: 'Energetic real human creator in modern aesthetic room with RGB backlights.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'cinematic_actor',
    name: 'Elena (Cinematic Real Drama)',
    gender: 'female',
    role: 'Narrative & Documentary Actor',
    description: 'Deep emotive expressions with 8k film color grading and bokeh depth.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'from-amber-500 to-orange-500'
  },
  {
    id: 'documentary_host',
    name: 'David (Documentary Realist)',
    gender: 'male',
    role: 'History & Science Narrator',
    description: 'Calm authoritative voice and immersive natural scenery background.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'from-cyan-500 to-blue-500'
  }
];

export const SUPPORTED_LANGUAGES = [
  { code: 'ur', name: 'Urdu (اردو)', voiceLang: 'ur-PK', flag: '🇵🇰', sample: 'سلام! Danwar AI ویڈیو اسٹوڈیو میں خوش آمدید۔' },
  { code: 'en', name: 'English (US/UK)', voiceLang: 'en-US', flag: '🇺🇸', sample: 'Welcome to Danwar AI Ultra Realistic Video Creator!' },
  { code: 'hi', name: 'Hindi (हिंदी)', voiceLang: 'hi-IN', flag: '🇮🇳', sample: 'नमस्ते! Danwar AI वीडियो क्रिएटर में आपका स्वागत है।' },
  { code: 'ar', name: 'Arabic (العربية)', voiceLang: 'ar-SA', flag: '🇸🇦', sample: 'مرحباً بكم في استوديو دانوار للذكاء الاصطناعي!' },
  { code: 'es', name: 'Spanish (Español)', voiceLang: 'es-ES', flag: '🇪🇸', sample: '¡Bienvenido al creador de videos Danwar AI!' },
  { code: 'fr', name: 'French (Français)', voiceLang: 'fr-FR', flag: '🇫🇷', sample: 'Bienvenue sur le créateur de vidéo Danwar AI !' },
  { code: 'de', name: 'German (Deutsch)', voiceLang: 'de-DE', flag: '🇩🇪', sample: 'Willkommen beim Danwar AI Video Creator!' },
  { code: 'tr', name: 'Turkish (Türkçe)', voiceLang: 'tr-TR', flag: '🇹🇷', sample: 'Danwar AI Video Stüdyosuna hoş geldiniz!' },
  { code: 'pt', name: 'Portuguese (Português)', voiceLang: 'pt-BR', flag: '🇧🇷', sample: 'Bem-vindo ao criador de vídeos Danwar AI!' },
  { code: 'ru', name: 'Russian (Русский)', voiceLang: 'ru-RU', flag: '🇷🇺', sample: 'Добро пожаловать в Danwar AI видео студию!' },
  { code: 'ja', name: 'Japanese (日本語)', voiceLang: 'ja-JP', flag: '🇯🇵', sample: 'Danwar AI ビデオクリエーターへようこそ！' },
  { code: 'zh', name: 'Chinese (中文)', voiceLang: 'zh-CN', flag: '🇨🇳', sample: '欢迎使用 Danwar AI 视频创作工作室！' }
];

export interface HumanVoiceProfile {
  id: string;
  name: string;
  nativeName: string;
  gender: 'female' | 'male';
  languages: string[];
  geminiVoice: 'kore' | 'puck' | 'charon' | 'fenrir' | 'zephyr' | 'aoede';
  recommendedEmotion: 'natural' | 'energetic' | 'deep_cinematic' | 'news_anchor' | 'friendly';
  description: string;
  badge: string;
}

export const HUMAN_VOICE_PROFILES: HumanVoiceProfile[] = [
  {
    id: 'voice_ur_ayesha',
    name: 'Ayesha (Studio Clear Urdu)',
    nativeName: 'عائشہ (نیچرل اردو وائس)',
    gender: 'female',
    languages: ['Urdu (اردو)', 'Hindi (हिंदी)', 'English (US/UK)'],
    geminiVoice: 'kore',
    recommendedEmotion: 'news_anchor',
    description: 'Crystal clear, smooth Urdu articulation with elegant studio broadcast tone.',
    badge: 'Urdu #1 Pick'
  },
  {
    id: 'voice_ur_faizan',
    name: 'Faizan (Deep Urdu Narrator)',
    nativeName: 'فیضان (گہری اردو آواز)',
    gender: 'male',
    languages: ['Urdu (اردو)', 'Hindi (हिंदी)', 'English (US/UK)'],
    geminiVoice: 'charon',
    recommendedEmotion: 'deep_cinematic',
    description: 'Deep resonant male Urdu voice, perfect for documentaries, stories, and reels.',
    badge: 'Deep Urdu'
  },
  {
    id: 'voice_ur_kiran',
    name: 'Kiran (Energetic Urdu Influencer)',
    nativeName: 'کرن (جوشیلہ انداز)',
    gender: 'female',
    languages: ['Urdu (اردو)', 'Hindi (हिंदी)', 'English (US/UK)'],
    geminiVoice: 'zephyr',
    recommendedEmotion: 'energetic',
    description: 'Vibrant, fast-paced and natural tone ideal for TikTok, Shorts & Instagram Reels.',
    badge: 'Shorts & Reels'
  },
  {
    id: 'voice_en_zara',
    name: 'Zara (Studio Pro English)',
    nativeName: 'Zara (Crystal Clear English)',
    gender: 'female',
    languages: ['English (US/UK)', 'Spanish (Español)', 'French (Français)'],
    geminiVoice: 'aoede',
    recommendedEmotion: 'natural',
    description: 'Warm, refined and authoritative voice with flawless clarity across all English accents.',
    badge: 'Global English'
  },
  {
    id: 'voice_en_arthur',
    name: 'Arthur (Cinematic Voice of God)',
    nativeName: 'Arthur (Epic Narrator)',
    gender: 'male',
    languages: ['English (US/UK)', 'German (Deutsch)'],
    geminiVoice: 'fenrir',
    recommendedEmotion: 'deep_cinematic',
    description: 'Epic movie trailer resonance, dramatic pacing and captivating delivery.',
    badge: 'Movie Trailer'
  },
  {
    id: 'voice_hi_priya',
    name: 'Priya (Clear Hindi Presenter)',
    nativeName: 'प्रिया (स्पष्ट हिंदी आवाज़)',
    gender: 'female',
    languages: ['Hindi (हिंदी)', 'Urdu (اردو)', 'English (US/UK)'],
    geminiVoice: 'kore',
    recommendedEmotion: 'friendly',
    description: 'Clean, sweet and friendly Hindi voiceover with sharp pronunciation.',
    badge: 'Hindi Pro'
  },
  {
    id: 'voice_ar_tariq',
    name: 'Tariq (Fasih Arabic Orator)',
    nativeName: 'طارق (فصيح نقي)',
    gender: 'male',
    languages: ['Arabic (العربية)'],
    geminiVoice: 'charon',
    recommendedEmotion: 'news_anchor',
    description: 'Flawless Classical and Modern Standard Arabic with commanding clarity.',
    badge: 'Fasih Arabic'
  }
];

export const VIDEO_TOPIC_TEMPLATES = [
  {
    title: 'Top 5 AI Secrets of 2026',
    prompt: '5 Mind-Blowing AI tools and future technologies that will change everything in 2026',
    format: 'short' as const,
    lang: 'English',
    humanStyle: 'female_presenter' as const
  },
  {
    title: 'اردو میں تاریخ کے سب سے بڑے راز',
    prompt: 'دنیا کے 3 پراسرار حقائق اور تاریخی دریافتیں جو آپ کو حیران کر دیں گی',
    format: 'short' as const,
    lang: 'Urdu (اردو)',
    humanStyle: 'male_presenter' as const
  },
  {
    title: 'How to Build Real Wealth (Viral Reel)',
    prompt: '3 Money habits that millionaires practice daily, actionable wealth advice for beginners',
    format: 'short' as const,
    lang: 'English',
    humanStyle: 'podcast_host' as const
  },
  {
    title: 'अंतरिक्ष के अनसुलझे रहस्य (Hindi Long Video)',
    prompt: 'ब्लैक होल और ब्रह्मांड के चौंकाने वाले सच जो विज्ञान को भी हैरान करते हैं',
    format: 'long' as const,
    lang: 'Hindi (हिंदी)',
    humanStyle: 'documentary' as const
  },
  {
    title: 'The Psychology of High Achievers',
    prompt: 'Deep dive documentary explaining dopamine, discipline, and focus routines of elite performers',
    format: 'long' as const,
    lang: 'English',
    humanStyle: 'cinematic_real' as const
  },
  {
    title: 'حقائق کائنات: بلیک ہول کے پراسرار راز',
    prompt: 'کائنات میں بلیک ہول کیسے کام کرتے ہیں اور وقت کا سفر کیسے ممکن ہوتا ہے، مکمل دستاویزی ویڈیو',
    format: 'long' as const,
    lang: 'Urdu (اردو)',
    humanStyle: 'documentary' as const
  }
];
