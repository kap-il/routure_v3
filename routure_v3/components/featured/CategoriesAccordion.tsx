'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types/issue';

interface CategoriesAccordionProps {
  categories: Category[];
}

export function CategoriesAccordion({ categories }: CategoriesAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
      {categories.map((category, index) => (
        <div key={category.name}>
          <button
            onClick={() => toggle(index)}
            className="w-full flex items-center justify-between py-5 text-left group"
          >
            <span className="text-sm tracking-[0.15em] uppercase font-medium group-hover:text-gray-600 transition-colors">
              {category.name}
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96 pb-5' : 'max-h-0'
            }`}
          >
            <ul className="space-y-3 pl-4">
              {category.articles.map((article) => (
                <li key={`${article.issueSlug}-${article.slug}`}>
                  <Link
                    href={`/issues/${article.issueSlug}/articles/${article.slug}`}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
