
import React, { useState, useEffect, useMemo } from 'react';
import { Product, ProductsResponse, SortOption } from './types';
import { API_BASE_URL } from './constants';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { ProductCard } from './components/ProductCard';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductModal } from './components/ProductModal';
import { SkeletonLoader } from './components/SkeletonLoader';
import { useDebounce } from './hooks/useDebounce';

const MainContent: React.FC = () => {
  const { filters, setFilters } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let url = `${API_BASE_URL}/products?limit=100`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data: ProductsResponse = await res.json();
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category);
    }
    if (debouncedSearch) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    result = result.filter(p => p.price <= filters.maxPrice);
    switch (filters.sortBy) {
      case SortOption.PRICE_ASC:
        result.sort((a, b) => a.price - b.price);
        break;
      case SortOption.PRICE_DESC:
        result.sort((a, b) => b.price - a.price);
        break;
      case SortOption.RATING:
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return result;
  }, [products, filters.category, debouncedSearch, filters.maxPrice, filters.sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <CartDrawer />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {filters.category === 'All' ? 'Our Collection' : filters.category.replace('-', ' ')}
                <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">({filteredProducts.length} items)</span>
              </h2>
            </div>

            {isLoading ? (
              <SkeletonLoader />
            ) : error ? (
              <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-8 rounded-2xl text-center">
                <p className="text-rose-600 dark:text-rose-400 font-medium mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-all"
                >
                  Retry
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 inline-block p-6 rounded-full mb-6">
                  <svg className="w-12 h-12 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => setFilters({ search: '', category: 'All', minPrice: 0, maxPrice: 2000, sortBy: SortOption.NEWEST })}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            © 2024 RezaStore Premium E-commerce.
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
