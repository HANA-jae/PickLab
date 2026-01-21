import { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast, { ToastType } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import PromptModal from '../components/PromptModal';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
  showPrompt: (message: string, options?: PromptOptions) => Promise<string | null>;
}

interface ConfirmOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface PromptOptions {
  title?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirm, setConfirm] = useState<{
    message: string;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);
  const [prompt, setPrompt] = useState<{
    message: string;
    options: PromptOptions;
    resolve: (value: string | null) => void;
  } | null>(null);

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const showConfirm = (message: string, options: ConfirmOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirm({ message, options, resolve });
    });
  };

  const showPrompt = (message: string, options: PromptOptions = {}): Promise<string | null> => {
    return new Promise((resolve) => {
      setPrompt({ message, options, resolve });
    });
  };

  const handleConfirm = (value: boolean) => {
    if (confirm) {
      confirm.resolve(value);
      setConfirm(null);
    }
  };

  const handlePrompt = (value: string | null) => {
    if (prompt) {
      prompt.resolve(value);
      setPrompt(null);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirm, showPrompt }}>
      {children}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            message={confirm.message}
            title={confirm.options.title}
            confirmText={confirm.options.confirmText}
            cancelText={confirm.options.cancelText}
            type={confirm.options.type}
            onConfirm={() => handleConfirm(true)}
            onCancel={() => handleConfirm(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {prompt && (
          <PromptModal
            message={prompt.message}
            title={prompt.options.title}
            placeholder={prompt.options.placeholder}
            defaultValue={prompt.options.defaultValue}
            confirmText={prompt.options.confirmText}
            cancelText={prompt.options.cancelText}
            onConfirm={(value) => handlePrompt(value)}
            onCancel={() => handlePrompt(null)}
          />
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
