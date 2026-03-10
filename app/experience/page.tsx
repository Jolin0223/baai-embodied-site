'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Upload, Loader2, AlertCircle, 
  ImageIcon, RefreshCw, X, Phone, CreditCard,
  Cpu
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SceneOption {
  id: string;
  name: string;
  image: string;
  prompt: string;
}

interface ResultData {
  description: string;
  boundingBoxes?: { x: number; y: number; width: number; height: number; label: string }[];
}

const PRESET_SCENES: SceneOption[] = [
  {
    id: 'obstacle',
    name: '避障测试',
    image: '/experience/scene-obstacle.png',
    prompt: '你是一个具备3D空间推理能力的协作机器人。请分析桌面环境，定位水杯的3D坐标，并生成一条抓取路径，在执行过程中持续监测动作质量。',
  },
  {
    id: 'object-search',
    name: '物品寻找',
    image: '/experience/scene-objects.png',
    prompt: '请识别图片中桌面上的所有物品，并标注它们的位置坐标和名称，评估可抓取性。',
  },
  {
    id: 'kitchen',
    name: '客厅导航',
    image: '/experience/scene-kitchen.png',
    prompt: '请分析室内场景，识别可通行区域和障碍物，规划一条从当前位置到目标点的安全路径。',
  },
  {
    id: 'office',
    name: '办公场景',
    image: '/experience/scene-office.png',
    prompt: '请分析办公环境，识别桌面物品并评估工作区整洁度，给出整理建议。',
  }
];

const DAILY_FREE_LIMIT = 5;

