
import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 space-y-4 animate-pulse">
          <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
