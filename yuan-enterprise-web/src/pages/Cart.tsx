import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    address: '',
    email: '',
    taxId: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const orderId = 'REQ' + Date.now().toString().slice(-6);
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        status: '待處理',
        items: [...items],
        customer: formData
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('yuan-orders') || '[]');
      localStorage.setItem('yuan-orders', JSON.stringify([newOrder, ...existingOrders]));
      
      setIsSubmitting(false);
      setSuccessId(orderId);
      clearCart();
    }, 1000);
  };

  if (successId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-900 mb-4">需求已送出！</h1>
        <p className="text-lg text-slate-600 mb-2">您的需求單號為：<span className="font-bold text-primary-600">{successId}</span></p>
        <p className="text-slate-600 mb-8">我們已收到您的訂購需求，將會有專人盡快與您聯絡，確認最終價格、運費及交期。</p>
        <Link to="/products" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition">
          繼續瀏覽商品
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">訂購需求清單</h1>
      
      {items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-lg mb-6">您的清單目前沒有任何商品。</p>
          <Link to="/products" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition">
            前往瀏覽商品
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 hidden sm:grid sm:grid-cols-12 gap-4">
                <div className="col-span-6">商品名稱</div>
                <div className="col-span-3 text-center">數量</div>
                <div className="col-span-3 text-right">操作</div>
              </div>
              <ul className="divide-y divide-slate-100">
                {items.map(item => (
                  <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 w-full flex flex-col">
                      <Link to={`/products/${encodeURIComponent(item.productId)}`} className="font-bold text-lg text-slate-900 hover:text-primary-600 transition">
                        {item.productName}
                      </Link>
                      <span className="text-sm text-slate-500">{item.spec}</span>
                    </div>
                    <div className="col-span-3 w-full flex justify-center items-center my-4 sm:my-0">
                      <div className="flex items-center border border-slate-300 rounded-md">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-slate-100 text-slate-600">-</button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-12 text-center py-1 border-x border-slate-300 focus:outline-none"
                        />
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-slate-100 text-slate-600">+</button>
                      </div>
                      <span className="ml-2 text-slate-500">{item.unit}</span>
                    </div>
                    <div className="col-span-3 w-full flex justify-end">
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-2 flex items-center">
                        <Trash2 className="w-5 h-5" />
                        <span className="sm:hidden ml-1">刪除</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 bg-amber-50 text-amber-800 p-4 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                此為訂購需求，送出後不代表訂單成立。價格、運費及交期將由專人與您確認後，才會正式成立訂單。
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-slate-900 border-b pb-2">聯絡資料</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">公司/店名 <span className="text-red-500">*</span></label>
                  <input required type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">聯絡人 <span className="text-red-500">*</span></label>
                  <input required type="text" name="contactName" value={formData.contactName} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">聯絡電話 <span className="text-red-500">*</span></label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">配送地址 <span className="text-red-500">*</span></label>
                  <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">統一編號 (選填)</label>
                  <input type="text" name="taxId" value={formData.taxId} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email (選填)</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">備註 (選填)</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-bold text-lg ${isSubmitting ? 'bg-slate-400' : 'bg-primary-600 hover:bg-primary-700'} transition focus:outline-none`}
                >
                  {isSubmitting ? '處理中...' : '送出訂購需求'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
