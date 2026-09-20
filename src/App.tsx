/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, MouseEvent } from 'react';
import { Send, Bot, User, Trash2, Loader2, Sparkles, Plus, MessageSquare, Search, Sun, Moon, Laptop, Download, Check, Copy, Paperclip, Music, FileText, X, Image as ImageIcon, Volume2, VolumeX, Scale, ShieldCheck, Zap, Menu, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, ChatSession, Attachment } from './types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TermsAndConditionsModal } from './components/TermsAndConditionsModal';
import { CodeBlock } from './components/CodeBlock';
import { AboutModal } from './components/AboutModal';
import { DeleteHistoryModal } from './components/DeleteHistoryModal';
import { FeatureBar, AIMode } from './components/FeatureBar';

type Theme = 'light' | 'dark' | 'system';

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
};

const safeLocalStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`localStorage setItem failed for ${key}:`, e);
  }
};

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('theme') as Theme) || 'system';
    } catch {
      return 'system';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (theme: Theme) => {
      root.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };

    applyTheme(theme);
    safeLocalStorageSet('theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('danwar-ai-sessions') || localStorage.getItem('nexus-ai-sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse sessions from localStorage', e);
    }
    return [{
      id: 'default',
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now()
    }];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    try {
      const savedLastSession = localStorage.getItem('danwar-ai-current-session-id');
      const savedSessions = localStorage.getItem('danwar-ai-sessions') || localStorage.getItem('nexus-ai-sessions');
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (savedLastSession && parsed.some((s: any) => s && s.id === savedLastSession)) {
            return savedLastSession;
          }
          return parsed[0].id;
        }
      }
    } catch (e) {
      // ignore
    }
    return 'default';
  });

  // Ensure currentSessionId always stays valid and points to an existing session
  useEffect(() => {
    if (sessions.length > 0) {
      const exists = sessions.some(s => s.id === currentSessionId);
      if (!exists) {
        setCurrentSessionId(sessions[0].id);
      }
    }
  }, [sessions, currentSessionId]);

  // Persist active session ID for instant recovery
  useEffect(() => {
    if (currentSessionId) {
      safeLocalStorageSet('danwar-ai-current-session-id', currentSessionId);
    }
  }, [currentSessionId]);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExported, setIsExported] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<AIMode>('bullet');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    mode: 'clear-all' | 'delete-session';
    sessionId?: string;
    sessionTitle?: string;
    messageCount?: number;
  }>({
    isOpen: false,
    mode: 'delete-session',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeakMessage = (messageId: string, content: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Web Speech API is not supported in this browser.');
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean up Markdown formatting for natural speech output
    const plainText = content
      .replace(/```[\s\S]*?```/g, ' code snippet ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/#+\s?/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[\n\r]+/g, '. ')
      .trim();

    if (!plainText) return;

    const utterance = new SpeechSynthesisUtterance(plainText);
    
    // Select best natural voice available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Enhanced') || v.name.includes('Premium')))
      || voices.find(v => v.lang.startsWith('en'))
      || voices[0];

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyMessage = async (id: string, content: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedMessageId(id);
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy message', err);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const nameLower = file.name.toLowerCase();
      const ext = nameLower.split('.').pop() || '';

      let mimeType = file.type;
      if (!mimeType) {
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        else if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) mimeType = `audio/${ext === 'mp3' ? 'mpeg' : ext}`;
        else if (['pdf'].includes(ext)) mimeType = 'application/pdf';
        else if (['json', 'js', 'jsx', 'ts', 'tsx', 'py', 'c', 'cpp', 'java', 'html', 'css', 'csv', 'md', 'txt', 'xml', 'sql'].includes(ext)) mimeType = 'text/plain';
        else mimeType = 'application/octet-stream';
      }

      let fileType: Attachment['type'] = 'other';
      if (mimeType.startsWith('image/')) fileType = 'image';
      else if (mimeType.startsWith('audio/')) fileType = 'audio';
      else if (mimeType.startsWith('text/') || mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('json') || ['txt', 'md', 'csv', 'json', 'js', 'jsx', 'ts', 'tsx', 'py', 'c', 'cpp', 'java', 'html', 'css', 'sql', 'xml'].includes(ext)) fileType = 'document';

      // Fast image downscaling helper if image is larger than 1.5MB to ensure sub-50ms transmission
      if (fileType === 'image' && file.size > 1.5 * 1024 * 1024) {
        try {
          const compressedDataUrl = await new Promise<string>((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();
            reader.onload = (re) => {
              img.onload = () => {
                const maxDim = 1600;
                let w = img.width;
                let h = img.height;
                if (w > maxDim || h > maxDim) {
                  if (w > h) {
                    h = Math.round((h * maxDim) / w);
                    w = maxDim;
                  } else {
                    w = Math.round((w * maxDim) / h);
                    h = maxDim;
                  }
                }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.drawImage(img, 0, 0, w, h);
                  resolve(canvas.toDataURL('image/jpeg', 0.85));
                } else {
                  resolve(reader.result as string);
                }
              };
              img.onerror = () => resolve(re.target?.result as string);
              img.src = re.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          newAttachments.push({
            id: generateId(),
            name: file.name,
            type: 'image',
            mimeType: 'image/jpeg',
            data: compressedDataUrl,
            size: file.size,
          });
          continue;
        } catch (compErr) {
          console.warn('Image optimization skipped:', compErr);
        }
      }

      const reader = new FileReader();
      const filePromise = new Promise<Attachment>((resolve, reject) => {
        reader.onload = () => {
          resolve({
            id: generateId(),
            name: file.name,
            type: fileType,
            mimeType,
            data: reader.result as string,
            size: file.size,
          });
        };
        reader.onerror = reject;
      });

      reader.readAsDataURL(file);
      try {
        const att = await filePromise;
        newAttachments.push(att);
      } catch (err) {
        console.error('Failed to read file', err);
      }
    }

    setAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const currentSession: ChatSession = sessions.find(s => s.id === currentSessionId) || sessions[0] || {
    id: 'default',
    title: 'New Chat',
    messages: [],
    updatedAt: Date.now()
  };

  // If sessions list ever becomes empty, immediately provision a fresh active chat
  useEffect(() => {
    if (sessions.length === 0) {
      const freshSession: ChatSession = {
        id: generateId(),
        title: 'New Chat',
        messages: [],
        updatedAt: Date.now()
      };
      setSessions([freshSession]);
      setCurrentSessionId(freshSession.id);
    }
  }, [sessions]);

  // Debounced session persistence to prevent blocking the UI thread during rapid token streaming
  useEffect(() => {
    const timer = setTimeout(() => {
      safeLocalStorageSet('danwar-ai-sessions', JSON.stringify(sessions));
    }, 500);
    return () => clearTimeout(timer);
  }, [sessions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentSession.messages]);

  const handleSend = async () => {
    const rawInput = input.trim();
    if ((!rawInput && attachments.length === 0) || isLoading) return;

    // Resolve the active target session explicitly so initial page load sends without needing 'New Chat'
    let activeSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
    if (!activeSession) {
      const freshSession: ChatSession = {
        id: generateId(),
        title: 'New Chat',
        messages: [],
        updatedAt: Date.now()
      };
      activeSession = freshSession;
      setSessions([freshSession]);
      setCurrentSessionId(freshSession.id);
    }

    const targetSessionId = activeSession.id;
    if (currentSessionId !== targetSessionId) {
      setCurrentSessionId(targetSessionId);
    }

    const currentAttachments = [...attachments];

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: rawInput,
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
      timestamp: Date.now()
    };

    const assistantMessageId = generateId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };

    const updatedMessages = [...activeSession.messages, userMessage];
    
    // Immediately display user message and optimistic assistant placeholder for instant 0ms perception
    setSessions(prev => {
      const exists = prev.some(s => s.id === targetSessionId);
      if (!exists) {
        return [{
          id: targetSessionId,
          title: userMessage.content ? (userMessage.content.slice(0, 30) + '...') : 'New Chat',
          messages: [userMessage, assistantMessage],
          updatedAt: Date.now()
        }, ...prev];
      }
      return prev.map(s => 
        s.id === targetSessionId 
          ? { 
              ...s, 
              messages: [...s.messages, userMessage, assistantMessage], 
              title: (s.messages.length === 0 && userMessage.content) ? (userMessage.content.slice(0, 30) + '...') : s.title,
              updatedAt: Date.now() 
            } 
          : s
      );
    });
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      let customInstruction: string | undefined = undefined;
      if (activeMode === 'audio') {
        customInstruction = "You are Danwar AI in Acoustic Audio & Song Studio mode. Deliver an expert, structured audio review covering: 1. Vocal Performance & Delivery, 2. Beat & Mix Quality (kick-bass punch, vocal clarity, high-end shimmer), 3. Dynamic Range & Mastering Loudness, 4. Overall Rating (/10), 5. Top 3 Actionable Pro Studio Tips.";
      } else if (activeMode === 'code') {
        customInstruction = "You are Danwar AI in 190+ Language Syntax & Code Auditor mode. Always provide syntax-highlighted code blocks with language tags, evaluate time & space complexity, check for subtle edge cases or bugs, and offer clean refactored solutions.";
      } else if (activeMode === 'seo') {
        customInstruction = "You are Danwar AI in YouTube & Viral Media SEO mode. Provide high-CTR magnetic titles, engaging video hook lines, algorithmic description tags, and thumbnail visual critiques.";
      } else if (activeMode === 'document') {
        customInstruction = "You are Danwar AI in Document Audit mode. Provide an executive summary, key findings, critical data metrics, and actionable recommendations.";
      } else if (activeMode === 'sindhi') {
        customInstruction = "You are Danwar AI in Sindhi Heritage & Translation mode, celebrating the culture and language of Khairpur Mir's, Sindh, Pakistan. Deliver eloquent, culturally authentic Sindhi translations and explanations alongside Urdu and English equivalents.";
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          systemInstruction: customInstruction,
          // Send messages to API, keeping payload lightweight (last 8 messages) for ultra-fast TTFT
          messages: updatedMessages.slice(-8).map((m, idx, arr) => {
            const isRecent = idx >= arr.length - 2;
            return {
              role: m.role,
              content: m.content,
              attachments: (isRecent && m.attachments) ? m.attachments.map(att => ({
                name: att.name,
                mimeType: att.mimeType,
                data: att.data
              })) : undefined
            };
          })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}: ${response.statusText}`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let fullContent = '';
      const decoder = new TextDecoder();
      let buffer = '';
      let rafScheduled = false;

      const updateUI = (text: string) => {
        setSessions(prev => prev.map(s => 
          s.id === targetSessionId 
            ? { 
                ...s, 
                messages: s.messages.map(m => 
                  m.id === assistantMessageId ? { ...m, content: text } : m
                )
              } 
            : s
        ));
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;
          
          const dataStr = trimmedLine.slice(6);
          if (dataStr === '[DONE]') break;

          try {
            const data = JSON.parse(dataStr);
            if (data.error) {
              throw new Error(data.error);
            }
            if (data.text) {
              fullContent += data.text;
              setIsLoading(false);
              
              if (!rafScheduled) {
                rafScheduled = true;
                requestAnimationFrame(() => {
                  updateUI(fullContent);
                  rafScheduled = false;
                });
              }
            }
          } catch (e: any) {
            console.error('Error parsing stream chunk', e);
            if (e.message && e.message.includes('JSON')) {
              // Ignore partial JSON parse errors safely
            } else {
              throw e;
            }
          }
        }
      }

      // Final flush to guarantee full text is rendered
      updateUI(fullContent);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Chat Error:', error);
      let rawError = error.message || 'An unexpected network error occurred. Please try again.';
      let userFriendlyMessage = rawError;

      if (rawError.includes('429') || rawError.includes('quota') || rawError.includes('RESOURCE_EXHAUSTED')) {
        userFriendlyMessage = `⚡ **High-Traffic Cooldown (429 Rate Limit)**\n\nThe server experienced high request volume. \n\n**Quick Solution:**\n- ⏳ Please wait **5–10 seconds** and tap **Send** again for an express response!`;
      }
      
      // Ensure session is updated with error message so user sees immediate feedback
      setSessions(prev => prev.map(s => {
        if (s.id !== targetSessionId) return s;
        
        const messages = [...s.messages];
        const lastMessage = messages[messages.length - 1];
        
        if (lastMessage && lastMessage.role === 'assistant') {
          return {
            ...s,
            messages: messages.map(m => 
              m.id === lastMessage.id ? { 
                ...m, 
                content: m.content 
                  ? `${m.content}\n\n⚠️ ${userFriendlyMessage}` 
                  : `⚠️ ${userFriendlyMessage}` 
              } : m
            )
          };
        } else {
          return {
            ...s,
            messages: [...messages, {
              id: generateId(),
              role: 'assistant',
              content: `⚠️ ${userFriendlyMessage}`,
              timestamp: Date.now()
            }]
          };
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const exportChatSession = () => {
    if (!currentSession.messages || currentSession.messages.length === 0) return;

    const title = currentSession.title || 'Chat Session';
    const formattedDate = new Date(currentSession.updatedAt).toLocaleString();

    let textContent = `==================================================\n`;
    textContent += `Danwar AI - Chat Session Export\n`;
    textContent += `Title: ${title}\n`;
    textContent += `Date: ${formattedDate}\n`;
    textContent += `Total Messages: ${currentSession.messages.length}\n`;
    textContent += `==================================================\n\n`;

    currentSession.messages.forEach((msg) => {
      const sender = msg.role === 'user' ? 'USER' : 'DANWAR AI';
      const time = new Date(msg.timestamp).toLocaleString();
      textContent += `[${sender}] (${time})\n`;
      textContent += `${msg.content}\n`;
      textContent += `\n--------------------------------------------------\n\n`;
    });

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().slice(0, 30);
    link.download = `danwar_ai_${sanitizedTitle || 'chat'}_${Date.now()}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExported(true);
    setTimeout(() => setIsExported(false), 2000);
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now()
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const openClearAllModal = () => {
    setDeleteModalState({
      isOpen: true,
      mode: 'clear-all',
    });
  };

  const openDeleteSessionModal = (session: ChatSession, e?: MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setDeleteModalState({
      isOpen: true,
      mode: 'delete-session',
      sessionId: session.id,
      sessionTitle: session.title,
      messageCount: session.messages ? session.messages.length : 0,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.mode === 'clear-all') {
      const resetSession: ChatSession = {
        id: generateId(),
        title: 'New Chat',
        messages: [],
        updatedAt: Date.now(),
      };
      setSessions([resetSession]);
      setCurrentSessionId(resetSession.id);
      safeLocalStorageSet('danwar-ai-sessions', JSON.stringify([resetSession]));
      showToast('All chat history cleared');
    } else if (deleteModalState.sessionId) {
      const targetId = deleteModalState.sessionId;
      const filtered = sessions.filter(s => s.id !== targetId);
      if (filtered.length === 0) {
        const resetSession: ChatSession = {
          id: generateId(),
          title: 'New Chat',
          messages: [],
          updatedAt: Date.now(),
        };
        setSessions([resetSession]);
        setCurrentSessionId(resetSession.id);
      } else {
        setSessions(filtered);
        if (currentSessionId === targetId) {
          setCurrentSessionId(filtered[0].id);
        }
      }
      showToast('Chat history deleted');
    }
  };

  const renderSidebar = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center text-white dark:text-slate-900 shadow-sm">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="font-semibold text-base tracking-tight dark:text-white leading-none">Danwar AI</h1>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">v3.3.1</span>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      <div className="p-3.5 space-y-2">
        <button 
          onClick={() => {
            createNewChat();
            if (isMobile) setIsMobileSidebarOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl text-sm font-medium transition-colors shadow-sm active:scale-[0.98]"
        >
          <Plus size={16} />
          New Chat
        </button>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300 transition-colors" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 dark:focus:ring-white/5 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Chat History Section Header with Clear All Option */}
      <div className="px-3.5 pt-1 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold text-xs">
          <History size={13} className="text-slate-400 dark:text-slate-500" />
          <span>Chat History</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
            {sessions.length}
          </span>
        </div>
        <button
          id={isMobile ? "mobile-clear-all-history-btn" : "clear-all-history-btn"}
          onClick={openClearAllModal}
          disabled={sessions.length <= 1 && (!sessions[0] || sessions[0].messages.length === 0)}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 disabled:opacity-30 disabled:pointer-events-none transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 active:scale-95 cursor-pointer"
          title="Clear all chat history"
        >
          <Trash2 size={12} />
          <span>Clear All</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 overscroll-contain">
        {sessions
          .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .map(session => (
          <div
            key={session.id}
            className={`w-full text-left p-2 sm:p-2.5 rounded-xl flex items-center gap-1.5 transition-all group ${
              currentSessionId === session.id
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm' 
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <button
              onClick={() => {
                setCurrentSessionId(session.id);
                if (isMobile) setIsMobileSidebarOpen(false);
              }}
              className="flex-1 flex items-center gap-2.5 min-w-0 text-left focus:outline-none"
              title={`Switch to: ${session.title}`}
            >
              <MessageSquare size={16} className={currentSessionId === session.id ? 'text-slate-300 dark:text-slate-600 flex-shrink-0' : 'text-slate-400 flex-shrink-0'} />
              <span className="flex-1 truncate text-xs sm:text-sm font-medium">{session.title}</span>
              {session.messages && session.messages.length > 0 && (
                <span className={`text-[10px] font-mono px-1 rounded flex-shrink-0 ${
                  currentSessionId === session.id
                    ? 'bg-slate-800 dark:bg-slate-200 text-slate-300 dark:text-slate-700'
                    : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {session.messages.length}
                </span>
              )}
            </button>
            <button
              onClick={(e) => openDeleteSessionModal(session, e)}
              className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                currentSessionId === session.id
                  ? 'text-slate-400 hover:text-red-300 dark:text-slate-500 dark:hover:text-red-600 hover:bg-slate-800 dark:hover:bg-slate-200'
                  : 'opacity-70 sm:opacity-0 sm:group-hover:opacity-100 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
              }`}
              title="Delete chat history"
              aria-label={`Delete chat history for ${session.title}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {sessions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
          <div className="text-center py-6 px-3 text-slate-400 dark:text-slate-500 text-xs">
            No matching sessions found
          </div>
        )}
      </div>

      {/* Theme Toggle, Terms & Conditions & Developer Credit */}
      <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2 flex-shrink-0">
        <a
          id={isMobile ? "mobile-sidebar-updates-link" : "sidebar-updates-link"}
          href="/updates.html"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-all border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs active:scale-[0.98] group"
          title="View New Updates & Release Notes"
        >
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>Release Changelog</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-600 text-white font-bold">
            v3.3.1
          </span>
        </a>

        <button
          id={isMobile ? "mobile-sidebar-about-btn" : "sidebar-about-btn"}
          onClick={() => {
            setIsAboutOpen(true);
            if (isMobile) setIsMobileSidebarOpen(false);
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/50 hover:text-indigo-700 dark:hover:text-indigo-300 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all border border-slate-100 dark:border-slate-700/60 shadow-xs active:scale-[0.98] group"
          title="Learn about Danwar AI, features, and creator Muhammad Iqbal Danwar"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-indigo-500 group-hover:scale-110 transition-transform" />
            <span>About Danwar AI</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
            Founder
          </span>
        </button>

        <button
          id={isMobile ? "mobile-sidebar-terms-conditions-btn" : "sidebar-terms-conditions-btn"}
          onClick={() => {
            setIsTermsOpen(true);
            if (isMobile) setIsMobileSidebarOpen(false);
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all border border-slate-100 dark:border-slate-700/60 shadow-xs active:scale-[0.98] group"
          title="Read Danwar AI Official Terms of Service"
        >
          <div className="flex items-center gap-2">
            <Scale size={14} className="text-indigo-500 group-hover:scale-110 transition-transform" />
            <span>Terms & Conditions</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
            Official
          </span>
        </button>

        <div className="bg-slate-50 dark:bg-slate-800 p-1 rounded-xl flex items-center">
          {(['light', 'dark', 'system'] as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all ${
                theme === t 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title={t.charAt(0).toUpperCase() + t.slice(1) + ' Mode'}
            >
              {t === 'light' && <Sun size={14} />}
              {t === 'dark' && <Moon size={14} />}
              {t === 'system' && <Laptop size={14} />}
            </button>
          ))}
        </div>
        <div className="text-center pt-0.5">
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400">
            CEO & Developer <span className="font-bold text-slate-800 dark:text-slate-200">Muhammad Iqbal Danwar</span>
          </p>
          <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">
            Khairpur Mir&apos;s, Sindh, Pakistan
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[100dvh] w-full max-w-full overflow-hidden bg-[#FDFCFB] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 select-text">
      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col md:hidden"
            >
              {renderSidebar(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Permanent Sidebar */}
      <aside className="w-72 lg:w-80 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col hidden md:flex flex-shrink-0">
        {renderSidebar(false)}
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950 relative transition-colors h-[100dvh] overflow-hidden">
        {/* Header */}
        <header className="h-14 sm:h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-3 sm:px-5 md:px-6 sticky top-0 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md z-20 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
              aria-label="Open sidebar menu"
              title="Open chat sessions"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center text-white dark:text-slate-900 flex-shrink-0 shadow-xs">
                <Sparkles size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-semibold text-xs sm:text-sm md:text-base text-slate-900 dark:text-white leading-tight truncate max-w-[130px] sm:max-w-[200px] md:max-w-xs">
                    {currentSession.title}
                  </h2>
                  <span className="hidden lg:inline-block text-[9px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200/50 dark:border-indigo-800/50">
                    v3.3.1
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold truncate">
                  Danwar AI
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 md:gap-2.5 flex-shrink-0">
            <button
              onClick={createNewChat}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all text-xs font-semibold shadow-xs active:scale-95"
              title="New Chat"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">New</span>
            </button>

            <button
              id="header-about-btn"
              onClick={() => setIsAboutOpen(true)}
              className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition-all text-xs font-semibold active:scale-95 shadow-xs border border-indigo-200/60 dark:border-indigo-800/60"
              title="About Danwar AI, Features & Founder"
            >
              <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline">About</span>
            </button>

            <a
              id="header-updates-btn"
              href="/updates.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-xs font-semibold active:scale-95 shadow-xs border border-slate-200/50 dark:border-slate-700/50"
              title="View New Updates & Release Changelog"
            >
              <Zap size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span className="hidden lg:inline">Updates</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-indigo-600 text-white font-bold hidden sm:inline">v3.3.1</span>
            </a>

            <button
              id="header-terms-btn"
              onClick={() => setIsTermsOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 transition-all text-xs font-medium active:scale-95 shadow-xs border border-slate-200/50 dark:border-slate-700/50"
              title="Official Terms & Conditions"
            >
              <Scale size={14} className="text-indigo-500" />
              <span className="hidden md:inline">Terms</span>
            </button>

            <button
              onClick={exportChatSession}
              disabled={currentSession.messages.length === 0}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-medium active:scale-95 shadow-xs flex items-center gap-1.5"
              title={currentSession.messages.length === 0 ? "No messages to export" : "Export chat session"}
            >
              {isExported ? (
                <Check size={14} className="text-emerald-500" />
              ) : (
                <Download size={14} />
              )}
              <span className="hidden xl:inline">{isExported ? 'Exported!' : 'Export'}</span>
            </button>

            <button
              id="header-delete-history-btn"
              onClick={() => openDeleteSessionModal(currentSession)}
              disabled={currentSession.messages.length === 0 && sessions.length <= 1}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-medium active:scale-95 shadow-xs flex items-center gap-1.5 border border-slate-200/50 dark:border-slate-700/50 hover:border-red-200 dark:hover:border-red-800/60"
              title={currentSession.messages.length === 0 && sessions.length <= 1 ? "No chat history to delete" : "Delete chat history"}
            >
              <Trash2 size={14} className="text-slate-500 hover:text-red-600 dark:text-slate-400" />
              <span className="hidden sm:inline">Delete History</span>
            </button>

            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden xl:inline">Live</span>
            </div>
          </div>
        </header>

        {/* Messages Container */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 space-y-4 sm:space-y-6 scroll-smooth overscroll-contain"
        >
          {currentSession.messages.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 max-w-lg mx-auto py-4 sm:py-6 px-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-900 dark:bg-slate-100 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white dark:text-slate-900 shadow-md">
                <Bot size={26} className="sm:w-8 sm:h-8" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] sm:text-xs font-semibold tracking-wide border border-indigo-200/50 dark:border-indigo-800/50">
                  ⚡ Danwar AI • Intelligent Platform v3.3.1
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pt-0.5">
                  How can Danwar AI help you today?
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                  Analyze songs & audio quality, optimize YouTube SEO, review photos and documents, write code, and answer questions.
                </p>
              </div>

              {/* General AI Utilities Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 w-full pt-1">
                {[
                  '🎧 Review my song audio quality & mix', 
                  '📱 YouTube & Reels Viral SEO & Tags', 
                  '📸 Photo review & YouTube thumbnail feedback',
                  '⚡ Summarize documents & extract key data',
                  '💻 Write & debug clean code',
                  '💡 Brainstorm creative ideas & scripts'
                ].map(suggestion => (
                  <button 
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left shadow-xs active:scale-[0.98]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Quick Links in Welcome Screen */}
              <div className="w-full flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  id="welcome-about-btn"
                  onClick={() => setIsAboutOpen(true)}
                  className="w-full sm:flex-1 py-2 sm:py-2.5 px-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300 font-semibold transition-all shadow-xs group"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span>About Danwar AI</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-600 text-white font-bold">
                    v3.3.1
                  </span>
                </button>

                <button
                  id="welcome-terms-btn"
                  onClick={() => setIsTermsOpen(true)}
                  className="w-full sm:flex-1 py-2 sm:py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 transition-all group shadow-xs"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <ShieldCheck size={14} className="text-indigo-500" />
                    <span>Terms (Sept 7, 2026)</span>
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:underline text-[11px]">
                    Read →
                  </span>
                </button>
              </div>
            </div>
          ) : (
            currentSession.messages.map((message, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                key={message.id}
                className={`flex gap-2.5 sm:gap-4 ${message.role === 'assistant' ? '' : 'flex-row-reverse'}`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-xs border ${
                  message.role === 'assistant' 
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700'
                }`}>
                  {message.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`max-w-[88%] sm:max-w-[82%] md:max-w-[78%] lg:max-w-[72%] space-y-1.5 ${message.role === 'user' ? 'items-end' : ''}`}>
                  {/* Attached files rendering in chat */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="space-y-1.5 mb-1.5">
                      {message.attachments.map((att) => (
                        <div key={att.id}>
                          {att.type === 'audio' ? (
                            <div className="p-2.5 sm:p-3 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col gap-2 max-w-sm">
                              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                                <Music size={15} className="text-emerald-500 flex-shrink-0" />
                                <span className="truncate max-w-[180px]">{att.name}</span>
                                {att.size && <span className="text-[10px] text-slate-400">({(att.size / 1024 / 1024).toFixed(2)} MB)</span>}
                              </div>
                              <audio controls src={att.data} className="w-full h-8 rounded-lg text-xs" />
                            </div>
                          ) : att.type === 'image' ? (
                            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 max-w-xs sm:max-w-sm shadow-xs">
                              <img src={att.data} alt={att.name} className="max-h-52 object-contain w-full bg-black/5 dark:bg-white/5" />
                              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-[10px] sm:text-[11px] text-slate-500 truncate">{att.name}</div>
                            </div>
                          ) : (
                            <div className="p-2.5 sm:p-3 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                              <FileText size={15} className="text-blue-500 flex-shrink-0" />
                              <span className="truncate max-w-[180px] font-medium">{att.name}</span>
                              {att.size && <span className="text-[10px] text-slate-400">({(att.size / 1024).toFixed(1)} KB)</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {message.content ? (
                    <div className={`p-3 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      message.role === 'assistant' 
                        ? 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-800 prose prose-slate dark:prose-invert prose-sm max-w-none break-words' 
                        : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-tr-none break-words'
                    }`}>
                      {message.role === 'assistant' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ node, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              const codeString = String(children || '').replace(/\n$/, '');
                              const isMultiLine = codeString.includes('\n');
                              
                              if (match || isMultiLine) {
                                return (
                                  <CodeBlock
                                    language={match ? match[1] : ''}
                                    value={codeString}
                                  />
                                );
                              }
                              return (
                                <code
                                  className="px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] sm:text-xs font-semibold"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                            pre({ children }: any) {
                              return <div className="not-prose my-2">{children}</div>;
                            },
                            img({ src, alt }: any) {
                              return (
                                <img
                                  src={src}
                                  alt={alt || ''}
                                  className="rounded-xl max-h-96 object-cover my-2 border border-slate-200 dark:border-slate-800"
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                />
                              );
                            }
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </div>
                  ) : message.role === 'assistant' ? (
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2.5">
                      <Loader2 size={15} className="animate-spin text-indigo-500" />
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium animate-pulse">⚡ Danwar AI answers instantly...</span>
                    </div>
                  ) : null}
                  {message.content && (
                    <div className={`flex items-center gap-2 px-1 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => handleSpeakMessage(message.id, message.content)}
                          className={`p-1 rounded-md transition-colors flex items-center gap-1 text-[10px] ${
                            speakingMessageId === message.id 
                              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-semibold' 
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={speakingMessageId === message.id ? "Stop reading aloud" : "Read aloud response"}
                        >
                          {speakingMessageId === message.id ? (
                            <>
                              <VolumeX size={12} className="animate-pulse text-indigo-500" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={12} />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleCopyMessage(message.id, message.content)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-[10px]"
                        title="Copy message text"
                      >
                        {copiedMessageId === message.id ? (
                          <>
                            <Check size={12} className="text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-2.5 sm:p-4 md:p-6 pt-0 bg-white dark:bg-slate-950 transition-colors flex-shrink-0">
          <div className="max-w-4xl mx-auto space-y-2">
            {/* Feature Preset Bar */}
            <FeatureBar 
              activeMode={activeMode}
              onSelectMode={setActiveMode}
              onSelectQuickPrompt={(prompt) => setInput(prompt)}
              onOpenAbout={() => setIsAboutOpen(true)}
            />

            {/* Attachment Preview Chips & Instant File Prompts */}
            {attachments.length > 0 && (
              <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-900 border border-b-0 border-slate-200 dark:border-slate-800 rounded-t-2xl space-y-2">
                <div className="flex flex-wrap gap-2 items-center">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs shadow-xs"
                    >
                      {att.type === 'image' ? (
                        <img src={att.data} alt={att.name} className="w-5 h-5 rounded object-cover" />
                      ) : att.type === 'audio' ? (
                        <Music size={14} className="text-emerald-500 flex-shrink-0" />
                      ) : (
                        <FileText size={14} className="text-blue-500 flex-shrink-0" />
                      )}
                      <span className="max-w-[120px] sm:max-w-[160px] truncate text-slate-700 dark:text-slate-300 font-medium">{att.name}</span>
                      <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">⚡ Ready</span>
                      <button
                        onClick={() => removeAttachment(att.id)}
                        className="text-slate-400 hover:text-red-500 p-0.5 transition-colors"
                        title="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Instant Analysis One-Tap Shortcuts */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 mr-1">
                    ⚡ Instant AI Action:
                  </span>
                  {[
                    '⚡ Fast Summary & Key Insights',
                    '🔍 Detailed Analysis & Correct Review',
                    '💡 Suggestions & Fixes'
                  ].map((quickAction) => (
                    <button
                      key={quickAction}
                      type="button"
                      onClick={() => setInput(quickAction)}
                      className="px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/80 rounded-lg transition-all"
                    >
                      {quickAction}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="audio/*,image/*,.pdf,.doc,.docx,.txt,.md,.csv,.json,.js,.jsx,.ts,.tsx,.html,.css,.py,.c,.cpp,.java,.go,.rs,.sql,.xml"
                className="hidden"
              />
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything, analyze audio, viral SEO, code, photos..."
                className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all resize-none shadow-xs hover:border-slate-300 dark:hover:border-slate-700 ${
                  attachments.length > 0 ? 'rounded-b-2xl py-3 sm:py-3.5 pl-3.5 sm:pl-4.5 pr-22 sm:pr-26' : 'rounded-2xl py-3 sm:py-3.5 pl-3.5 sm:pl-4.5 pr-22 sm:pr-26'
                }`}
                rows={1}
                style={{ minHeight: '50px', maxHeight: '180px' }}
              />
              
              {/* Controls on the right side of chat box */}
              <div className="absolute right-2 sm:right-2.5 bottom-2 sm:bottom-2.5 flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 sm:px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95 flex items-center gap-1 sm:gap-1.5 text-xs font-semibold shadow-xs"
                  title="Upload audio, songs, photos, or documents for review"
                >
                  <Paperclip size={14} />
                  <span className="hidden sm:inline">Files</span>
                </button>
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && attachments.length === 0) || isLoading}
                  className="p-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-slate-900 transition-all shadow-sm active:scale-95 flex items-center justify-center"
                  title="Send message"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2 font-medium uppercase tracking-tight flex items-center justify-center gap-1.5 flex-wrap">
            <span>Danwar AI • 9th Sept 2026 Special</span>
            <span>•</span>
            <button
              id="footer-about-btn"
              onClick={() => setIsAboutOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              About Danwar AI & Features
            </button>
            <span>•</span>
            <button
              id="footer-terms-btn"
              onClick={() => setIsTermsOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>

      {/* Official Terms & Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* About Danwar AI, Features & Architecture Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onSelectFeaturePrompt={(prompt) => setInput(prompt)}
      />

      {/* Delete History & Clear All Confirmation Modal */}
      <DeleteHistoryModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState(prev => ({ ...prev, isOpen: false }))}
        mode={deleteModalState.mode}
        sessionTitle={deleteModalState.sessionTitle}
        messageCount={deleteModalState.messageCount}
        totalSessionsCount={sessions.length}
        onConfirm={handleConfirmDelete}
      />

      {/* Action Feedback Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-semibold shadow-xl backdrop-blur-md flex items-center gap-2 border border-slate-700/50 dark:border-slate-200/50 pointer-events-none"
          >
            <Check size={14} className="text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
