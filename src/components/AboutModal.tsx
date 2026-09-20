import React from 'react';
import { 
  Zap, 
  Sparkles, 
  Music, 
  Code2, 
  Shield, 
  Cpu, 
  FileText, 
  X, 
  ExternalLink, 
  Mail, 
  MapPin, 
  User, 
  CheckCircle2, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFeaturePrompt?: (prompt: string) => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ 
  isOpen, 
  onClose,
  onSelectFeaturePrompt 
}) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: <Zap className="text-amber-500" size={18} />,
      title: 'Bullet-Speed Streaming',
      desc: 'Sub-100ms first-token latency with zero-delay live inference. Replies begin streaming immediately without thinking bottlenecks.',
      tag: 'Ultra-Fast',
      prompt: 'Test speed: Give me a concise bullet-point breakdown of quantum computing principles.'
    },
    {
      icon: <Music className="text-purple-500" size={18} />,
      title: 'Audio & Music Studio',
      desc: 'Detailed acoustic analysis, vocal delivery grading, dynamic range evaluation, beat mixing critique, and arrangement advice.',
      tag: 'Multimodal',
      prompt: 'I want a detailed mix and arrangement review of my new song. What should I check for radio-ready sound?'
    },
    {
      icon: <Code2 className="text-indigo-500" size={18} />,
      title: '190+ Language Syntax Highlighter',
      desc: 'Built-in syntax highlighting engine with one-click copy, automated language detection, and line-by-line debugging.',
      tag: 'Developer Suite',
      prompt: 'Write an optimized TypeScript function with error handling and explain its algorithmic complexity.'
    },
    {
      icon: <Layers className="text-emerald-500" size={18} />,
      title: 'Multimodal File Ingestion',
      desc: 'Direct drag-and-drop support for audio (MP3, WAV), images (PNG, JPG), documents (PDF, CSV, TXT), and source code repositories.',
      tag: 'Full Context',
      prompt: 'How do I optimize a YouTube video thumbnail and tags to get maximum click-through rate?'
    },
    {
      icon: <Shield className="text-cyan-500" size={18} />,
      title: 'Zero-Data Retention Privacy',
      desc: '100% private. Chat sessions reside in your local browser sandbox. Uploaded files are processed ephemerally in RAM and never retained.',
      tag: 'Privacy-First',
      prompt: 'Summarize the core privacy protections of Danwar AI and how local storage is used.'
    },
    {
      icon: <Cpu className="text-rose-500" size={18} />,
      title: 'Hardware Adaptive Engine',
      desc: 'Smartphone touch-first ergonomics and 5G cellular compression paired with desktop multi-pane sidebar and batch workflows.',
      tag: 'Cross-Platform',
      prompt: 'What are the key architectural differences between Danwar AI on smartphones and computers?'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
        className="relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
              <Zap size={18} className="fill-white sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 id="about-modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  About Danwar AI
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 flex-shrink-0">
                  v3.3.1
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                Zero-latency multimodal AI • Mobile & desktop adaptive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed overscroll-contain">
          {/* Vision Statement */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-slate-50 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900/40 border border-indigo-100 dark:border-indigo-900/50 space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Vision & Architecture</span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm leading-relaxed">
              Danwar AI is designed from the ground up to eliminate AI latency bottlenecks. By coupling sub-millisecond SSE streaming, server-level packet delivery acceleration, and adaptive responsive ergonomics across mobile smartphones and ultra-wide desktops, Danwar AI delivers replies at bullet-train speed without compromising on depth or accuracy.
            </p>
          </div>

          {/* Features Grid */}
          <div>
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Core Multimodal Features & Tools
              </h3>
              <span className="text-[10px] sm:text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                6 Active Modules
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {feature.icon}
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {feature.title}
                        </h4>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {feature.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      {feature.desc}
                    </p>
                  </div>
                  
                  {onSelectFeaturePrompt && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectFeaturePrompt(feature.prompt);
                        onClose();
                      }}
                      className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between text-[10px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 transition-colors"
                    >
                      <span>Try Feature Prompt</span>
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Founder & Attribution */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
              <User size={15} className="text-indigo-600 dark:text-indigo-400" />
              <span>Creator, Founder & Sole Developer</span>
            </div>
            
            <div className="space-y-1.5 text-xs">
              <p className="text-slate-800 dark:text-slate-200">
                <strong>Muhammad Iqbal Danwar</strong> is the sole CEO, developer, and creator of Danwar AI, hailing from the historic city of <strong>Khairpur Mir&apos;s, District Khairpur, Sindh, Pakistan</strong>.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Engineered with pride, honoring the cultural richness, intellectual heritage, and warmth of Sindhi tradition.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <a 
                href="mailto:danwarmuhammadiqbal@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium transition-colors"
              >
                <Mail size={13} />
                <span>danwarmuhammadiqbal@gmail.com</span>
              </a>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                <MapPin size={13} className="text-rose-500" />
                <span>Khairpur Mir&apos;s, Sindh, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex-shrink-0">
          <a
            href="/about.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] sm:text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 truncate"
          >
            <span>Open Full Web Page</span>
            <ExternalLink size={12} />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 text-xs font-semibold transition-all shadow-sm active:scale-95 flex-shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
