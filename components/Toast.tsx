'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { create } from 'zustand';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastState {
  message: string | null;
  type: ToastType;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'info',
  showToast: (message, type = 'info') => set({ message, type }),
  hideToast: () => set({ message: null }),
}));

export function Toast() {
  const { message, type, hideToast } = useToastStore();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        hideToast();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, hideToast]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/50"
        >
          <Info className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white/90">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
