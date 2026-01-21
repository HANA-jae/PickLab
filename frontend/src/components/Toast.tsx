import { motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
}

export default function Toast({ message, type }: ToastProps) {
  const config = {
    success: { bg: 'bg-green-600', icon: '✓' },
    error: { bg: 'bg-red-600', icon: '✕' },
    info: { bg: 'bg-blue-600', icon: 'ℹ' },
    warning: { bg: 'bg-yellow-600', icon: '⚠' },
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className={`${config.bg} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-[500px]`}>
        <div className="text-2xl font-bold">{config.icon}</div>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
