'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, ExternalLink, Play } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useMockData } from '@/hooks/useMockData';
import Image from 'next/image';
import MediaFallback from '@/components/MediaFallback';

type BrainCategory = '时空推理' | '具身交互';
type CerebellumCategory = '末端操作' | '移动操作' | '视觉导航' | '全身控制';

const partners = [
  '智元机器人', '中国联通', '星海图', '乐聚机器人', '宇树科技', 
  '傅利叶', 'Unitree', '小米', '华为', '百度',
  '阿里巴巴', '腾讯', '字节跳动', '商汤科技', '旷视科技'
];

function VideoPlaceholder({ title, cover, videoUrl, onPlay }: { title: string; cover?: string; videoUrl?: string; onPlay?: () => void }) {
  return (
    <div 
      className="video-placeholder group cursor-pointer flex flex-col gap-4 pb-4"
      onClick={onPlay}
    >
      {/* 封面图区域 - 4:3 比例 */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 aspect-[4/3] w-full">
        {cover ? (
          <MediaFallback 
            src={cover} 
            type="image" 
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-80 group-hover:opacity-60"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        )}
        
        {/* 播放按钮悬浮在封面中央 */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-black/30 backdrop-blur-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:border-blue-400 transition-all duration-300 shadow-lg">
            <Play className="w-5 h-5 text-white ml-1 fill-white" />
          </div>
        </div>
      </div>
      
      {/* 标题 - 放在下方 */}
      <div className="px-1">
        <span className="text-sm font-medium text-white/90 line-clamp-2 leading-relaxed drop-shadow-md">
          {title}
        </span>
      </div>
    </div>
  );
}

// 通用图片占位符组件 - 支持传入 src
function ImagePlaceholder({ src, className = '' }: { src?: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        <Image
          src={src} 
          alt="Placeholder" 
          fill 
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 flex items-center justify-center">
          <div className="w-16 h-16 border border-white/10 rounded-2xl flex items-center justify-center bg-white/5 backdrop-blur-sm">
            <div className="text-white/20 text-xs">No Image</div>
          </div>
        </div>
      )}
    </div>
  );
}

import VideoModal from '@/components/VideoModal';

// ... existing code ...

export default function HomePage() {
  const mockData = useMockData();
  const [activeBrainCategory, setActiveBrainCategory] = useState<BrainCategory | null>(null);
  const [activeCerebellumCategory, setActiveCerebellumCategory] = useState<CerebellumCategory | null>(null);
  const [casesIndex, setCasesIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: ''
  });

  // ... existing code ...

  const handlePlayVideo = (title: string, url?: string) => {
    if (url) {
      setVideoModal({ isOpen: true, url, title });
    }
  };

  const brainCategories: { key: BrainCategory; title: string; desc: string; icon: string }[] = [
    { key: '时空推理', title: '强大的时空推理能力', desc: '支持3D空间的绝对尺度理解，可拆解长程的、模糊的具身指令', icon: '/icons/spatial-reasoning.png' },
    { key: '具身交互', title: '可打断、能记忆的具身交互', desc: '支持边听边说、问答打断、结合用户信息进行个性化交互', icon: '/icons/interaction.png' },
  ];

  const cerebellumCategories: { key: CerebellumCategory; title: string; desc: string; icon: string }[] = [
    { key: '末端操作', title: '端到端灵巧操作模型', desc: '支持长程任务拆解与执行的端到端VLA模型', icon: '/icons/robot-arm.png' },
    { key: '移动操作', title: '长程、连续的移动操作', desc: '处理长程复杂任务的移动操作能力', icon: '/icons/wheeled-robot.png' },
    { key: '视觉导航', title: '强空间理解的视觉导航', desc: '仅依赖于图像输入的无图导航系统', icon: '/icons/navigation.png' },
    { key: '全身控制', title: '高动态、强交互的全身控制', desc: '支持长时间、高动态场景的人形全身控制', icon: '/icons/humanoid.png' },
  ];

  const filteredBrainVideos = activeBrainCategory
    ? mockData.brainVideos.filter((v: any) => v.category === activeBrainCategory)
    : [];

  const filteredCerebellumVideos = activeCerebellumCategory
    ? mockData.cerebellumVideos.filter((v: any) => v.category === activeCerebellumCategory)
    : [];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCasesIndex((prev) => (prev + 1) % mockData.cases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, mockData.cases.length]);

  return (
    <div className="min-h-screen bg-[#050508]">
      <VideoModal 
        isOpen={videoModal.isOpen} 
        onClose={() => setVideoModal({ ...videoModal, isOpen: false })} 
        videoUrl={videoModal.url}
        title={videoModal.title}
      />
      {/* ===== Banner ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/banner-bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050508] to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl lg:text-5xl font-bold leading-[1.2] mb-6">
              <span className="text-white">开源开放的</span><br/>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">具身智能</span>
              <span className="text-white">全栈解决方案</span>
          </h1>
            <p className="text-lg text-white/50 leading-relaxed">
              智源研究院以大脑为核心，构建了一套自下而上的全栈技术解决方案
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] text-white/30 uppercase tracking-widest">向下滚动</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* ===== 具身大脑 ===== */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* 居中标题 */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src="/icons/brain.png" alt="具身大脑" className="w-16 h-16 object-contain" />
            </div>
            <h2 className="section-title-center">具身大脑</h2>
            <p className="section-subtitle">强大的时空推理和双工交互</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* 左侧分类列表 */}
            <div className="space-y-4">
              {brainCategories.map((category, idx) => {
                const isActive = activeBrainCategory === category.key;
                return (
                  <motion.div 
                    key={category.key}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setActiveBrainCategory(isActive ? null : category.key)}
                    className={`category-item ${isActive ? 'active' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden ${
                          isActive ? 'bg-blue-500/20' : 'bg-white/5'
                        }`}>
                          <img src={category.icon} alt={category.title} className="w-10 h-10 object-contain" />
                        </div>
                        <div>
                          <h3 className={`font-semibold mb-1 ${isActive ? 'text-blue-300' : 'text-white/90'}`}>
                            {category.title}
                          </h3>
                          <p className="text-sm text-white/40">{category.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${
                        isActive ? 'rotate-90 text-blue-400' : 'text-white/30'
                      }`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* 右侧视频展示区 */}
            <div className="min-h-[320px]">
              <AnimatePresence mode="wait">
                {activeBrainCategory && filteredBrainVideos.length > 0 ? (
                  <motion.div
                    key="videos"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="glass-card p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-white/80 font-medium">
                        {brainCategories.find(c => c.key === activeBrainCategory)?.title}
                      </h4>
                      <button 
                        onClick={() => setActiveBrainCategory(null)} 
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-white/50" />
                      </button>
                    </div>
                    <div className={`grid gap-4 ${filteredBrainVideos.length === 1 ? 'grid-cols-1 max-w-[80%] mx-auto' : 'grid-cols-2'}`}>
                      {filteredBrainVideos.map((video: any, idx: number) => (
                        <VideoPlaceholder 
                          key={idx} 
                          title={video.title} 
                          cover={video.cover}
                          videoUrl={video.videoUrl}
                          onPlay={() => handlePlayVideo(video.title, video.videoUrl)}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full min-h-[320px] relative rounded-2xl overflow-hidden border border-white/10"
                  >
                    <Image 
                      src="/placeholders/brain-empty.png" 
                      alt="点击左侧分类查看详情" 
                      fill 
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 backdrop-blur-md border border-white/10 px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        <p className="text-white font-medium tracking-wide text-base flex items-center gap-3">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                          </span>
                          点击左侧分类查看详情
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RoboOS ===== */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src="/icons/roboos.png" alt="RoboOS" className="w-20 h-20 object-contain" />
            </div>
            <h2 className="section-title-center">自研全球首个大小脑协作框架RoboOS</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '多智能体协作', desc: '通过云端统一的大脑模型 + 本地技能执行，多机器人可完成分工协作、互补执行、链式任务', icon: '/icons/multi-agent.png' },
              { title: '长时间任务规划', desc: '将长时间、长链条任务分拆为可执行的原子子任务，为多机器人分配合理调度顺序', icon: '/icons/task-planning.png' },
              { title: '跨形体适配', desc: '支持单臂、双臂、仿人、轮式等多形体，通过统一接口执行任务，实现"一套模型，多种机器人"', icon: '/icons/cross-body.png' },
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="highlight-card p-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 overflow-hidden">
                  <img src={item.icon} alt={item.title} className="w-12 h-12 object-contain" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 具身小脑 ===== */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src="/icons/cerebellum.png" alt="具身小脑" className="w-16 h-16 object-contain" />
            </div>
            <h2 className="section-title-center">具身小脑</h2>
            <p className="section-subtitle">
              兼顾 <span className="text-blue-400 font-semibold">分层式</span> 和 <span className="text-cyan-400 font-semibold">端到端</span> 两种技术路线，支持跨本体
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* 左侧视频展示区 */}
            <div className="min-h-[400px] order-2 lg:order-1">
              <AnimatePresence mode="wait">
                {activeCerebellumCategory && filteredCerebellumVideos.length > 0 ? (
                  <motion.div
                    key="videos"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="glass-card p-6 h-full"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-white/80 font-medium">
                        {cerebellumCategories.find(c => c.key === activeCerebellumCategory)?.title}
                      </h4>
                      <button 
                        onClick={() => setActiveCerebellumCategory(null)} 
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-white/50" />
                      </button>
                    </div>
                    <div className={`grid gap-4 ${filteredCerebellumVideos.length === 1 ? 'grid-cols-1 max-w-[80%] mx-auto' : 'grid-cols-2'}`}>
                      {filteredCerebellumVideos.map((video: any, idx: number) => (
                        <VideoPlaceholder 
                          key={idx} 
                          title={video.title} 
                          cover={video.cover}
                          videoUrl={video.videoUrl}
                          onPlay={() => handlePlayVideo(video.title, video.videoUrl)}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full min-h-[400px] relative rounded-2xl overflow-hidden border border-white/10"
          >
            <Image
                      src="/placeholders/brain-empty.png" 
                      alt="点击左侧分类查看详情" 
                      fill 
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 backdrop-blur-md border border-white/10 px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        <p className="text-white font-medium tracking-wide text-base flex items-center gap-3">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                          </span>
                          点击右侧分类查看详情
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 右侧分类列表 */}
            <div className="space-y-3 order-1 lg:order-2">
              {cerebellumCategories.map((category, idx) => {
                const isActive = activeCerebellumCategory === category.key;
                return (
                  <motion.div 
                    key={category.key}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setActiveCerebellumCategory(isActive ? null : category.key)}
                    className={`category-item ${isActive ? 'active' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden ${
                          isActive ? 'bg-cyan-500/20' : 'bg-white/5'
                        }`}>
                          <img src={category.icon} alt={category.title} className="w-8 h-8 object-contain" />
                        </div>
                        <div>
                          <h3 className={`font-medium text-sm mb-0.5 ${isActive ? 'text-cyan-300' : 'text-white/90'}`}>
                            {category.title}
                          </h3>
                          <p className="text-xs text-white/40">{category.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        isActive ? 'rotate-90 text-cyan-400' : 'text-white/30'
                      }`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 一体化数采平台 ===== */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src="/icons/data-platform.png" alt="一体化数采平台" className="w-16 h-16 object-contain" />
            </div>
            <h2 className="section-title-center">一体化数采平台</h2>
            <p className="section-subtitle">RoboXstudio</p>
          </div>

          <div className="highlight-card p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-white/60 leading-relaxed mb-8">
                  跨本体、跨场景、跨任务的一站式数采平台，支持多种机器人形态的数据采集、标注、管理和分发。
                </p>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="stat-number">10+</div>
                    <div className="stat-label">支持本体</div>
                  </div>
                  <div>
                    <div className="stat-number">50+</div>
                    <div className="stat-label">采集场景</div>
                  </div>
                  <div>
                    <div className="stat-number">1M+</div>
                    <div className="stat-label">数据条目</div>
                  </div>
                </div>
              </div>
              <ImagePlaceholder src="/placeholders/data-platform-bg.png" className="aspect-video rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 具身评测平台 ===== */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src="/icons/eval-platform.png" alt="具身评测平台" className="w-16 h-16 object-contain" />
            </div>
            <h2 className="section-title-center">具身评测平台</h2>
            <p className="section-subtitle">EmbodiedVerse</p>
          </div>

          <div className="highlight-card p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ImagePlaceholder src="/placeholders/eval-platform-bg.png" className="aspect-video rounded-xl order-2 md:order-1" />
              <div className="order-1 md:order-2">
                <p className="text-white/60 leading-relaxed mb-8">
                  全面衡量具身模型能力的评测体系，覆盖感知、规划、控制等多个维度。
                </p>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="stat-number">50+</div>
                    <div className="stat-label">能力维度</div>
                  </div>
                  <div>
                    <div className="stat-number">4</div>
                    <div className="stat-label">大评测领域</div>
                  </div>
                  <div>
                    <div className="stat-number">20+</div>
                    <div className="stat-label">评测任务</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 训推一体框架 ===== */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="section-title-center">训推一体框架</h2>
            <p className="section-subtitle">FlagScale 系列</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'FlagScale', desc: '异构并行分布式训练框架', stats: '支持万卡训练' },
              { name: 'FlagInfer', desc: '高性能大模型推理框架', stats: '推理加速10x' },
              { name: 'FlagGems', desc: '多芯片适配工具库', stats: '支持13+芯片' },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-8 overflow-hidden hover:border-blue-500/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors duration-500" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{item.name}</h3>
                  <p className="text-sm text-white/50 mb-6 leading-relaxed min-h-[40px]">{item.desc}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    {item.stats}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 合作生态 ===== */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="text-center">
            <h2 className="section-title-center">合作生态</h2>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050508] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050508] to-transparent z-10" />
          
          <div className="flex animate-scroll-left">
            {[...partners, ...partners].map((partner, idx) => (
              <div 
                key={idx} 
                className="mx-3 px-6 py-3 rounded-full border border-white/10 bg-white/[0.02] text-white/50 whitespace-nowrap text-sm hover:border-blue-500/30 hover:text-white/70 transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 应用案例 ===== */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title-center">应用案例</h2>
          </div>

          <div 
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="overflow-hidden">
              <motion.div 
                className="flex gap-6"
                animate={{ x: `-${casesIndex * 340}px` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {[...mockData.cases, ...mockData.cases].map((caseItem: any, idx: number) => (
                  <div key={idx} className="w-[320px] flex-shrink-0 group">
                    <div className="glass-card overflow-hidden">
                      <div className="aspect-[4/3] relative">
                        <MediaFallback 
                          src={caseItem.photo} 
                          type="image" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
                          <span className="text-white text-sm flex items-center gap-2 btn-primary py-2 px-4">
                            了解详情 <ExternalLink className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="absolute top-3 left-3 px-3 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                          {caseItem.keyword}
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {caseItem.logo}
                        </h4>
                        <p className="text-sm text-white/40 line-clamp-2">{caseItem.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* 轮播导航 */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button 
                onClick={() => setCasesIndex(Math.max(0, casesIndex - 1))}
                className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-30"
                disabled={casesIndex === 0}
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex gap-2">
                {mockData.cases.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCasesIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === casesIndex % mockData.cases.length
                        ? 'w-6 bg-blue-500'
                        : 'w-1.5 bg-white/20 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <button 
                onClick={() => setCasesIndex((prev) => (prev + 1) % mockData.cases.length)}
                className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
