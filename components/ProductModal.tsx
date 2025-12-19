
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { getProductAiInsight } from '../services/geminiService';
import { convertToINR } from "../context/AppContext";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useApp();
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      setIsLoadingInsight(true);
      const text = await getProductAiInsight(product.title, product.description);
      setInsight(text);
      setIsLoadingInsight(false);
    };
    fetchInsight();
  }, [product]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-900 dark:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full md:w-1/2 p-6 md:p-10 bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
          <div className="w-full aspect-square bg-white dark:bg-slate-900 rounded-2xl shadow-inner mb-6 overflow-hidden flex items-center justify-center">
            <img src={activeImage} alt={product.title} className="max-w-full max-h-full object-contain p-4" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 w-full justify-center">
            {product.images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 rounded-lg border-2 flex-shrink-0 bg-white dark:bg-slate-800 p-1 transition-all ${
                  activeImage === img ? 'border-indigo-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${product.title} ${idx}`} className="w-full h-full object-cover rounded" />
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{product.rating}</span>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">{product.title}</h2>
            <p className="text-2xl font-bold text-slate-900 dark:text-indigo-300 mb-6">₹{convertToINR(product.price).toLocaleString("en-IN")}</p>

            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-indigo-600 rounded-full p-1">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase">AI Shopping Insight</span>
              </div>
              <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed italic">
                {isLoadingInsight ? 'Generating smart insights...' : insight}
              </p>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Description</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                className="flex-1 bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
              >
                Add to Bag
              </button>
              <button
                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-200 dark:shadow-none"
              >
                Buy Now
              </button>
            </div>
            <p className="text-center text-sm text-slate-500 dark:text-slate-500">
              Only {product.stock} items left in stock. Fast delivery available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
