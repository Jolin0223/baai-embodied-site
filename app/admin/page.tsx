'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, Upload, Download, RefreshCw, ChevronLeft, Database, 
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Image,
  Video, FileText, Link, MapPin, Calendar, Building, Tag,
  Edit2, X, Check, AlertTriangle, Sparkles
} from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import NextLink from 'next/link';

interface DataState {
  brainVideos: any[];
  cerebellumVideos: any[];
  cases: any[];
  openSource: any[];
  research: any[];
  history: any[];
  news: any[];
  jobs: any[];
}

const initialFormData: DataState = {
  brainVideos: [],
  cerebellumVideos: [],
  cases: [],
  openSource: [],
  research: [],
  history: [],
  news: [],
  jobs: [],
};

export default function AdminPage() {
  const [data, setData] = useState<DataState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('brainVideos');
  const [isDirty, setIsDirty] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { showToast } = useToastStore();

  const tabs = [
    { id: 'brainVideos', label: '具身大脑视频', icon: Video },
    { id: 'cerebellumVideos', label: '具身小脑视频', icon: Video },
    { id: 'cases', label: '应用案例', icon: Sparkles },
    { id: 'openSource', label: '开源项目', icon: FileText },
    { id: 'research', label: '科研成果', icon: FileText },
    { id: 'history', label: '发展历程', icon: Calendar },
    { id: 'news', label: '新闻报道', icon: FileText },
    { id: 'jobs', label: '招聘信息', icon: Building },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setIsDirty(false);
    } catch (error) {
      showToast('获取数据失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsDirty(false);
        showToast('保存成功', 'success');
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      showToast('保存失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baai_data_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('导出成功', 'success');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        setData(parsed);
        setIsDirty(true);
        showToast('导入成功，请点击保存以应用更改', 'success');
      } catch (error) {
        showToast('导入失败：文件格式错误', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const updateField = (module: keyof DataState, index: number, field: string, value: any) => {
    if (!data) return;
    const newData = { ...data };
    newData[module] = [...newData[module]];
    newData[module][index] = { ...newData[module][index], [field]: value };
    setData(newData);
    setIsDirty(true);
  };

  const addItem = (module: keyof DataState, template: any) => {
    if (!data) return;
    const newData = { ...data };
    newData[module] = [...newData[module], template];
    setData(newData);
    setIsDirty(true);
    setExpandedItems(prev => new Set(prev).add(`${module}-${newData[module].length - 1}`));
  };

  const removeItem = (module: keyof DataState, index: number) => {
    if (!data) return;
    if (!confirm('确定要删除这条数据吗？')) return;
    const newData = { ...data };
    newData[module] = newData[module].filter((_, i) => i !== index);
    setData(newData);
    setIsDirty(true);
  };

  const moveItem = (module: keyof DataState, index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data[module].length) return;
    const newData = { ...data };
    const arr = [...newData[module]];
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    newData[module] = arr;
    setData(newData);
    setIsDirty(true);
  };

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // 针对嵌套数据(openSource, research)的更新
  const updateNestedField = (module: keyof DataState, catIndex: number, itemIndex: number, field: string, value: any) => {
    if (!data) return;
    const newData = { ...data };
    newData[module] = [...newData[module]];
    newData[module][catIndex] = { 
      ...newData[module][catIndex],
      items: [...newData[module][catIndex].items]
    };
    newData[module][catIndex].items[itemIndex] = {
      ...newData[module][catIndex].items[itemIndex],
      [field]: value
    };
    setData(newData);
    setIsDirty(true);
  };

  const addNestedItem = (module: keyof DataState, catIndex: number, template: any) => {
    if (!data) return;
    const newData = { ...data };
    newData[module] = [...newData[module]];
    newData[module][catIndex] = {
      ...newData[module][catIndex],
      items: [...newData[module][catIndex].items, template]
    };
    setData(newData);
    setIsDirty(true);
  };

  const removeNestedItem = (module: keyof DataState, catIndex: number, itemIndex: number) => {
    if (!data) return;
    if (!confirm('确定要删除这条数据吗？')) return;
    const newData = { ...data };
    newData[module] = [...newData[module]];
    newData[module][catIndex] = {
      ...newData[module][catIndex],
      items: newData[module][catIndex].items.filter((_: any, i: number) => i !== itemIndex)
    };
    setData(newData);
    setIsDirty(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-white/50">正在加载配置数据...</span>
        </div>
      </div>
    );
  }

  const renderVideoEditor = (module: 'brainVideos' | 'cerebellumVideos') => {
    const items = data?.[module] || [];
    const categories = module === 'brainVideos' 
      ? ['时空推理', '具身交互']
      : ['末端操作', '移动操作', '视觉导航', '全身控制'];
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            {module === 'brainVideos' ? '具身大脑视频' : '具身小脑视频'}
            <span className="text-white/40 text-sm ml-2">({items.length} 条)</span>
          </h3>
          <button
            onClick={() => addItem(module, { category: categories[0], videoUrl: '', cover: '', title: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> 添加视频
          </button>
        </div>

        {items.map((item: any, idx: number) => {
          const key = `${module}-${idx}`;
          const isExpanded = expandedItems.has(key);
          return (
            <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02]"
                onClick={() => toggleExpand(key)}
              >
                <div className="flex items-center gap-3">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">{item.title || '未命名视频'}</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-white/60">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); moveItem(module, idx, 'up'); }} className="p-1.5 hover:bg-white/10 rounded" disabled={idx === 0}>
                    <ChevronUp className="w-4 h-4 text-white/40" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); moveItem(module, idx, 'down'); }} className="p-1.5 hover:bg-white/10 rounded" disabled={idx === items.length - 1}>
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); removeItem(module, idx); }} className="p-1.5 hover:bg-red-500/20 rounded">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white/60 mb-2">分类 *</label>
                          <select
                            value={item.category}
                            onChange={(e) => updateField(module, idx, 'category', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-2">标题 *</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateField(module, idx, 'title', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="视频标题"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">视频地址</label>
                        <input
                          type="url"
                          value={item.videoUrl}
                          onChange={(e) => updateField(module, idx, 'videoUrl', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">封面图片</label>
                        <input
                          type="url"
                          value={item.cover}
                          onChange={(e) => updateField(module, idx, 'cover', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="text-center py-12 text-white/30">
            暂无数据，点击上方按钮添加
          </div>
        )}
      </div>
    );
  };

  const renderCasesEditor = () => {
    const items = data?.cases || [];
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            应用案例
            <span className="text-white/40 text-sm ml-2">({items.length} 条)</span>
          </h3>
          <button
            onClick={() => addItem('cases', { logo: '', photo: '', keyword: '', description: '', link: '#' })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> 添加案例
          </button>
        </div>

        {items.map((item: any, idx: number) => {
          const key = `cases-${idx}`;
          const isExpanded = expandedItems.has(key);
          return (
            <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02]"
                onClick={() => toggleExpand(key)}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">{item.logo || '未命名案例'}</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-white/60">{item.keyword}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); moveItem('cases', idx, 'up'); }} className="p-1.5 hover:bg-white/10 rounded" disabled={idx === 0}>
                    <ChevronUp className="w-4 h-4 text-white/40" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); moveItem('cases', idx, 'down'); }} className="p-1.5 hover:bg-white/10 rounded" disabled={idx === items.length - 1}>
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); removeItem('cases', idx); }} className="p-1.5 hover:bg-red-500/20 rounded">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white/60 mb-2">合作方名称 *</label>
                          <input
                            type="text"
                            value={item.logo}
                            onChange={(e) => updateField('cases', idx, 'logo', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="如：乐聚机器人"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-2">关键词标签 *</label>
                          <input
                            type="text"
                            value={item.keyword}
                            onChange={(e) => updateField('cases', idx, 'keyword', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="如：导览导购"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">案例描述</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateField('cases', idx, 'description', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 min-h-[80px]"
                          placeholder="案例详细描述..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white/60 mb-2">案例图片</label>
                          <input
                            type="url"
                            value={item.photo}
                            onChange={(e) => updateField('cases', idx, 'photo', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-2">详情链接</label>
                          <input
                            type="url"
                            value={item.link}
                            onChange={(e) => updateField('cases', idx, 'link', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  };

  const renderHistoryEditor = () => {
    const items = data?.history || [];
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            发展历程
            <span className="text-white/40 text-sm ml-2">({items.length} 条)</span>
          </h3>
          <button
            onClick={() => addItem('history', { time: '', content: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> 添加里程碑
          </button>
        </div>

        {items.map((item: any, idx: number) => {
          const key = `history-${idx}`;
          const isExpanded = expandedItems.has(key);
          return (
            <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02]"
                onClick={() => toggleExpand(key)}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="text-white/60 text-sm">{item.time || '未设置时间'}</span>
                  <span className="text-white font-medium truncate max-w-[300px]">{item.content || '未填写内容'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); moveItem('history', idx, 'up'); }} className="p-1.5 hover:bg-white/10 rounded" disabled={idx === 0}>
                    <ChevronUp className="w-4 h-4 text-white/40" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); moveItem('history', idx, 'down'); }} className="p-1.5 hover:bg-white/10 rounded" disabled={idx === items.length - 1}>
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); removeItem('history', idx); }} className="p-1.5 hover:bg-red-500/20 rounded">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-2">时间 *</label>
                        <input
                          type="text"
                          value={item.time}
                          onChange={(e) => updateField('history', idx, 'time', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          placeholder="如：2025年6月"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">内容 *</label>
                        <textarea
                          value={item.content}
                          onChange={(e) => updateField('history', idx, 'content', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 min-h-[100px]"
                          placeholder="里程碑内容描述..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  };

  const renderNewsEditor = () => {
    const items = data?.news || [];
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            新闻报道
            <span className="text-white/40 text-sm ml-2">({items.length} 条)</span>
          </h3>
          <button
            onClick={() => addItem('news', { cover: '', agency: '', date: '', snippet: '', link: '#' })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> 添加新闻
          </button>
        </div>

        {items.map((item: any, idx: number) => {
          const key = `news-${idx}`;
          const isExpanded = expandedItems.has(key);
          return (
            <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02]"
                onClick={() => toggleExpand(key)}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">{item.agency || '未知来源'}</span>
                  <span className="text-white/40 text-sm">{item.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); moveItem('news', idx, 'up'); }} className="p-1.5 hover:bg-white/10 rounded" disabled={idx === 0}>
                    <ChevronUp className="w-4 h-4 text-white/40" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); moveItem('news', idx, 'down'); }} className="p-1.5 hover:bg-white/10 rounded" disabled={idx === items.length - 1}>
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); removeItem('news', idx); }} className="p-1.5 hover:bg-red-500/20 rounded">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white/60 mb-2">媒体来源 *</label>
                          <input
                            type="text"
                            value={item.agency}
                            onChange={(e) => updateField('news', idx, 'agency', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="如：机器之心"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-2">日期 *</label>
                          <input
                            type="text"
                            value={item.date}
                            onChange={(e) => updateField('news', idx, 'date', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="如：20250615"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">新闻摘要</label>
                        <textarea
                          value={item.snippet}
                          onChange={(e) => updateField('news', idx, 'snippet', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 min-h-[80px]"
                          placeholder="新闻内容摘要..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white/60 mb-2">封面图片</label>
                          <input
                            type="url"
                            value={item.cover}
                            onChange={(e) => updateField('news', idx, 'cover', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-2">原文链接</label>
                          <input
                            type="url"
                            value={item.link}
                            onChange={(e) => updateField('news', idx, 'link', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  };

  const renderJobsEditor = () => {
    const items = data?.jobs || [];
    const jobTypes = ['实习', '正式', '兼职'];
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            招聘信息
            <span className="text-white/40 text-sm ml-2">({items.length} 条)</span>
          </h3>
          <button
            onClick={() => addItem('jobs', { title: '', type: '正式', location: '北京', link: '#' })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> 添加职位
          </button>
        </div>

        {items.map((item: any, idx: number) => {
          const key = `jobs-${idx}`;
          const isExpanded = expandedItems.has(key);
          return (
            <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02]"
                onClick={() => toggleExpand(key)}
              >
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-medium">{item.title || '未命名职位'}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${item.type === '实习' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {item.type}
                  </span>
                  <span className="text-white/40 text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {item.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); moveItem('jobs', idx, 'up'); }} className="p-1.5 hover:bg-white/10 rounded" disabled={idx === 0}>
                    <ChevronUp className="w-4 h-4 text-white/40" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); moveItem('jobs', idx, 'down'); }} className="p-1.5 hover:bg-white/10 rounded" disabled={idx === items.length - 1}>
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); removeItem('jobs', idx); }} className="p-1.5 hover:bg-red-500/20 rounded">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white/60 mb-2">职位名称 *</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateField('jobs', idx, 'title', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="如：VLA算法工程师"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-2">职位类型 *</label>
                          <select
                            value={item.type}
                            onChange={(e) => updateField('jobs', idx, 'type', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          >
                            {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white/60 mb-2">工作地点</label>
                          <input
                            type="text"
                            value={item.location}
                            onChange={(e) => updateField('jobs', idx, 'location', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="如：北京"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-2">申请链接</label>
                          <input
                            type="url"
                            value={item.link}
                            onChange={(e) => updateField('jobs', idx, 'link', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  };

  const renderOpenSourceEditor = () => {
    const categories = data?.openSource || [];
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            开源项目
            <span className="text-white/40 text-sm ml-2">({categories.reduce((acc: number, c: any) => acc + c.items.length, 0)} 个项目)</span>
          </h3>
        </div>

        {categories.map((cat: any, catIdx: number) => (
          <div key={catIdx} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-white/80 font-medium flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-400" />
                {cat.category}
                <span className="text-white/40 text-sm">({cat.items.length})</span>
              </h4>
              <button
                onClick={() => addNestedItem('openSource', catIdx, { title: '', desc: '', cover: '', techReport: '#', experience: '', apply: '', history: [] })}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg text-xs transition-colors"
              >
                <Plus className="w-3 h-3" /> 添加项目
              </button>
            </div>

            {cat.items.map((item: any, itemIdx: number) => {
              const key = `openSource-${catIdx}-${itemIdx}`;
              const isExpanded = expandedItems.has(key);
              return (
                <div key={itemIdx} className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden ml-4">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02]"
                    onClick={() => toggleExpand(key)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">{item.title || '未命名项目'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); removeNestedItem('openSource', catIdx, itemIdx); }} className="p-1.5 hover:bg-red-500/20 rounded">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-white/60 mb-2">项目名称 *</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateNestedField('openSource', catIdx, itemIdx, 'title', e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                placeholder="如：RoboBrainV2.0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-white/60 mb-2">封面图片</label>
                              <input
                                type="url"
                                value={item.cover}
                                onChange={(e) => updateNestedField('openSource', catIdx, itemIdx, 'cover', e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm text-white/60 mb-2">项目描述</label>
                            <textarea
                              value={item.desc}
                              onChange={(e) => updateNestedField('openSource', catIdx, itemIdx, 'desc', e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 min-h-[80px]"
                              placeholder="项目描述..."
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm text-white/60 mb-2">技术报告链接</label>
                              <input
                                type="url"
                                value={item.techReport}
                                onChange={(e) => updateNestedField('openSource', catIdx, itemIdx, 'techReport', e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                placeholder="https://..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-white/60 mb-2">体验方式</label>
                              <input
                                type="text"
                                value={item.experience || ''}
                                onChange={(e) => updateNestedField('openSource', catIdx, itemIdx, 'experience', e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                placeholder="如：API调用"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-white/60 mb-2">申请链接</label>
                              <input
                                type="url"
                                value={item.apply || ''}
                                onChange={(e) => updateNestedField('openSource', catIdx, itemIdx, 'apply', e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderResearchEditor = () => {
    const categories = data?.research || [];
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            科研成果
            <span className="text-white/40 text-sm ml-2">({categories.reduce((acc: number, c: any) => acc + c.items.length, 0)} 篇论文)</span>
          </h3>
        </div>

        {categories.map((cat: any, catIdx: number) => (
          <div key={catIdx} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-white/80 font-medium flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-400" />
                {cat.category} / {cat.subCategory}
                <span className="text-white/40 text-sm">({cat.items.length})</span>
              </h4>
              <button
                onClick={() => addNestedItem('research', catIdx, { title: '', link: '#' })}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg text-xs transition-colors"
              >
                <Plus className="w-3 h-3" /> 添加论文
              </button>
            </div>

            {cat.items.map((item: any, itemIdx: number) => {
              const key = `research-${catIdx}-${itemIdx}`;
              const isExpanded = expandedItems.has(key);
              return (
                <div key={itemIdx} className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden ml-4">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02]"
                    onClick={() => toggleExpand(key)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-white font-medium truncate">{item.title || '未命名论文'}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); removeNestedItem('research', catIdx, itemIdx); }} className="p-1.5 hover:bg-red-500/20 rounded">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-4 space-y-4">
                          <div>
                            <label className="block text-sm text-white/60 mb-2">论文标题 *</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateNestedField('research', catIdx, itemIdx, 'title', e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                              placeholder="论文完整标题"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-white/60 mb-2">论文链接</label>
                            <input
                              type="url"
                              value={item.link}
                              onChange={(e) => updateNestedField('research', catIdx, itemIdx, 'link', e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                              placeholder="https://arxiv.org/..."
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'brainVideos':
        return renderVideoEditor('brainVideos');
      case 'cerebellumVideos':
        return renderVideoEditor('cerebellumVideos');
      case 'cases':
        return renderCasesEditor();
      case 'history':
        return renderHistoryEditor();
      case 'news':
        return renderNewsEditor();
      case 'jobs':
        return renderJobsEditor();
      case 'openSource':
        return renderOpenSourceEditor();
      case 'research':
        return renderResearchEditor();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 z-50 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <NextLink href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white group" title="返回首页">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </NextLink>
          <div className="h-6 w-px bg-white/10" />
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">数据配置中心</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm text-white/80"
          >
            <Download className="w-4 h-4" /> 导出
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm cursor-pointer text-white/80">
            <Upload className="w-4 h-4" /> 导入
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <button 
            onClick={handleSave}
            disabled={!isDirty || saving}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
              isDirty && !saving
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? '保存中...' : isDirty ? '保存更改' : '已保存'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-16 h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col">
          <div className="p-4 flex-1 overflow-y-auto space-y-1">
            <div className="text-xs font-medium text-white/40 px-4 py-2 uppercase tracking-wider">数据模块</div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all flex items-center gap-3 ${
                    activeTab === tab.id 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-400' : 'text-white/40'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
          
          <div className="p-4 border-t border-white/10">
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/80 text-xs flex gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <p>修改后请点击保存以应用更改</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#050505]">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
