import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X, ShieldAlert } from 'lucide-react';

export interface DeleteHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'clear-all' | 'delete-session';
  sessionTitle?: string;
  messageCount?: number;
  totalSessionsCount?: number;
  onConfirm: () => void;
}

export const DeleteHistoryModal: React.FC<DeleteHistoryModalProps> = ({
  isOpen,
  onClose,
  mode,
  sessionTitle,
  messageCount = 0,
  totalSessionsCount = 1,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const isClearAll = mode === 'clear-all';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />

          {/* Modal Dialog Card */}
          <motion.div
            id="confirm-delete-history-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-history-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 p-5 sm:p-6 space-y-4"
          >
            {/* Header & Warning Icon */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200/80 dark:border-red-900/50 shadow-xs flex-shrink-0">
                  {isClearAll ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
                </div>
                <div>
                  <h3
                    id="delete-history-modal-title"
                    className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight"
                  >
                    {isClearAll ? 'Clear All Chat History?' : 'Delete Chat History?'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isClearAll ? 'Permanently wipe all conversation sessions' : 'Permanently remove this conversation'}
                  </p>
                </div>
              </div>
              <button
                id="close-delete-modal-btn"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                title="Cancel (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Context Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
              {isClearAll ? (
                <>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    This will delete all <strong className="text-red-600 dark:text-red-400">{totalSessionsCount}</strong> saved chat session(s) from your browser memory on this device.
                  </p>
                  <ul className="text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside text-[11px] pt-1">
                    <li>All conversation threads and messages will be purged immediately.</li>
                    <li>Device local cache will be reset to a fresh blank chat.</li>
                    <li>This action cannot be recovered or undone.</li>
                  </ul>
                </>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Chat Title:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {sessionTitle || 'Untitled Chat'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Stored Messages:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {messageCount} message{messageCount === 1 ? '' : 's'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700/50">
                    Are you sure you want to delete this chat history? This cannot be undone.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                id="cancel-delete-btn"
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40"
              >
                <Trash2 size={14} />
                <span>{isClearAll ? 'Yes, Clear All History' : 'Delete Chat History'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
