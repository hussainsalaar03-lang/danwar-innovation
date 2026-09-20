import { VideoProject, VideoScene } from '../types';

export interface CartoonCharacter {
  id: string;
  name: string;
  nativeName: string;
  category: '3d_pixar' | '2d_toon' | 'anime_chibi' | 'cute_creature' | 'superhero';
  gender: 'male' | 'female' | 'robot' | 'animal';
  role: string;
  description: string;
  avatarUrl: string;
  primaryColor: string;
  secondaryColor: string;
  skinTone: string;
  eyeColor: string;
  hairColor: string;
  outfitColor: string;
  personality: string;
  defaultAction: 'talk_wave' | 'talk_point' | 'talk_bounce' | 'talk_think' | 'talk_cheer' | 'talk_fly';
  recommendedVoiceId: string;
  recommendedEmotion: 'natural' | 'energetic' | 'deep_cinematic' | 'news_anchor' | 'friendly';
  badge: string;
}

export const CARTOON_CHARACTERS: CartoonCharacter[] = [
  {
    id: 'leo_toon',
    name: 'Leo (3D Toon Hero)',
    nativeName: 'لیو (کارٹون ہیرو)',
    category: '3d_pixar',
    gender: 'male',
    role: 'Adventurer & Storyteller',
    description: 'Energetic 3D Pixar-style boy with bright hoodie, big expressive eyes and lively gestures.',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
    primaryColor: '#f97316',
    secondaryColor: '#3b82f6',
    skinTone: '#fed7aa',
    eyeColor: '#1e3a8a',
    hairColor: '#451a03',
    outfitColor: '#ea580c',
    personality: 'Curious, cheerful, adventurous',
    defaultAction: 'talk_wave',
    recommendedVoiceId: 'voice_ur_kiran',
    recommendedEmotion: 'energetic',
    badge: '★ Popular Hero'
  },
  {
    id: 'maya_smart',
    name: 'Maya (Smart Science Girl)',
    nativeName: 'مایا (ہوشیار کارٹون بی بی)',
    category: '3d_pixar',
    gender: 'female',
    role: 'Explorer & Genius Kid',
    description: 'Charming 3D cartoon girl with glasses, ponytail and lab notebook explaining cool science facts.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    primaryColor: '#ec4899',
    secondaryColor: '#8b5cf6',
    skinTone: '#fed7aa',
    eyeColor: '#065f46',
    hairColor: '#172554',
    outfitColor: '#db2777',
    personality: 'Intelligent, witty, friendly',
    defaultAction: 'talk_point',
    recommendedVoiceId: 'voice_ur_ayesha',
    recommendedEmotion: 'friendly',
    badge: 'Genius Girl'
  },
  {
    id: 'robo_buddy',
    name: 'Robo-X (Friendly AI Bot)',
    nativeName: 'روبوٹ ایکس (دوستانہ روبوٹ)',
    category: '3d_pixar',
    gender: 'robot',
    role: 'Future Tech & AI Bot',
    description: 'Cute futuristic white-and-cyan companion robot with glowing animated digital face screen.',
    avatarUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80',
    primaryColor: '#06b6d4',
    secondaryColor: '#3b82f6',
    skinTone: '#e2e8f0',
    eyeColor: '#00f2fe',
    hairColor: '#0891b2',
    outfitColor: '#0284c7',
    personality: 'High-tech, funny, witty',
    defaultAction: 'talk_bounce',
    recommendedVoiceId: 'voice_en_zara',
    recommendedEmotion: 'energetic',
    badge: 'AI Robot'
  },
  {
    id: 'professor_owl',
    name: 'Professor Hoot (Wise Owl)',
    nativeName: 'پروفیسر ہاٹ (دانا الو)',
    category: 'cute_creature',
    gender: 'animal',
    role: 'Teacher & Wisdom Master',
    description: 'Scholarly animated owl with graduation cap, round spectacles and animated wings.',
    avatarUrl: 'https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?auto=format&fit=crop&w=400&q=80',
    primaryColor: '#b45309',
    secondaryColor: '#fbbf24',
    skinTone: '#d97706',
    eyeColor: '#f59e0b',
    hairColor: '#78350f',
    outfitColor: '#92400e',
    personality: 'Wise, articulate, warm',
    defaultAction: 'talk_think',
    recommendedVoiceId: 'voice_ur_faizan',
    recommendedEmotion: 'deep_cinematic',
    badge: 'Wise Master'
  },
  {
    id: 'dino_rex',
    name: 'Rex (Cute Baby Dino)',
    nativeName: 'ننھا ڈائناسور ریکس',
    category: 'cute_creature',
    gender: 'animal',
    role: 'Funny & Playful Dino',
    description: 'Adorable green cartoon baby T-Rex who tells funny jokes and learns exciting moral stories.',
    avatarUrl: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=400&q=80',
    primaryColor: '#22c55e',
    secondaryColor: '#84cc16',
    skinTone: '#86efac',
    eyeColor: '#15803d',
    hairColor: '#166534',
    outfitColor: '#15803d',
    personality: 'Cute, playful, hilarious',
    defaultAction: 'talk_bounce',
    recommendedVoiceId: 'voice_hi_priya',
    recommendedEmotion: 'friendly',
    badge: 'Kids Favorite'
  },
  {
    id: 'super_danwar',
    name: 'Captain Danwar (Cartoon Hero)',
    nativeName: 'کیپٹن دانوار (سپر ہیرو)',
    category: 'superhero',
    gender: 'male',
    role: 'Superhero & Defender',
    description: 'Dynamic superhero in glowing electric suit with fluttering cape and heroic power gestures.',
    avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
    primaryColor: '#6366f1',
    secondaryColor: '#ec4899',
    skinTone: '#fed7aa',
    eyeColor: '#60a5fa',
    hairColor: '#1e1b4b',
    outfitColor: '#4f46e5',
    personality: 'Courageous, inspiring, epic',
    defaultAction: 'talk_fly',
    recommendedVoiceId: 'voice_en_arthur',
    recommendedEmotion: 'deep_cinematic',
    badge: 'Super Toon'
  },
  {
    id: 'anime_kai',
    name: 'Kai (Chibi Anime Ninja)',
    nativeName: 'کائی (اینیمے چیبی ننجا)',
    category: 'anime_chibi',
    gender: 'male',
    role: 'Anime Star & Martial Artist',
    description: 'Expressive anime chibi character with spiky hair, headband, and lightning power aura.',
    avatarUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80',
    primaryColor: '#ef4444',
    secondaryColor: '#eab308',
    skinTone: '#fed7aa',
    eyeColor: '#dc2626',
    hairColor: '#18181b',
    outfitColor: '#b91c1c',
    personality: 'Fiery, determined, fast',
    defaultAction: 'talk_cheer',
    recommendedVoiceId: 'voice_ur_kiran',
    recommendedEmotion: 'energetic',
    badge: 'Anime Chibi'
  },
  {
    id: 'baba_story',
    name: 'Baba Noor (Storyteller Grandpa)',
    nativeName: 'بابا نور (قصہ گو بزرگ)',
    category: '2d_toon',
    gender: 'male',
    role: 'Folklore & Moral Stories',
    description: 'Warm cartoon grandfather with kind smile and traditional wisdom telling timeless tales.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    primaryColor: '#0d9488',
    secondaryColor: '#f59e0b',
    skinTone: '#fdba74',
    eyeColor: '#374151',
    hairColor: '#f3f4f6',
    outfitColor: '#0f766e',
    personality: 'Kind, wise, comforting',
    defaultAction: 'talk_wave',
    recommendedVoiceId: 'voice_ur_faizan',
    recommendedEmotion: 'news_anchor',
    badge: 'Moral Stories'
  }
];

