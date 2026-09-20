import React from 'react';
import { 
  Zap, 
  Music, 
  Code2, 
  Sparkles, 
  Youtube, 
  FileText, 
  Globe,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export type AIMode = 'bullet' | 'audio' | 'code' | 'seo' | 'document' | 'sindhi';

interface FeatureBarProps {
  activeMode: AIMode;
  onSelectMode: (mode: AIMode) => void;
  onSelectQuickPrompt: (prompt: string) => void;
  onOpenAbout: () => void;
}

export const FeatureBar: React.FC<FeatureBarProps> = ({
  activeMode,
  onSelectMode,
  onSelectQuickPrompt,
  onOpenAbout,
}) => {
  const modes: { id: AIMode; label: string; icon: React.ReactNode; tooltip: string; samplePrompt: string }[] = [
    {
      id: 'bullet',
      label: 'Bullet Speed',
      icon: <Zap size={13} className="text-amber-500 fill-amber-500/20" />,
      tooltip: 'Zero-delay rapid concise answering',
      samplePrompt: 'Give me a fast bullet-point breakdown on: '
    },
    {
      id: 'audio',
      label: 'Song & Audio Review',
      icon: <Music size={13} className="text-purple-500" />,
      tooltip: 'Mix balance, vocal delivery & mastering check',
      samplePrompt: 'Please review this song audio for vocal mix, kick-bass balance, and mastering loudness.'
    },
    {
      id: 'code',
      label: 'Syntax & Code Debug',
      icon: <Code2 size={13} className="text-indigo-500" />,
      tooltip: '190+ language code audits, refactoring & syntax check',
      samplePrompt: 'Audit and optimize this code snippet for performance and clean architecture: '
    },
    {
      id: 'seo',
      label: 'YouTube & Viral SEO',
      icon: <Youtube size={13} className="text-rose-500" />,
      tooltip: 'Viral video hooks, high-CTR titles & tags',
      samplePrompt: 'Generate 5 viral YouTube video titles, high-CTR thumbnail concepts, and description tags for: '
    },
    {
      id: 'document',
      label: 'Document Audit',
      icon: <FileText size={13} className="text-emerald-500" />,
      tooltip: 'PDF, CSV, spreadsheet & research summary',
      samplePrompt: 'Extract executive summary, key findings, and action items from this document.'
    },
    {
      id: 'sindhi',
      label: 'Sindhi & Languages',
      icon: <Globe size={13} className="text-cyan-500" />,
      tooltip: 'Khairpur Mirs cultural heritage, Sindhi & multilingual support',
      samplePrompt: 'Translate and explain in clear, poetic Sindhi with cultural context: '
    }
  ];

  return (
    <div className="w-full flex items-center gap-1.5 py-1 px-0.5 text-xs select-none">
      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth overscroll-contain">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 flex items-center gap-1 flex-shrink-0">
          <SlidersHorizontal size={11} />
          <span className="hidden sm:inline">Features</span>
        </span>

        {modes.map((m) => {
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMode(m.id)}
              title={m.tooltip}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-medium text-[11px] whitespace-nowrap transition-all active:scale-95 border flex-shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-200/70 dark:hover:bg-slate-700'
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0 pl-1.5 border-l border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onOpenAbout}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 transition-colors whitespace-nowrap bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800"
          title="Learn more about Danwar AI and creator Muhammad Iqbal Danwar"
        >
          <Sparkles size={11} className="text-indigo-500" />
          <span className="hidden xs:inline">About</span>
          <ChevronRight size={11} />
        </button>
      </div>
    </div>
  );
};
