'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';
type Language = 'zh' | 'en';

interface AppState {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
  toggleLanguage: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'zh',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      toggleLanguage: () =>
        set((state) => ({ language: state.language === 'zh' ? 'en' : 'zh' })),
    }),
    {
      name: 'baai-app-storage',
    }
  )
);

export const translations = {
  zh: {
    nav: {
      home: '首页',
      openSource: '开源',
      research: '研究',
      about: '关于我们',
      login: '登录',
    },
    banner: {
      title: '开源开放的具身智能全栈解决方案',
      subtitle: '智源研究院以大脑为核心，构建了一套自下而上的全栈技术解决方案',
    },
    brain: {
      title: '具身大脑',
      subtitle: '强大的时空推理和双工交互',
      spatialTitle: '强大的时空推理能力',
      spatialDesc: '支持3D空间的绝对尺度理解，可拆解长程的、模糊的具身指令',
      interactionTitle: '可打断、能记忆的具身交互',
      interactionDesc: '支持边听边说、问答打断、结合用户信息和社会关系进行个性化交互',
      viewDetails: '查看详情',
    },
    cerebellum: {
      title: '具身小脑',
      subtitle: '兼顾分层式和端到端两种技术路线，支持跨本体',
      dexterous: '端到端灵巧操作模型',
      dexterousDesc: '支持长程任务拆解与执行的端到端VLA模型',
      mobile: '长程、连续的移动操作',
      mobileDesc: '处理长程复杂任务的移动操作能力',
      navigation: '强空间理解的视觉导航',
      navigationDesc: '仅依赖于图像输入的无图导航系统，可识别模糊指令、动态避障',
      fullBody: '高动态、强交互的全身控制',
      fullBodyDesc: '支持长时间、高动态、强交互场景的人形全身控制模型',
    },
    platforms: {
      dataTitle: '一体化数采平台',
      dataDesc: '跨本体、跨场景、跨任务的一站式数采平台',
      evalTitle: '具身评测平台',
      evalDesc: '全面衡量具身模型在感知-理解-表达与感知-决策-执行链条中的综合能力表现',
      trainTitle: '训推一体框架',
      trainDesc: '优化具身模型训推部署',
      learnMore: '了解详情',
    },
    cases: {
      title: '应用案例',
      viewDetails: '了解详情',
    },
    openSource: {
      title: '开源',
      searchPlaceholder: '请输入关键词搜索智源具身开源工作...',
      techReport: '技术报告',
      experience: '能力体验',
      apply: '申请试用',
      history: '历史版本',
      noResults: '暂无匹配结果',
      back: '返回',
    },
    research: {
      title: '研究',
      searchPlaceholder: '请输入关键词搜索智源具身研究工作...',
      noResults: '暂无匹配结果',
      back: '返回',
    },
    about: {
      title: '关于我们',
      heroText: '构建物理世界的通用智能底座，推动AI从数字世界迈向物理世界',
      heroSubText: '开放做研究，开源做生态',
      whoWeAre: '我们是谁',
      whoWeAreContent: '北京智源人工智能研究院是一个非营利性研发机构，从2021年发布"悟道"系列填补了中文超大预训练模型生态的空白，到2025年发布"悟界"系列引领具身智能，智源研究院一直聚焦人工智能技术从数字世界到物理世界的规模化落地，打造了一套包含模型、数据、评测的开源具身智能全栈解决方案。',
      timeline: '发展历程',
      timelineDesc: '推动人工智能技术从数字世界到物理世界的规模化落地',
      viewMore: '查看更多',
      news: '新闻报道',
      jobs: '招纳贤士',
      noJobs: '暂无在招岗位，欢迎关注后续动态',
      viewDetails: '查看详情',
    },
    login: {
      title: '欢迎登录智源具身智能官网',
      phoneLogin: '手机号登录',
      wechatLogin: '微信二维码登录',
      phonePlaceholder: '请输入手机号',
      codePlaceholder: '请输入验证码',
      getCode: '获取验证码',
      resend: '重新发送',
      loginBtn: '登录',
      agreement: '我已阅读并同意',
      userAgreement: '《用户协议》',
      privacyPolicy: '《隐私政策》',
      autoRegister: '未注册账号将自动创建账号',
      scanCode: '请使用微信扫一扫登录',
      confirmLogin: '请在微信中确认登录',
      loginSuccess: '登录成功，正在跳转...',
      phoneError: '请输入正确的手机号',
    },
    footer: {
      contact: '联系我们',
      phone: '010-82362616',
      email: 'ei2@baai.ac.cn',
      follow: '关注我们',
      address: '北京市海淀区成府路150号智源大厦',
      security: '京公网安备 11010802045062',
      icp: '京ICP备19012194号-1',
    },
  },
  en: {
    nav: {
      home: 'Home',
      openSource: 'Open Source',
      research: 'Research',
      about: 'About Us',
      login: 'Login',
    },
    banner: {
      title: 'Open-Source Full-Stack Embodied Intelligence Solution',
      subtitle: 'BAAI builds a bottom-up full-stack technical solution with the brain as the core',
    },
    brain: {
      title: 'Embodied Brain',
      subtitle: 'Powerful spatiotemporal reasoning and duplex interaction',
      spatialTitle: 'Powerful Spatiotemporal Reasoning',
      spatialDesc: 'Supports absolute scale understanding of 3D space, can decompose long-horizon and ambiguous embodied instructions',
      interactionTitle: 'Interruptible and Memory-enabled Interaction',
      interactionDesc: 'Supports listening while speaking, Q&A interruption, personalized interaction combined with user information',
      viewDetails: 'View Details',
    },
    cerebellum: {
      title: 'Embodied Cerebellum',
      subtitle: 'Balancing hierarchical and end-to-end technical routes, supporting cross-embodiment',
      dexterous: 'End-to-End Dexterous Manipulation',
      dexterousDesc: 'End-to-end VLA model supporting long-horizon task decomposition and execution',
      mobile: 'Long-horizon Continuous Mobile Manipulation',
      mobileDesc: 'Mobile manipulation capability for long-horizon complex tasks',
      navigation: 'Visual Navigation with Strong Spatial Understanding',
      navigationDesc: 'Map-free navigation system relying only on image input, with fuzzy instruction recognition and dynamic obstacle avoidance',
      fullBody: 'High-Dynamic Full-Body Control',
      fullBodyDesc: 'Humanoid full-body control model for long-duration, high-dynamic, interactive scenarios',
    },
    platforms: {
      dataTitle: 'Integrated Data Collection Platform',
      dataDesc: 'One-stop data collection platform across embodiments, scenarios, and tasks',
      evalTitle: 'Embodied Evaluation Platform',
      evalDesc: 'Comprehensive measurement of embodied model capabilities in perception-understanding-expression and perception-decision-execution chains',
      trainTitle: 'Training-Inference Framework',
      trainDesc: 'Optimized embodied model training and inference deployment',
      learnMore: 'Learn More',
    },
    cases: {
      title: 'Application Cases',
      viewDetails: 'Learn More',
    },
    openSource: {
      title: 'Open Source',
      searchPlaceholder: 'Search BAAI embodied open source projects...',
      techReport: 'Tech Report',
      experience: 'Try It',
      apply: 'Apply',
      history: 'History',
      noResults: 'No matching results',
      back: 'Back',
    },
    research: {
      title: 'Research',
      searchPlaceholder: 'Search BAAI embodied research...',
      noResults: 'No matching results',
      back: 'Back',
    },
    about: {
      title: 'About Us',
      heroText: 'Building the universal intelligent foundation for the physical world, advancing AI from digital to physical',
      heroSubText: 'Open research, Open source ecosystem',
      whoWeAre: 'Who We Are',
      whoWeAreContent: 'Beijing Academy of Artificial Intelligence (BAAI) is a non-profit R&D institution. From releasing the "WuDao" series in 2021 to fill the gap in Chinese large-scale pre-training models, to releasing the "WuJie" series in 2025 to lead embodied intelligence, BAAI has been focusing on scaling AI technology from digital to physical world.',
      timeline: 'Development History',
      timelineDesc: 'Advancing AI technology from digital to physical world at scale',
      viewMore: 'View More',
      news: 'News',
      jobs: 'Careers',
      noJobs: 'No positions available, stay tuned',
      viewDetails: 'View Details',
    },
    login: {
      title: 'Welcome to BAAI Embodied Intelligence',
      phoneLogin: 'Phone Login',
      wechatLogin: 'WeChat QR Login',
      phonePlaceholder: 'Enter phone number',
      codePlaceholder: 'Enter verification code',
      getCode: 'Get Code',
      resend: 'Resend',
      loginBtn: 'Login',
      agreement: 'I have read and agree to',
      userAgreement: 'User Agreement',
      privacyPolicy: 'Privacy Policy',
      autoRegister: 'Unregistered accounts will be created automatically',
      scanCode: 'Scan with WeChat to login',
      confirmLogin: 'Please confirm login in WeChat',
      loginSuccess: 'Login successful, redirecting...',
      phoneError: 'Please enter a valid phone number',
    },
    footer: {
      contact: 'Contact Us',
      phone: '010-82362616',
      email: 'ei2@baai.ac.cn',
      follow: 'Follow Us',
      address: '150 Chengfu Road, Haidian District, Beijing',
      security: 'Beijing Public Security 11010802045062',
      icp: 'ICP 19012194-1',
    },
  },
};

export type TranslationKey = keyof typeof translations.zh;
