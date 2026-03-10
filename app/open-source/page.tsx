'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, ChevronRight, FileText, Zap, Send, History, Heart } from 'lucide-react';
import { useAppStore, translations } from '@/store/useAppStore';
import MediaFallback from '@/components/MediaFallback';
import { useMockData } from '@/hooks/useMockData';
import Link from 'next/link';

interface OpenSourceItem {
  title: string;
  desc: string;
  cover: string;
  techReport?: string;
  experience?: string;
  apply?: string;
  history: string[];
}

interface OpenSourceCategory {
  category: string;
  items: OpenSourceItem[];
}

export default function OpenSourcePage() {
  const { language } = useAppStore();
  const t = translations[language].openSource;
  const data = useMockData();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(
    data.openSource.map((c: any) => c.category)
  ));
  const [hoveredHistory, setHoveredHistory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data.openSource as OpenSourceCategory[];
    
    const query = searchQuery.toLowerCase();
    return (data.openSource as OpenSourceCategory[])
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.desc.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [searchQuery]);

  const visibleCategories = useMemo(() => {
    return filteredData.map((c) => c.category);
  }, [filteredData]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const category = entry.target.getAttribute('data-category');
            if (category) {
              setActiveCategory(category);
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px',
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    sectionRefs.current.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [filteredData]);

  const scrollToCategory = useCallback((category: string) => {
    const element = sectionRefs.current.get(category);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((title: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-20 z-40 mb-12 pt-4"
        >
          <div className="relative max-w-2xl mx-auto">
            <div className="card-premium overflow-hidden">
              <div className="flex items-center">
                <Search className="w-5 h-5 text-white/30 ml-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="flex-1 px-4 py-4 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="p-2 mr-3 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white/40" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-10">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-56 flex-shrink-0"
          >
            <div className="sticky top-40">
              <nav className="space-y-1">
                {['具身模型', '一体化平台', '真机数据集', '评测数据集'].map((mainCategory) => {
                  const categoryData = filteredData.find((c) => c.category === mainCategory);
                  const isVisible = visibleCategories.includes(mainCategory);
                  const isExpanded = expandedCategories.has(mainCategory);
                  const isActive = activeCategory === mainCategory;

                  if (!isVisible && searchQuery) return null;

                  return (
                    <div key={mainCategory} className="space-y-0.5">
                      <button
                        onClick={() => {
                          toggleCategory(mainCategory);
                          if (categoryData) {
                            scrollToCategory(mainCategory);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-sm ${
                          isActive
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'text-white/50 hover:bg-white/[0.03] hover:text-white/70'
                        }`}
                      >
                        <span className="font-medium">{mainCategory}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && categoryData && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 py-1 space-y-0.5">
                              {categoryData.items.map((item) => (
                                <button
                                  key={item.title}
                                  onClick={() => scrollToCategory(item.title)}
                                  className="w-full text-left px-4 py-2 text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.02] rounded-lg transition-colors truncate"
                                >
                                  {item.title}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </div>
          </motion.aside>

          <main className="flex-1 min-w-0">
            {filteredData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.02] flex items-center justify-center">
                  <Search className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-white/40 text-lg mb-6">{t.noResults}</p>
                <button
                  onClick={clearSearch}
                  className="btn-outline"
                >
                  {t.back}
                </button>
              </motion.div>
            ) : (
              <div className="space-y-16">
                {filteredData.map((category, categoryIdx) => (
                  <motion.section
                    key={category.category}
                    ref={(el) => {
                      if (el) sectionRefs.current.set(category.category, el);
                    }}
                    data-category={category.category}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIdx * 0.1, duration: 0.6 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                      <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                      {category.category}
                    </h2>

                    <div className="grid gap-6">
                      {category.items.map((item, itemIdx) => (
                        <motion.div
                          key={item.title}
                          ref={(el) => {
                            if (el) sectionRefs.current.set(item.title, el);
                          }}
                          data-category={category.category}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: itemIdx * 0.05, duration: 0.5 }}
                          className="card-premium overflow-hidden group"
                        >
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-44 flex-shrink-0">
                              <MediaFallback
                                src={item.cover}
                                type="image"
                                className="w-full h-44 sm:h-full"
                              />
                            </div>

                            <div className="flex-1 p-6">
                              <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                                  {item.title}
                                </h3>
                                <button
                                  onClick={() => toggleFavorite(item.title)}
                                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <Heart
                                    className={`w-5 h-5 transition-colors ${
                                      favorites.has(item.title)
                                        ? 'text-red-500 fill-red-500'
                                        : 'text-white/30 hover:text-white/50'
                                    }`}
                                  />
                                </button>
                              </div>

                              <p className="text-white/50 text-sm mb-6 line-clamp-2">{item.desc}</p>

                              <div className="flex flex-wrap gap-2">
                                {item.techReport && (
                                  <a
                                    href={item.techReport}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors"
                                  >
                                    <FileText className="w-4 h-4" />
                                    {t.techReport}
                                  </a>
                                )}

                                {item.experience && (
                                  <Link
                                    href="/experience"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors"
                                  >
                                    <Zap className="w-4 h-4" />
                                    {t.experience}
                                    <span className="text-xs opacity-60">({item.experience})</span>
                                  </Link>
                                )}

                                {item.apply && (
                                  <a
                                    href={item.apply}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors"
                                  >
                                    <Send className="w-4 h-4" />
                                    {t.apply}
                                  </a>
                                )}

                                {item.history && item.history.length > 0 && (
                                  <div
                                    className="relative"
                                    onMouseEnter={() => setHoveredHistory(item.title)}
                                    onMouseLeave={() => setHoveredHistory(null)}
                                  >
                                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] text-white/50 text-sm font-medium hover:bg-white/[0.06] transition-colors">
                                      <History className="w-4 h-4" />
                                      {t.history}
                                      <ChevronDown className="w-3 h-3" />
                                    </button>

                                    <AnimatePresence>
                                      {hoveredHistory === item.title && (
                                        <motion.div
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: 10 }}
                                          transition={{ duration: 0.2 }}
                                          className="absolute top-full left-0 mt-2 w-48 card-premium overflow-hidden z-10"
                                        >
                                          {item.history.map((version, vIdx) => (
                                            <a
                                              key={vIdx}
                                              href="#"
                                              className="block px-4 py-3 text-sm text-white/50 hover:bg-white/[0.03] hover:text-white transition-colors"
                                            >
                                              {version}
                                            </a>
                                          ))}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
