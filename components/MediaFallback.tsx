'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BAAI_LOGO = 'https://www.baai.ac.cn/Upfile/File/2025-12-15/6e2b4602-1fef-48bb-921e-77f9a27ab87c..png';

interface MediaFallbackProps {
  src: string;
  type: 'image' | 'video';
  cover?: string;
  title?: string;
  className?: string;
  onPlay?: () => void;
  isPlaying?: boolean;
}

export default function MediaFallback({
  src,
  type,
  cover,
  title,
  className = '',
  onPlay,
  isPlaying = false,
}: MediaFallbackProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isPlaying && videoRef.current && playing) {
      videoRef.current.pause();
      setPlaying(false);
    }
  }, [isPlaying, playing]);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
  };

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
        setPlaying(false);
      } else {
        onPlay?.();
        videoRef.current.play();
        setPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(prog);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  if (error) {
    return (
      <div className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 ${className}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
        </div>
        <img src={BAAI_LOGO} alt="BAAI Logo" className="w-12 h-12 mb-4 object-contain opacity-60" />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          重试
        </motion.button>
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center"
            >
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
        <img
          src={src}
          alt={title || ''}
          className={`w-full h-full object-cover transition-all duration-500 ${loading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative group overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center z-10"
          >
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {cover && !playing && (
        <div className="absolute inset-0 z-10">
          <img
            src={cover}
            alt={title || ''}
            className="w-full h-full object-cover"
            onError={handleError}
          />
          <motion.div 
            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={togglePlay}
          >
            <motion.div 
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </motion.div>
          </motion.div>
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        muted={muted}
        loop
        playsInline
        className="w-full h-full object-cover"
        onLoadedData={handleLoad}
        onError={handleError}
        onTimeUpdate={handleTimeUpdate}
      />

      <AnimatePresence>
        {playing && showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4"
          >
            <div 
              className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer overflow-hidden group/progress"
              onClick={handleProgressClick}
            >
              <motion.div 
                className="h-full bg-blue-500 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
              </motion.div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {playing ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white fill-white" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {muted ? (
                    <VolumeX className="w-5 h-5 text-white/70" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Maximize className="w-5 h-5 text-white/70" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {title && !playing && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
      )}
    </div>
  );
}
