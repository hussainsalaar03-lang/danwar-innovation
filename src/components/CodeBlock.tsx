import React, { useState, useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { Check, Copy, Code2, Terminal } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const cleanLang = (language || '').toLowerCase().trim();

  // Generate highlighted HTML
  const highlightedCode = useMemo(() => {
    if (cleanLang && hljs.getLanguage(cleanLang)) {
      try {
        return hljs.highlight(value, { language: cleanLang, ignoreIllegals: true }).value;
      } catch {
        // Fallback to auto
      }
    }
    try {
      return hljs.highlightAuto(value).value;
    } catch {
      return escapeHtml(value);
    }
  }, [value, cleanLang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayLang = cleanLang || 'code';

  return (
    <div className="my-2.5 sm:my-3 rounded-xl overflow-hidden border border-slate-700/70 bg-[#282c34] shadow-lg text-slate-100 font-mono text-xs max-w-full">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#21252b] border-b border-slate-700/60 select-none">
        <div className="flex items-center gap-2 min-w-0">
          {displayLang === 'bash' || displayLang === 'sh' || displayLang === 'shell' || displayLang === 'zsh' ? (
            <Terminal size={13} className="text-emerald-400 flex-shrink-0" />
          ) : (
            <Code2 size={13} className="text-indigo-400 flex-shrink-0" />
          )}
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300 truncate">
            {displayLang}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[10px] sm:text-[11px] font-medium active:scale-95 border border-slate-700 flex-shrink-0"
          title="Copy code to clipboard"
          type="button"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Highlighted Code Area */}
      <div className="p-3 sm:p-4 overflow-x-auto text-[11px] sm:text-[13px] leading-relaxed selection:bg-indigo-500/40 selection:text-white overscroll-contain">
        <pre className="!bg-transparent !p-0 !m-0 font-mono">
          <code
            className={`hljs ${cleanLang ? `language-${cleanLang}` : ''} !bg-transparent !p-0 font-mono`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  );
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
