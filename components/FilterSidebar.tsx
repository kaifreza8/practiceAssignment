
import React from 'react';
import { useApp } from '../context/AppContext';
import { SortOption } from '../types';
import { CATEGORIES as ALL_CATEGORIES } from '../constants';

export const FilterSidebar: React.FC = () => {
  const { filters, setFilters } = useApp();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2 md:flex-col md:gap-0 md:space-y-1">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
              className={`px-3 py-2 rounded-lg text-sm text-left transition-all ${
                filters.category === cat
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-slate-200"
        >
          {Object.values(SortOption).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">Price Range</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="2000"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>$0</span>
            <span>Up to ${filters.maxPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
