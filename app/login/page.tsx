'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, QrCode, RefreshCw, Check, Eye, EyeOff } from 'lucide-react';
import { useAppStore, translations } from '@/store/useAppStore';

const BAAI_LOGO = 'https://www.baai.ac.cn/Upfile/File/2025-12-15/6e2b4602-1fef-48bb-921e-77f9a27ab87c..png';

export default function LoginPage() {
  const { language } = useAppStore();
  const t = translations[language].login;

  const [loginType, setLoginType] = useState<'phone' | 'wechat'>('wechat');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [qrStatus, setQrStatus] = useState<'waiting' | 'scanned' | 'confirmed'>('waiting');

  const phoneInputRef = useRef<HTMLInputElement>(null);

  const isPhoneValid = /^1[3-9]\d{9}$/.test(phone);
  const isCodeValid = /^\d{6}$/.test(code);
  const canLogin = isPhoneValid && isCodeValid && agreed;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validatePhone = (value: string) => {
    setPhone(value);
    if (value && !/^1[3-9]\d{9}$/.test(value)) {
      setPhoneError(t.phoneError);
    } else {
      setPhoneError('');
    }
  };

  const handleGetCode = () => {
    if (!isPhoneValid) {
      setPhoneError(t.phoneError);
      return;
    }
    setCountdown(60);
  };

  const handleLogin = () => {
    if (!canLogin) return;
    console.log('Login with:', { phone, code });
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-cyan-900/30" />
        <div className="absolute inset-0 tech-grid opacity-30" />
        
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)' }}
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)' }}
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center backdrop-blur-xl border border-white/10">
              <svg viewBox="0 0 80 80" className="w-16 h-16">
                <defs>
                  <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <circle cx="40" cy="25" r="12" fill="url(#brainGrad)" opacity="0.8" />
                <path d="M20 45 L40 55 L60 45" stroke="url(#brainGrad)" strokeWidth="3" fill="none" />
                <path d="M25 55 L40 65 L55 55" stroke="url(#brainGrad)" strokeWidth="2" fill="none" opacity="0.6" />
                <circle cx="40" cy="40" r="4" fill="url(#brainGrad)" />
                <line x1="40" y1="28" x2="40" y2="36" stroke="url(#brainGrad)" strokeWidth="2" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">智源具身智能</h2>
            <p className="text-white/50 text-lg max-w-sm">
              开源开放的具身智能全栈解决方案
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-6 w-full max-w-md"
          >
            {['RoboBrain', 'RoboOS', 'EI²Data'].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <span className="text-blue-400 text-sm font-bold">{item[0]}</span>
                </div>
                <span className="text-white/40 text-xs">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#0a0a0a]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <img src={BAAI_LOGO} alt="BAAI Logo" className="h-10 w-auto" />
            <span className="text-white font-semibold text-lg">智源具身智能</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-white/40 text-sm mb-8">{t.autoRegister}</p>

          <div className="flex gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-8">
            <button
              onClick={() => setLoginType('wechat')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                loginType === 'wechat'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              <QrCode className="w-4 h-4" />
              {t.wechatLogin}
            </button>
            <button
              onClick={() => setLoginType('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                loginType === 'phone'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              {t.phoneLogin}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {loginType === 'wechat' ? (
              <motion.div
                key="wechat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="card-premium p-8 flex flex-col items-center">
                  <div className="w-48 h-48 rounded-2xl bg-white flex items-center justify-center mb-6 relative overflow-hidden">
                    <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <div className="grid grid-cols-5 gap-1">
                        {[...Array(25)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 rounded-sm ${
                              Math.random() > 0.3 ? 'bg-gray-800' : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {qrStatus === 'scanned' && (
                      <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center">
                        <Check className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>

                  <p className="text-white/60 text-sm text-center">
                    {qrStatus === 'waiting' && t.scanCode}
                    {qrStatus === 'scanned' && t.confirmLogin}
                    {qrStatus === 'confirmed' && t.loginSuccess}
                  </p>

                  <button className="mt-4 flex items-center gap-2 text-white/40 hover:text-white/60 text-sm transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    刷新二维码
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <div className="relative">
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      value={phone}
                      onChange={(e) => validatePhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      placeholder={t.phonePlaceholder}
                      className={`input-premium pr-4 ${phoneError ? 'border-red-500/50' : ''}`}
                    />
                  </div>
                  {phoneError && (
                    <p className="mt-2 text-red-400 text-xs">{phoneError}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder={t.codePlaceholder}
                    className="input-premium flex-1"
                  />
                  <button
                    onClick={handleGetCode}
                    disabled={!isPhoneValid || countdown > 0}
                    className={`px-6 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      isPhoneValid && countdown === 0
                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                        : 'bg-white/5 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {countdown > 0 ? `${t.resend}(${countdown}s)` : t.getCode}
                  </button>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={!canLogin}
                  className={`w-full py-4 rounded-xl text-sm font-medium transition-all ${
                    canLogin
                      ? 'btn-premium'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {t.loginBtn}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${
                  agreed
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-white/20 group-hover:border-white/40'
                }`}
              >
                {agreed && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-white/40 text-sm leading-relaxed">
                {t.agreement}
                <a href="#" className="text-blue-400 hover:underline">{t.userAgreement}</a>
                和
                <a href="#" className="text-blue-400 hover:underline">{t.privacyPolicy}</a>
              </span>
            </label>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
