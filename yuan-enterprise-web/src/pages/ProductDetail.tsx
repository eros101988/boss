import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Info } from 'lucide-react';
import { products } from '../data/store';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const product = products.find(p => p.id === decodeURIComponent(id || ''));
  
  const hasSpecs = product?.specs && product.specs.length > 0;
  const [selectedSpecId, setSelectedSpecId] = useState(hasSpecs ? product.specs[0].id : '');
  
  const selectedSpec = hasSpecs ? product.specs.find(s => s.id === selectedSpecId) : null;
  
  // Combine images depending on whether it has specs
  const displayImages = hasSpecs 
    ? [...(selectedSpec?.images || []), ...(product.shared_images || [])].sort((a, b) => (a.order || 0) - (b.order || 0))
    : product?.images || [];

  const [selectedImage, setSelectedImage] = useState(displayImages[0]?.path || '');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Update selected image when spec changes
  useEffect(() => {
    if (displayImages.length > 0) {
      setSelectedImage(displayImages[0].path);
    }
  }, [selectedSpecId, product]);

  if (!product) {
    return <div className="p-8 text-center">商品不存在</div>;
  }

  const handleAdd = () => {
    const specName = selectedSpec ? `${selectedSpec.label} (${selectedSpec.size})` : '標準規格';
    // For new products, order_unit is not in the json directly on variant, but let's use '盒' or '件'
    const unit = selectedSpec ? '盒' : '件';

    addItem({
      id: `${product.id}-${selectedSpecId || 'default'}`,
      productId: product.id,
      productName: product.name,
      spec: specName,
      quantity,
      unit
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
            
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.path)}
                    className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden border-2 transition ${selectedImage === img.path ? 'border-primary-500' : 'border-transparent hover:border-primary-300'}`}
                  >
                    <img src={img.path} alt={img.role || '商品圖片'} className="w-full h-full object-cover" />
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
            
            <div className="bg-slate-50 text-slate-700 p-4 rounded-lg flex items-start mb-6 border border-slate-200">
              <Info className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-slate-500" />
              <div className="text-sm leading-relaxed">
                價格、運費與交期由專人確認。
              </div>
            </div>

            {hasSpecs && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-700 mb-2">規格選擇</h3>
                <div className="flex flex-wrap gap-2">
                  {product.specs.map(spec => (
                    <button
                      key={spec.id}
                      onClick={() => setSelectedSpecId(spec.id)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition ${
                        selectedSpecId === spec.id 
                          ? 'border-primary-600 bg-primary-50 text-primary-700' 
                          : 'border-slate-300 bg-white text-slate-700 hover:border-primary-400'
                      }`}
                    >
                      {spec.label} ({spec.size})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-grow">
              {hasSpecs && selectedSpec ? (
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3 border-b border-slate-100 pb-2">商品規格</h3>
                  <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <th className="py-2 text-slate-500 w-24">尺寸</th>
                        <td className="py-2 font-medium">{selectedSpec.dimensions.join(' × ')} cm</td>
                      </tr>
                      <tr>
                        <th className="py-2 text-slate-500">每盒張數</th>
                        <td className="py-2 font-medium">{selectedSpec.sheets_per_box} 張</td>
                      </tr>
                      {selectedSpec.barcode && (
                        <tr>
                          <th className="py-2 text-slate-500">條碼</th>
                          <td className="py-2 font-medium">{selectedSpec.barcode}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  
                  {/* Additional notes based on category */}
                  {product.categoryId === '03_夾鏈袋' && (
                    <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-3 rounded">
                      <p>• 材質：LDPE（低密度聚乙烯）、PE（聚乙烯）</p>
                      <p>• 產地：泰國</p>
                      <p>• 耐冷熱範圍：-40°C ~ 60°C</p>
                      <p className="text-red-500 mt-1">※ 不適合加熱烹調；過熱食品請放涼後再放入袋中。</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  {product.parsedSpec && (
                    <>
                      <h3 className="text-lg font-bold mb-3 border-b border-slate-100 pb-2">商品規格</h3>
                      <table className="w-full text-sm text-left mb-4">
                        <tbody className="divide-y divide-slate-100">
                          {product.parsedSpec.size_or_type && (
                            <tr>
                              <th className="py-2 text-slate-500 w-24">款式/尺寸</th>
                              <td className="py-2 font-medium">{product.parsedSpec.size_or_type}</td>
                            </tr>
                          )}
                          {product.parsedSpec.capacity_or_dim && (
                            <tr>
                              <th className="py-2 text-slate-500">容量/規格</th>
                              <td className="py-2 font-medium">{product.parsedSpec.capacity_or_dim}</td>
                            </tr>
                          )}
                          {product.parsedSpec.quantity && (
                            <tr>
                              <th className="py-2 text-slate-500">包裝數量</th>
                              <td className="py-2 font-medium">{product.parsedSpec.quantity}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </>
                  )}
                  
                  {product.categoryId === '01_清潔袋' && (
                    <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-3 rounded">
                      <p>※ 詳細張數與尺寸以實際包裝標示為準。</p>
                    </div>
                  )}
                </div>
              )}
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
                <span className="ml-3 text-slate-500">{hasSpecs ? '盒' : '件'}</span>
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
