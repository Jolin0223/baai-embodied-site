'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, MapPin, Briefcase, ExternalLink, ArrowRight } from 'lucide-react';
import { useAppStore, translations } from '@/store/useAppStore';
import MediaFallback from '@/components/MediaFallback';
import { useMockData } from '@/hooks/useMockData';

export default function AboutPage() {
  const { language } = useAppStore();
  const t = translations[language].about;
  const data = useMockData();

  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number | null>(null);
  const [newsIndex, setNewsIndex] = useState(0);
  const [isNewsPaused, setIsNewsPaused] = useState(false);

  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const middleZoneTop = viewportHeight * 0.4;
      const middleZoneBottom = viewportHeight * 0.6;

      let closestIndex: number | null = null;
      let closestDistance = Infinity;

      timelineRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const zoneCenter = (middleZoneTop + middleZoneBottom) / 2;
          const distance = Math.abs(elementCenter - zoneCenter);

          if (elementCenter >= middleZoneTop && elementCenter <= middleZoneBottom) {
            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          }
        }
      });

      setActiveTimelineIndex(closestIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [data.history]);

  return (
    <div className="min-h-screen bg-[#050508] overflow-hidden">
      {/* 1. Hero Section - 模仿截图 "Leading AI Innovation" */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 背景光效 */}
        <div className="absolute inset-0 bg-[#000]">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-800/10 rounded-full blur-[100px] mix-blend-screen" />
          {/* 模拟截图中的光线线条 */}
          <div className="absolute inset-0 bg-[url('/bg-lines.png')] opacity-30 bg-cover bg-center mix-blend-overlay" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tight"
          >
            Leading<br />
            AI Innovation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl text-white/80 font-light tracking-widest"
          >
            成为人工智能创新引领者
          </motion.p>
        </div>
      </section>

      {/* 2. 愿景 - 模仿截图黑底白字 */}
      <section className="py-32 px-6 bg-black relative">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold leading-normal mb-8"
          >
            构建物理世界的通用智能底座，推动AI从数字<br/>
            世界迈向物理世界
          </motion.h2>
          <p className="text-white/50 text-xl font-light">开放做研究，开源做生态</p>
        </div>
      </section>

      {/* 3. 机构简介 - 模仿截图蓝卡 */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="section-title-center">机构简介</h2>
        </div>
        
        <div className="max-w-5xl mx-auto relative">
          {/* 背景层叠效果 */}
          <div className="absolute -top-6 left-8 right-8 h-full bg-blue-900/20 rounded-3xl transform scale-95 opacity-50" />
          <div className="absolute -top-3 left-4 right-4 h-full bg-blue-800/30 rounded-3xl transform scale-[0.98] opacity-70" />
          
          {/* 主卡片 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-blue-900 to-blue-950 p-12 md:p-16 rounded-3xl shadow-2xl border border-blue-500/30 overflow-hidden"
          >
            {/* 内部光效 */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none" />
            
            <p className="relative z-10 text-lg md:text-xl text-white/90 leading-relaxed text-justify">
              北京智源人工智能研究院（简称“智源研究院”）是2018年11月成立的非营利性新型研发机构，致力于成为人工智能创新引领者，营造全球最佳的学术和技术创新生态，挑战最基础的问题和最关键的难题，成为全球人工智能学术思想、基础理论、顶尖人才、企业创新和发展政策的源头，促进人类、环境和智能的可持续发展。
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. 发展历程 - 保持原有逻辑但加大字号 */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/[0.05] to-transparent" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="section-title-center">发展历程</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

            <div className="space-y-12">
              {data.history.map((item, idx) => {
                const isActive = activeTimelineIndex === idx;
                return (
                  <motion.div
                    key={idx}
                    ref={(el) => { timelineRefs.current[idx] = el; }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    className={`timeline-node relative flex gap-10 ${isActive ? 'active' : ''}`}
                  >
                    <div className="relative z-10 flex-shrink-0 mt-2">
                      <div className="timeline-dot scale-125" />
                    </div>
                    <div className="flex-1 pb-8">
                      <div className={`timeline-text transition-all duration-400 ${isActive ? 'text-white' : 'text-white/40'}`}>
                        <span className={`text-xl font-bold block mb-3 ${isActive ? 'text-blue-400' : 'text-white/30'}`}>
                          {item.time}
                        </span>
                        <p className="text-lg leading-relaxed font-light">{item.content}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. 加入我们 - 模仿截图蓝条通栏 */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title-center">加入我们</h2>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
            
            <div className="relative z-10 grid lg:grid-cols-2 p-12 md:p-20 items-center gap-16">
              <div>
                <h3 className="text-4xl md:text-5xl font-bold mb-6">加入我们</h3>
                <p className="text-xl text-white/80 mb-10 font-light">共闯科研无人之境 共赴AI变革新征程</p>
                <button className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-blue-500/30">
                  立即加入 <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="group cursor-pointer bg-white/5 hover:bg-white/10 border-b border-white/10 p-6 flex justify-between items-center transition-all">
                  <span className="text-2xl font-medium">社会招聘</span>
                  <ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-2 transition-all" />
                </div>
                <div className="group cursor-pointer bg-white/5 hover:bg-white/10 border-b border-white/10 p-6 flex justify-between items-center transition-all">
                  <span className="text-2xl font-medium">校园招聘</span>
                  <ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-2 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 新闻动态 - 模仿截图左文右图 */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="section-title-center">新闻动态</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* 左侧文字 */}
            <div className="space-y-10">
              <div className="flex gap-4">
                <button className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium shadow-lg shadow-blue-500/25">
                  最新新闻
                </button>
                <button className="px-6 py-2 rounded-full border border-white/20 text-white/60 text-sm hover:bg-white/5 transition-colors">
                  媒体报道
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={newsIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl font-bold leading-tight">
                    {data.news[newsIndex]?.snippet || "智源学者计划再升级，前瞻布局构建全球人工智能“梦之队”"}
                  </h3>
                  <p className="text-xl text-white/50 font-mono">
                    {data.news[newsIndex]?.date || "02.04.2026"}
                  </p>
                  <a 
                    href={data.news[newsIndex]?.link} 
                    target="_blank"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mt-4 group"
                  >
                    查看更多 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              </AnimatePresence>

              {/* 进度条 */}
              <div className="flex gap-2 pt-8">
                {data.news.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setNewsIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      idx === newsIndex ? 'w-12 bg-blue-500' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 右侧大图 */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={newsIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <MediaFallback
                    src={data.news[newsIndex]?.cover}
                    type="image"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
