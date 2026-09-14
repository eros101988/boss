import { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { products, categories } from '../data/store';
import { useCart } from '../context/CartContext';

export default function QuickOrder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = categoryFilter ? p.categoryId === categoryFilter : true;
      const matchSearch = p.name.includes(searchTerm) || p.categoryId.includes(searchTerm);
      return matchCat && matchSearch;
    });
  }, [categoryFilter, searchTerm]);

  const orderableItems = useMemo(() => {
    return filteredProducts.flatMap(product => {
      if (product.specs && product.specs.length > 0) {
        return product.specs.map(spec => ({
          id: `${product.id}-${spec.id}`,
          productId: product.id,
          name: product.name,
          categoryId: product.categoryId,
          specLabel: `${spec.label} (${spec.size})`,
          coverImg: spec.images?.[0]?.path || product.images[0]?.path || '',
          unit: '盒'
        }));
      }
      return [{
        id: product.id,
        productId: product.id,
        name: product.name,
        categoryId: product.categoryId,
        specLabel: '標準規格',
        coverImg: product.images[0]?.path || '',
        unit: '件'
      }];
    });
  }, [filteredProducts]);

  const handleQuickAdd = (item: typeof orderableItems[0]) => {
    addItem({
      id: item.id,
      productId: item.productId,
      productName: item.name,
      spec: item.specLabel,
      quantity: 1,
      unit: item.unit
    });
    
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">快速訂購</h1>
        <p className="text-slate-600">適合熟客快速選購多項商品，一鍵加入需求清單。</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64">
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">所有分類</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="輸入關鍵字快速搜尋..."
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="hidden sm:grid sm:grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700">
          <div className="col-span-2">商品圖片</div>
          <div className="col-span-6">商品名稱/規格</div>
          <div className="col-span-2 text-center">價格</div>
          <div className="col-span-2 text-center">操作</div>
        </div>
        
        <ul className="divide-y divide-slate-100">
          {orderableItems.map(item => {
            const isAdded = addedItems[item.id];
            
            return (
              <li key={item.id} className="p-4 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center hover:bg-slate-50 transition">
                <div className="col-span-2 w-20 h-20 sm:w-full sm:h-24 bg-white rounded border border-slate-200 overflow-hidden flex-shrink-0">
                  {item.coverImg ? (
                    <img src={item.coverImg} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">無圖片</div>
                  )}
                </div>
                <div className="col-span-6 w-full text-center sm:text-left">
                  <div className="text-xs text-primary-600 mb-1">{item.categoryId.split('_')[1] || item.categoryId}</div>
                  <div className="font-bold text-lg text-slate-900">{item.name}</div>
                  <div className="text-sm text-slate-500 mt-1 truncate">{item.specLabel}</div>
                </div>
                <div className="col-span-2 w-full text-center text-slate-500">
                  詢價
                </div>
                <div className="col-span-2 w-full flex justify-center mt-2 sm:mt-0">
                  <button
                    onClick={() => handleQuickAdd(item)}
                    disabled={isAdded}
                    className={`px-4 py-2 rounded-md font-medium flex items-center transition ${isAdded ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 hover:border-primary-300'}`}
                  >
                    {isAdded ? (
                      '已加入'
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" /> 加入
                      </>
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        
        {orderableItems.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            找不到符合條件的商品。
          </div>
        )}
      </div>
    </div>
  );
}