export default function ExperiencePage() {
  const [selectedScene, setSelectedScene] = useState<SceneOption | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 新增：存储用于展示结果的图片
  const [resultImage, setResultImage] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('experience_usage');
    if (stored) {
      const { date, count } = JSON.parse(stored);
      if (date === today) {
        setUsageCount(count);
      } else {
        localStorage.setItem('experience_usage', JSON.stringify({ date: today, count: 0 }));
        setUsageCount(0);
      }
    }
  }, []);

  const updateUsageCount = () => {
    const today = new Date().toDateString();
    const newCount = usageCount + 1;
    localStorage.setItem('experience_usage', JSON.stringify({ date: today, count: newCount }));
    setUsageCount(newCount);
  };

  const handleSceneSelect = (scene: SceneOption) => {
    setSelectedScene(scene);
    setCustomImage(null);
    setPrompt(scene.prompt);
    setResult(null);
    setResultImage(null); // 清空结果图片
    setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target?.result as string);
        setSelectedScene(null);
        setPrompt('你是一个具备3D空间推理能力的协作机器人。请分析桌面环境，定位水杯的3D坐标，并生成一条抓取路径，在执行过程中持续监测动作质量。');
        setResult(null);
        setResultImage(null); // 清空结果图片
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentImage = () => {
    if (customImage) return customImage;
    if (selectedScene) return selectedScene.image;
    return null;
  };

  const handleRunModel = async () => {
    const currentImage = getCurrentImage();
    
    if (!currentImage) {
      setError('请先选择一个预设场景或上传图片');
      return;
    }
    
    if (!prompt.trim()) {
      setError('请输入指令');
      return;
    }

    if (usageCount >= DAILY_FREE_LIMIT) {
      setShowLimitModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
      
      // 设置结果图片为指定的杯子定位图片
      setResultImage('/experience/cup-detection.png'); // 请确保这个路径正确指向你的杯子定位图片
      
      const fixedResult: ResultData = {
        description: '[环境感知] 检测到目标水杯位于3D空间坐标 (x: 0.45m, y: -0.12m, z: 0.78m)，深度信息已锁定\n[路径规划] 识别到左侧5cm处存在笔记本电脑边缘。规划路径：机械臂先垂直上升10cm避开障碍区，随后沿弧形轨迹向目标点靠拢，末端执行器预留在杯柄上方2cm处\n[实时评估] 当前时间价值评分：0.92（动作平稳）。检测到杯子位置发生轻微滑移，已实时修正抓取补偿角5°\n[执行反馈] 闭环反馈确认：接触力矩正常，已成功将杯子垂直提升至安全高度，任务完成度100%',
        boundingBoxes: []
      };

      setResult(fixedResult);
      updateUsageCount();
    } catch (err) {
      setError('模型连接信号微弱，正在重试...');
    } finally {
      setIsLoading(false);
    }
  };

  const remainingTries = DAILY_FREE_LIMIT - usageCount;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header - 与主站一致 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/open-source" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">智源具身模型体验区</span>
            </Link>
          </div>
          
          <div className="text-sm text-gray-500">
            今日剩余试用次数: <span className={`font-semibold ${remainingTries > 2 ? 'text-green-600' : remainingTries > 0 ? 'text-amber-600' : 'text-red-600'}`}>{remainingTries}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-3">RoboBrain 2.5 能力体验</h1>
          <p className="text-gray-500">
            引入3D空间推理和密集时间价值评估，实现了三维物理层面的精准操作与闭环反馈
          </p>
        </motion.div>

        {/* 预设场景选择 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">预设场景选择</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRESET_SCENES.map((scene) => (
              <div
                key={scene.id}
                onClick={() => handleSceneSelect(scene)}
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                  selectedScene?.id === scene.id 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="aspect-[4/3] relative bg-gray-100">
                  {/* 修复：修改Image组件的错误处理逻辑 */}
                  <Image
                    src={scene.image}
                    alt={scene.name}
                    fill
                    className="object-cover"
                    // 修复：只在图片加载失败时显示占位符
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // 不隐藏图片，而是显示背景占位
                      target.style.objectFit = 'contain';
                      target.style.backgroundColor = '#f3f4f6';
                    }}
                    // 添加优先级，确保图片加载
                    priority={false}
                  />
                </div>
                <div className="p-3 bg-white text-center">
                  <span className="text-sm font-medium text-gray-700">{scene.name}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 两列布局：图片上传 + 指令输入 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 mb-10"
        >
          {/* 图片上传 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">图片上传</h2>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 min-h-[200px] flex flex-col items-center justify-center ${
                customImage 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {customImage ? (
                <div className="relative">
                  <img src={customImage} alt="上传的图片" className="max-h-40 mx-auto rounded-lg shadow" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomImage(null);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-1">点击或拖拽上传图片</p>
                  <p className="text-gray-400 text-sm">支持 JPG、PNG 格式，最大 5MB</p>
                  <button className="mt-4 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                    选择文件
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 指令输入 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">指令输入</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="请输入您希望模型执行的指令..."
              className="w-full h-[200px] border-2 border-gray-200 rounded-lg p-4 text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </motion.div>

        {/* 运行按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={handleRunModel}
                  className="text-sm text-red-600 hover:text-red-700 mt-1 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  点击重试
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={handleRunModel}
            disabled={isLoading || (!selectedScene && !customImage)}
            className={`w-full py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-3 transition-all ${
              isLoading || (!selectedScene && !customImage)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                模型分析中...
              </>
            ) : (
              '运 行 模 型'
            )}
          </button>
        </motion.div>

        {/* 结果展示 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">结果展示</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* 可视化结果 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-gray-700">可视化结果</h3>
              </div>
              <div className="aspect-[4/3] relative bg-gray-100">
                {isLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-blue-200 animate-ping absolute inset-0" />
                      <div className="w-20 h-20 rounded-full border-4 border-blue-400 animate-pulse flex items-center justify-center">
                        <Cpu className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>
                    <p className="text-gray-500 mt-4 text-sm">正在分析图像...</p>
                  </div>
                ) : result && resultImage ? (
                  // 修复：只在有结果时显示分析后的图片
                  <div className="relative w-full h-full">
                    <Image
                      src={resultImage}
                      alt="分析结果"
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.objectFit = 'contain';
                        target.style.backgroundColor = '#f3f4f6';
                      }}
                    />
                  </div>
                ) : (
                  // 修复：无结果时显示提示文本，而非上传/选择的图片
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gray-50">
                    <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-400 text-sm">
                      运行模型后将在这里显示可视化结果
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 自然语言描述 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-gray-700">自然语言描述</h3>
              </div>
              <div className="p-4 min-h-[200px]">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${100 - i * 15}%` }} />
                    ))}
                  </div>
                ) : result ? (
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {result.description}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-gray-400 text-sm">
                      运行模型后将在这里显示分析结果
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* 额度用尽弹窗 */}
      <AnimatePresence>
        {showLimitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowLimitModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">今日免费次数已用完</h3>
                <p className="text-gray-500 mb-6">
                  您今日的 {DAILY_FREE_LIMIT} 次免费体验机会已全部使用，明日将自动刷新。
                </p>
                <div className="flex flex-col gap-3">
                  <button className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    联系商务
                  </button>
                  <button className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    查看付费套餐
                  </button>
                  <button
                    onClick={() => setShowLimitModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-sm mt-2"
                  >
                    稍后再说
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}