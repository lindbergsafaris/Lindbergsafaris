'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FaqCategory {
  title: string;
  items: {
    question: string;
    answer: string;
  }[];
}

interface CompanyFaqAccordionProps {
  categories: FaqCategory[];
}

const CompanyFaqAccordion = ({ categories }: CompanyFaqAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="space-y-12">
      {categories.map((category, catIndex) => (
        <div key={catIndex}>
          <h3 className="text-2xl font-serif font-bold mb-6 text-white">{category.title}</h3>
          <div className="space-y-4">
            {category.items.map((item, itemIndex) => {
              const key = `${catIndex}-${itemIndex}`;
              const isOpen = openIndex === key;

              return (
                <div
                  key={itemIndex}
                  className="bg-white/10 rounded-xl overflow-hidden border border-white/20 transition-colors"
                >
                  <button
                    onClick={() => toggle(key)}
                    className="w-full flex items-center justify-between p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif font-bold text-lg text-white pr-4">
                      {item.question}
                    </span>
                    <span className="shrink-0 text-white/80">
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 text-gray-200 border-t border-white/10 leading-relaxed text-sm">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyFaqAccordion;
