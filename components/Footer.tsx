'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, translations } from '@/store/useAppStore';

const BAAI_LOGO = 'https://www.baai.ac.cn/Upfile/File/2025-12-15/6e2b4602-1fef-48bb-921e-77f9a27ab87c..png';

const socialIcons = [
  { name: 'wechat', label: '微信', icon: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088v-.001c-.135-.01-.27-.022-.406-.034zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
    </svg>
  )},
  { name: 'xiaohongshu', label: '小红书', icon: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14h-9a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5zm-7-6v4h2v-4h-2zm3 0v4h2v-4h-2z"/>
    </svg>
  )},
  { name: 'douyin', label: '抖音', icon: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )},
  { name: 'kuaishou', label: '快手', icon: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 14.5c-1.17 0-2.12-.95-2.12-2.12v-4.76c0-1.17.95-2.12 2.12-2.12s2.12.95 2.12 2.12v4.76c0 1.17-.95 2.12-2.12 2.12zm-7 0c-1.17 0-2.12-.95-2.12-2.12v-4.76c0-1.17.95-2.12 2.12-2.12s2.12.95 2.12 2.12v4.76c0 1.17-.95 2.12-2.12 2.12z"/>
    </svg>
  )},
];

export default function Footer() {
  const { language } = useAppStore();
  const t = translations[language].footer;
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  return (
    <footer className="relative bg-[#050505] border-t border-white/[0.04] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[18vw] font-bold text-white/[0.015] whitespace-nowrap tracking-wider">
          BAAI.EI²
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <img src={BAAI_LOGO} alt="BAAI Logo" className="h-9 w-auto" />
              <div className="flex flex-col">
                <span className="text-white font-semibold">智源具身智能</span>
                <span className="text-white/30 text-xs">BAAI Embodied Intelligence</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-white/80 font-medium text-sm">{t.contact}</h3>
              <p className="text-white/40 text-sm">{t.phone}</p>
              <p className="text-white/40 text-sm">{t.email}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white/80 font-medium text-sm">{t.follow}</h3>
              <div className="flex items-center gap-3">
                {socialIcons.map((social) => (
                  <div
                    key={social.name}
                    className="relative"
                    onMouseEnter={() => setHoveredIcon(social.name)}
                    onMouseLeave={() => setHoveredIcon(null)}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-all duration-300 border border-white/[0.04] hover:border-white/[0.08]"
                    >
                      {social.icon}
                    </motion.button>

                    <AnimatePresence>
                      {hoveredIcon === social.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 bg-white rounded-2xl shadow-2xl z-10"
                        >
                          <div className="w-28 h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mb-2">
                            <div className="grid grid-cols-4 gap-1">
                              {[...Array(16)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-5 h-5 rounded-sm ${
                                    Math.random() > 0.35 ? 'bg-gray-800' : 'bg-transparent'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-center text-gray-600 text-xs font-medium">{social.label}</p>
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 rounded-sm" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end items-start md:items-end space-y-6">
            <p className="text-white/40 text-sm">{t.address}</p>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 text-xs text-white/25">
              <span>{t.security}</span>
              <span className="hidden md:inline text-white/10">|</span>
              <span>{t.icp}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Beijing Academy of Artificial Intelligence. All rights reserved.
          </p>
          <Link 
            href="/admin" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white/80 hover:bg-white/[0.08] hover:border-white/20 text-xs transition-all duration-300 group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-blue-400 transition-colors"></span>
            管理后台
          </Link>
        </div>
      </div>
    </footer>
  );
}
