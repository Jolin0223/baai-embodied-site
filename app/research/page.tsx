'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, ExternalLink } from 'lucide-react';
import { useAppStore, translations } from '@/store/useAppStore';
import { useMockData } from '@/hooks/useMockData';

interface ResearchItem {
  title: string;
  link: string;
}

interface ResearchCategory {
  category: string;
  subCategory: string;
  items: ResearchItem[];
}

export default function ResearchPage() {
  const { language } = useAppStore();
  const t = translations[language].research;
  const data = useMockData();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['具身模型', '具身数据集']));

  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const groupedData = useMemo(() => {
    const researchData = data.research as ResearchCategory[];
    const grouped: Record<string, ResearchCategory[]> = {};
    
    researchData.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return grouped;
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return groupedData;
    
    const query = searchQuery.toLowerCase();
    const filtered: Record<string, ResearchCategory[]> = {};

    Object.entries(groupedData).forEach(([category, subCategories]) => {
      const filteredSubs = subCategories
        .map((sub) => ({
          ...sub,
          items: sub.items.filter((item) =>
            item.title.toLowerCase().includes(query)
          ),
        }))
        .filter((sub) => sub.items.length > 0);

      if (filteredSubs.length > 0) {
        filtered[category] = filteredSubs;
      }
    });

    return filtered;
  }, [searchQuery, groupedData]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const subCategory = entry.target.getAttribute('data-subcategory');
            if (subCategory) {
              setActiveSubCategory(subCategory);
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

  const scrollToSubCategory = useCallback((subCategory: string) => {
    const element = sectionRefs.current.get(subCategory);
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
                {Object.entries(filteredData).map(([category, subCategories]) => {
                  const isExpanded = expandedCategories.has(category);

                  return (
                    <div key={category} className="space-y-0.5">
                      <button
                        onClick={() => toggleCategory(category)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-sm ${
                          subCategories.some((sub) => sub.subCategory === activeSubCategory)
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'text-white/50 hover:bg-white/[0.03] hover:text-white/70'
                        }`}
                      >
                        <span className="font-medium">{category}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 py-1 space-y-0.5">
                              {subCategories.map((sub) => (
                                <button
                                  key={sub.subCategory}
                                  onClick={() => scrollToSubCategory(sub.subCategory)}
                                  className={`w-full text-left px-4 py-2 text-xs rounded-lg transition-colors truncate ${
                                    activeSubCategory === sub.subCategory
                                      ? 'text-blue-400 bg-blue-500/5'
                                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.02]'
                                  }`}
                                >
                                  {sub.subCategory}
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
            {Object.keys(filteredData).length === 0 ? (
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
                {Object.entries(filteredData).map(([category, subCategories], categoryIdx) => (
                  <motion.section
                    key={category}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIdx * 0.1, duration: 0.6 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-4">
                      <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                      {category}
                    </h2>

                    <div className="space-y-10">
                      {subCategories.map((subCat, subIdx) => (
                        <div
                          key={subCat.subCategory}
                          ref={(el) => {
                            if (el) sectionRefs.current.set(subCat.subCategory, el);
                          }}
                          data-subcategory={subCat.subCategory}
                        >
                          <h3 className="text-base font-medium text-white/60 mb-4 pl-4 border-l-2 border-white/10">
                            {subCat.subCategory}
                          </h3>

                          <div className="card-premium overflow-hidden">
                            <div className="divide-y divide-white/[0.04]">
                              {subCat.items.map((item, itemIdx) => (
                                <motion.a
                                  key={itemIdx}
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  initial={{ opacity: 0, x: -10 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: itemIdx * 0.05, duration: 0.4 }}
                                  className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors group"
                                >
                                  <span className="text-white/60 group-hover:text-white transition-colors truncate pr-4 underline underline-offset-4 decoration-white/10 group-hover:decoration-blue-500/50 text-sm">
                                    {item.title}
                                  </span>
                                  <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-blue-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                                </motion.a>
                              ))}
                            </div>
                          </div>
                        </div>
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
