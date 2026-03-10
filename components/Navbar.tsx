'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore, translations } from '@/store/useAppStore';
import { useToastStore } from '@/components/Toast';

const BAAI_LOGO = 'https://www.baai.ac.cn/Upfile/File/2025-12-15/6e2b4602-1fef-48bb-921e-77f9a27ab87c..png';

const navItems = [
  { key: 'home', href: '/' },
  { key: 'openSource', href: '/open-source' },
  { key: 'research', href: '/research' },
  { key: 'about', href: '/about' },
  { key: 'login', href: '/login' },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const { theme, language } = useAppStore();
  const { showToast } = useToastStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = translations[language].nav;

  // 首页透明，滚动后变黑；其他页面默认黑色背景
  const isHomePage = pathname === '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFeatureUnavailable = () => {
    showToast('敬请期待~');
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-transparent" />
    );
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHomePage
          ? 'bg-black/60 backdrop-blur-2xl border-b border-white/[0.06]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src={BAAI_LOGO} 
                alt="BAAI Logo" 
                className="h-9 w-auto transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-white font-semibold text-[15px] tracking-tight">智源具身智能</span>
              <span className="text-white/40 text-[11px] tracking-wide">BAAI Embodied Intelligence</span>
            </div>
          </Link>

          <div className="flex items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {t[item.key as keyof typeof t]}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFeatureUnavailable}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all duration-300 border border-white/[0.06] hover:border-white/[0.12]"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-[18px] h-[18px] text-amber-400/80" />
              ) : (
                <Moon className="w-[18px] h-[18px] text-blue-400/80" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFeatureUnavailable}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all duration-300 border border-white/[0.06] hover:border-white/[0.12]"
            >
              <Globe className="w-[16px] h-[16px] text-white/50" />
              <span className="text-[13px] text-white/70 font-medium">
                {language === 'zh' ? 'EN' : '中'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
