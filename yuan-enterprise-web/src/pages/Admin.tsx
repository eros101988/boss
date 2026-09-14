import { useState, useEffect } from 'react';
import { LogIn, LogOut, PackageSearch, RefreshCw } from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  spec: string;
  quantity: number;
  unit: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  items: OrderItem[];
  customer: {
    companyName: string;
    contactName: string;
    phone: string;
    address: string;
    email: string;
    taxId: string;
    notes: string;
  };
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      loadOrders();
    }
  }, [isLoggedIn]);

  const loadOrders = () => {
    const saved = localStorage.getItem('yuan-orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('密碼錯誤 (測試密碼: admin)');
    }
  };

  const updateOrderStatus = (id: string, newStatus: string) => {
    const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem('yuan-orders', JSON.stringify(updated));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border border-slate-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
              <LogIn className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">後台管理登入</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">密碼</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="輸入測試密碼: admin"
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md font-bold transition">
              登入
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
          <PackageSearch className="w-8 h-8 mr-3 text-primary-600" />
          需求單管理
        </h1>
        <div className="flex space-x-4">
          <button onClick={loadOrders} className="flex items-center text-slate-600 hover:text-primary-600 transition">
            <RefreshCw className="w-5 h-5 mr-1" /> 重新整理
          </button>
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center text-red-600 hover:text-red-700 transition">
            <LogOut className="w-5 h-5 mr-1" /> 登出
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            目前沒有任何需求單。
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="p-4 font-bold">單號/日期</th>
                  <th className="p-4 font-bold">客戶資料</th>
                  <th className="p-4 font-bold">商品明細</th>
                  <th className="p-4 font-bold">狀態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 align-top">
                      <div className="font-bold text-primary-600">{order.id}</div>
                      <div className="text-sm text-slate-500 mt-1">{new Date(order.date).toLocaleString('zh-TW')}</div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-bold">{order.customer.companyName}</div>
                      <div className="text-sm text-slate-600 mt-1">{order.customer.contactName} / {order.customer.phone}</div>
                      <div className="text-sm text-slate-600">{order.customer.address}</div>
                      {order.customer.notes && (
                        <div className="text-sm text-amber-600 mt-2 bg-amber-50 p-2 rounded">
                          備註: {order.customer.notes}
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <ul className="space-y-1 text-sm">
                        {order.items.map(item => (
                          <li key={item.id} className="flex justify-between border-b border-slate-100 pb-1">
                            <span className="truncate pr-2 max-w-[200px]">{item.productName} ({item.spec})</span>
                            <span className="font-bold whitespace-nowrap">{item.quantity} {item.unit}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 align-top">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-sm font-medium px-3 py-1.5 rounded-full border focus:outline-none ${
                          order.status === '待處理' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          order.status === '已聯絡' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          order.status === '已確認' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                          order.status === '已完成' ? 'bg-green-100 text-green-800 border-green-200' :
                          'bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <option value="待處理">待處理</option>
                        <option value="已聯絡">已聯絡</option>
                        <option value="已確認">已確認</option>
                        <option value="已完成">已完成</option>
                        <option value="已取消">已取消</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