export interface CartoonBackgroundTheme {
  id: string;
  name: string;
  skyGradient: [string, string, string];
  groundColor: string;
  elements: 'clouds' | 'stars_planets' | 'bubbles' | 'castle' | 'lab_tech' | 'trees_rainbow';
  thumbnail: string;
}

export const CARTOON_BACKGROUND_THEMES: CartoonBackgroundTheme[] = [
  {
    id: 'toon_magic_sky',
    name: 'Magic Rainbow Sky & Clouds',
    skyGradient: ['#38bdf8', '#818cf8', '#c084fc'],
    groundColor: '#4ade80',
    elements: 'trees_rainbow',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'toon_cosmic_space',
    name: 'Cosmic Galaxy & Orbiting Planets',
    skyGradient: ['#0f172a', '#1e1b4b', '#4c1d95'],
    groundColor: '#312e81',
    elements: 'stars_planets',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'toon_future_city',
    name: 'Vibrant Cartoon Metropolis',
    skyGradient: ['#0284c7', '#38bdf8', '#bae6fd'],
    groundColor: '#334155',
    elements: 'castle',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'toon_science_lab',
    name: 'High-Tech Hologram Lab',
    skyGradient: ['#0f172a', '#064e3b', '#065f46'],
    groundColor: '#022c22',
    elements: 'lab_tech',
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'toon_fantasy_castle',
    name: 'Enchanted Fairy Castle',
    skyGradient: ['#f472b6', '#c084fc', '#60a5fa'],
    groundColor: '#22c55e',
    elements: 'castle',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'
  }
];

