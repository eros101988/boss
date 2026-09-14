import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { products, categories } from '../data/store';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = categoryFilter ? p.categoryId === categoryFilter : true;
      const matchSearch = p.name.includes(searchTerm) || p.categoryId.includes(searchTerm);
      return matchCat && matchSearch;
    });
  }, [categoryFilter, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">所有商品</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">分類</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSearchParams({})}
                  className={`w-full text-left px-2 py-1 rounded ${!categoryFilter ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-slate-50'}`}
                >
                  全部商品
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSearchParams({ category: cat.id })}
                    className={`w-full text-left px-2 py-1 rounded ${categoryFilter === cat.id ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-slate-50'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="搜尋商品名稱或規格..."
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const hasSpecs = product.specs && product.specs.length > 0;
              const coverImg = hasSpecs ? (product.specs[0]?.images?.[0]?.path || product.shared_images?.[0]?.path) : (product.images[0]?.path || '');
              return (
                <Link key={product.id} to={`/products/${encodeURIComponent(product.id)}`} className="group bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 overflow-hidden flex flex-col">
                  <div className="aspect-w-1 aspect-h-1 w-full bg-slate-100 relative">
                    {coverImg ? (
                      <img src={coverImg} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center text-slate-400">無圖片</div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="text-xs text-primary-600 font-medium mb-1">
                      {product.categoryId.split('_')[1] || product.categoryId}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h3>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-slate-500 text-sm">點擊查看規格</span>
                      <span className="text-accent-600 font-bold">詢價</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              找不到符合條件的商品。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
