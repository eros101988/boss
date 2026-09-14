import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Info } from 'lucide-react';
import { products } from '../data/store';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const product = products.find(p => p.id === decodeURIComponent(id || ''));
  
  const [selectedImage, setSelectedImage] = useState(product?.images[0]?.path || '');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!product) {
    return <div className="p-8 text-center">商品不存在</div>;
  }

  const handleAdd = () => {
    addItem({
      id: product.id,
      productId: product.id,
      productName: product.name,
      spec: '標準規格',
      quantity,
      unit: '件' // TODO: extract from data if possible
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary-600 mb-6 transition">
        <ArrowLeft className="w-4 h-4 mr-1" /> 回上頁
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Image Gallery */}
          <div className="p-6 md:p-8 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col">
            <div className="aspect-w-1 aspect-h-1 w-full mb-4 bg-white rounded-lg overflow-hidden border border-slate-200">
              {selectedImage ? (
                <img src={selectedImage} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">無圖片</div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.path)}
                    className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden border-2 transition ${selectedImage === img.path ? 'border-primary-500' : 'border-transparent hover:border-primary-300'}`}
                  >
                    <img src={img.path} alt={img.role} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="text-sm font-medium text-primary-600 mb-2">
              {product.categoryId.split('_')[1] || product.categoryId}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>
            
            <div className="bg-amber-50 text-amber-800 p-4 rounded-lg flex items-start mb-6">
              <Info className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold">詢價商品</p>
                <p>此商品價格需視訂購數量與交期而定，請加入需求清單後送出，將有專人為您報價。</p>
              </div>
            </div>

            <div className="flex-grow">
              <h3 className="text-lg font-bold mb-2">商品說明</h3>
              <ul className="space-y-2 text-slate-600 text-sm mb-6">
                {product.images.map((img, idx) => (
                  <li key={idx}>• {img.role} {img.note && `(${img.note})`}</li>
                ))}
              </ul>
            </div>

            <div className="mt-auto border-t border-slate-100 pt-6">
              <div className="flex items-center mb-6">
                <span className="mr-4 font-medium text-slate-700">訂購數量</span>
                <div className="flex items-center border border-slate-300 rounded-md">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 hover:bg-slate-100 text-slate-600">-</button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center py-1 border-x border-slate-300 focus:outline-none"
                  />
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 hover:bg-slate-100 text-slate-600">+</button>
                </div>
                <span className="ml-3 text-slate-500">件</span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-md font-bold text-lg flex items-center justify-center transition shadow-sm"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  加入需求清單
                </button>
              </div>
              {showSuccess && (
                <div className="mt-3 text-green-600 text-sm font-medium text-center animate-fade-in">
                  已成功加入需求清單！
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