export const CARTOON_ACTION_OPTIONS = [
  { id: 'talk_wave', name: '👋 Talk & Friendly Wave', desc: 'Character animates mouth, blinks, and waves hand cheerfully' },
  { id: 'talk_point', name: '👉 Talk & Point to Screen', desc: 'Points hand at visuals and key words with nodding head' },
  { id: 'talk_bounce', name: '⚡ Talk & Energetic Bounce', desc: 'Excited jumping/spring motion with dynamic talking' },
  { id: 'talk_think', name: '🤔 Talk & Deep Ponder', desc: 'Hand to chin, looking up with animated thought spark' },
  { id: 'talk_cheer', name: '🎉 Talk & Victory Cheer', desc: 'Hands in the air with joyful animated mouth movement' },
  { id: 'talk_fly', name: '🚀 Talk & Superhero Hover', desc: 'Floating gracefully with dynamic cape and power aura' }
];

export const CARTOON_FAST_TEMPLATES = [
  {
    id: 'tmpl_robot',
    title: 'The Little Robot Who Learned to Dream',
    desc: 'Cute friendly AI bot discovers galaxy painting',
    prompt: 'A cute friendly robot discovers art and paints a rainbow in outer space',
    lang: 'English',
    characterId: 'robo_buddy',
    charId: 'robo_buddy',
    action: 'talk_bounce' as const,
    backgroundTheme: 'toon_cosmic_space',
    bgTheme: 'toon_cosmic_space',
    badge: '🤖 Sci-Fi Fun'
  },
  {
    id: 'tmpl_dino_ur',
    title: 'ننھے ڈائناسور کی چاند کی سیر (Urdu Story)',
    desc: 'پیارا ننھا ڈائناسور اور چاند کی سیر بچوں کے لیے',
    prompt: 'ایک پیارا ننھا ڈائناسور چاند پر جاتا ہے اور ستاروں کے ساتھ کھیلتا ہے، بچوں کے لیے خوبصورت اردو کہانی',
    lang: 'Urdu (اردو)',
    characterId: 'dino_rex',
    charId: 'dino_rex',
    action: 'talk_wave' as const,
    backgroundTheme: 'toon_cosmic_space',
    bgTheme: 'toon_cosmic_space',
    badge: '🦖 اردو کارٹون'
  },
  {
    id: 'tmpl_science_hi',
    title: '3 Amazing Science Tricks You Can Do (Hindi)',
    desc: 'जादुई साइंस ट्रिक्स जो घर पर आसानी से कर सकते हैं',
    prompt: 'बच्चों के लिए 3 जादुई साइंस ट्रिक्स जो आप घर पर आसानी से कर सकते हैं',
    lang: 'Hindi (हिंदी)',
    characterId: 'maya_smart',
    charId: 'maya_smart',
    action: 'talk_point' as const,
    backgroundTheme: 'toon_science_lab',
    bgTheme: 'toon_science_lab',
    badge: '🔬 Fun Science'
  },
  {
    id: 'tmpl_superhero',
    title: 'Super Danwar: The Quest for the Golden Star',
    desc: 'Superhero cartoon flies through futuristic city',
    prompt: 'Superhero toon flies through the city to rescue a runaway magical balloon',
    lang: 'English',
    characterId: 'super_danwar',
    charId: 'super_danwar',
    action: 'talk_fly' as const,
    backgroundTheme: 'toon_future_city',
    bgTheme: 'toon_future_city',
    badge: '🦸 Superhero'
  },
  {
    id: 'tmpl_owl_ur',
    title: 'دانا الو اور جنگل کے جانوروں کی کہانی',
    desc: 'سچ بولنے اور مل جل کر رہنے کی خوبصورت نصیحت',
    prompt: 'ایک عقلمند الو جنگل کے تمام جانوروں کو سچ بولنے اور مل جل کر رہنے کی خوبصورت نصیحت کرتا ہے',
    lang: 'Urdu (اردو)',
    characterId: 'professor_owl',
    charId: 'professor_owl',
    action: 'talk_think' as const,
    backgroundTheme: 'toon_magic_sky',
    bgTheme: 'toon_magic_sky',
    badge: '🦉 اخلاقی کہانی'
  }
];

/**
 * Instant procedural cartoon generator that creates a ready-to-play animated video in < 100ms!
 */
export function generateInstantCartoonProject(
  prompt: string,
  language: string = 'English',
  charId: string = 'leo_toon',
  bgTheme: string = 'toon_magic_sky',
  aspectRatio: '9:16' | '16:9' | '1:1' = '9:16',
  action: 'talk_wave' | 'talk_point' | 'talk_bounce' | 'talk_think' | 'talk_cheer' | 'talk_fly' = 'talk_wave'
): VideoProject {
  const selectedChar = CARTOON_CHARACTERS.find(c => c.id === charId) || CARTOON_CHARACTERS[0];
  const isUrdu = language.includes('Urdu');
  const isHindi = language.includes('Hindi');
  const isArabic = language.includes('Arabic');

  const title = isUrdu 
    ? `کارٹون کہانی: ${prompt.slice(0, 25) || 'ننھا ہیرو اور جادوئی دنیا'}`
    : isHindi
    ? `कार्टून कहानी: ${prompt.slice(0, 25) || 'जादुई दुनिया और नन्हा हीरो'}`
    : isArabic
    ? `قصة كرتونية: ${prompt.slice(0, 25) || 'مغامرة البطل الصغير'}`
    : `Toon Adventure: ${prompt.slice(0, 25) || 'The Magical Quest'}`;

  // Build 3 instant dynamic scenes
  const scenes: VideoScene[] = [
    {
      id: `scene_toon_1_${Date.now()}`,
      sceneNumber: 1,
      duration: 6,
      narration: isUrdu
        ? `سلام دوستو! میں ہوں ${selectedChar.nativeName}۔ آج میں آپ کو ایک زبردست اور جادوئی کہانی سنانے جا رہا ہوں۔`
        : isHindi
        ? `नमस्ते दोस्तों! मैं हूँ ${selectedChar.name}। आज हम एक बेहद रोमांचक और मज़ेदार कहानी देखने वाले हैं!`
        : isArabic
        ? `مرحباً يا أصدقاء! أنا ${selectedChar.name}، واليوم لدينا قصة شيقة وممتعة جداً!`
        : `Hey everyone! I am ${selectedChar.name}. Welcome to our super fun animated adventure today!`,
      subtitles: isUrdu ? 'سلام دوستو! جادوئی کہانی' : isHindi ? 'नमस्ते दोस्तों! जादुई कहानी' : 'Welcome to the Adventure!',
      visualPrompt: `3D vibrant cute Pixar cartoon character ${selectedChar.name} waving cheerfully in a colorful fantasy landscape`,
      imageUrl: selectedChar.avatarUrl,
      characterId: selectedChar.id,
      characterAction: action || 'talk_wave',
      characterEmotion: 'happy',
      characterPosition: 'center',
      backgroundTheme: bgTheme || 'toon_magic_sky',
      speechBubbleText: isUrdu ? 'خوش آمدید!' : isHindi ? 'स्वागत है!' : 'Let’s Go!',
      transition: 'zoom_in'
    },
    {
      id: `scene_toon_2_${Date.now() + 1}`,
      sceneNumber: 2,
      duration: 7,
      narration: isUrdu
        ? `دیکھیں! جب ہم نے اس راز کو دریافت کیا، تو پوری دنیا رنگوں اور روشنیوں سے چمک اٹھی۔`
        : isHindi
        ? `देखिए! जब हमने इस रहस्य को समझा, तो पूरी दुनिया जादुई रोशनी से जगमगा उठी।`
        : isArabic
        ? `انظروا! عندما اكتشفنا هذا السر العجيب، أضاءت الدنيا بأجمل الألوان السحرية!`
        : `Look right here! The moment we unlocked this secret, the whole cartoon world lit up with magical energy!`,
      subtitles: isUrdu ? 'حیرت انگیز جادوئی روشنی' : isHindi ? 'अद्भुत जादुई रहस्य' : 'Magical Energy Unlocked!',
      visualPrompt: `Vibrant cartoon scenery with rainbow glowing lights, animated particles and joyful toon expression`,
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      characterId: selectedChar.id,
      characterAction: selectedChar.defaultAction,
      characterEmotion: 'excited',
      characterPosition: 'center',
      backgroundTheme: 'toon_cosmic_space',
      speechBubbleText: isUrdu ? 'واہ کیا جادو ہے!' : isHindi ? 'वाह क्या जादू है!' : 'Amazing!',
      transition: 'slide_left'
    },
    {
      id: `scene_toon_3_${Date.now() + 2}`,
      sceneNumber: 3,
      duration: 6,
      narration: isUrdu
        ? `اگر آپ کو یہ کارٹون پسند آیا، تو ابھی فالو کریں اور Danwar AI کے ساتھ اپنے کارٹون بنائیں!`
        : isHindi
        ? `अगर आपको यह कार्टून पसंद आया तो अभी लाइक करें और Danwar AI से अपने नए वीडियो बनाएं!`
        : isArabic
        ? `إذا أعجبكم هذا الكرتون، تابعونا وصمموا فيديوهاتكم الرائعة عبر Danwar AI!`
        : `If you enjoyed this toon adventure, smash that like button and create your own cartoon with Danwar AI!`,
      subtitles: isUrdu ? 'ابھی فالو کریں • Danwar AI' : isHindi ? 'फॉलो करें • Danwar AI' : 'Subscribe & Make Toons • Danwar AI',
      visualPrompt: `Cartoon character jumping happily with celebratory confetti and glowing stars`,
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      characterId: selectedChar.id,
      characterAction: 'talk_cheer',
      characterEmotion: 'heroic',
      characterPosition: 'center',
      backgroundTheme: 'toon_future_city',
      speechBubbleText: isUrdu ? 'شکریہ دوستو!' : isHindi ? 'धन्यवाद!' : 'Danwar AI Toons!',
      transition: 'zoom_out'
    }
  ];

  return {
    id: `toon_proj_${Date.now()}`,
    title,
    prompt: prompt || 'Fun Animated Cartoon Story',
    language,
    aspectRatio,
    videoType: 'short',
    videoCategory: 'cartoon_animation',
    humanStyle: 'cartoon_3d',
    cartoonCharacterId: selectedChar.id,
    cartoonAction: action || selectedChar.defaultAction,
    cartoonBackgroundTheme: bgTheme || 'toon_magic_sky',
    showSpeechBubble: true,
    voiceId: selectedChar.recommendedVoiceId,
    voiceGender: selectedChar.gender === 'female' ? 'female' : 'male',
    voiceEmotion: selectedChar.recommendedEmotion,
    voicePitch: selectedChar.gender === 'female' ? 1.15 : 1.05,
    voiceRate: 1.05,
    bgMusic: 'cartoon_fun',
    bgMusicVolume: 0.25,
    captionStyle: 'cartoon_comic',
    scenes,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}
