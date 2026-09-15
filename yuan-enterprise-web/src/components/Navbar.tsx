import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pb-2 bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm">
      <nav className="max-w-[1280px] mx-auto bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-2xl border border-slate-100">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold tracking-wider text-slate-900">
                侑安國際<span className="text-primary-600 text-sm ml-2 hidden sm:inline">包裝與清潔用品</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/products" className="text-slate-600 hover:text-primary-600 font-medium transition">全部商品</Link>
              <Link to="/quick-order" className="text-slate-600 hover:text-primary-600 font-medium transition">快速訂購</Link>
              <Link to="/about" className="text-slate-600 hover:text-primary-600 font-medium transition">關於我們</Link>
              
              <div className="flex items-center space-x-4 border-l border-slate-200 pl-4">
                <Link to="/cart" className="flex items-center text-slate-600 hover:text-accent-500 font-medium transition relative">
                  <ShoppingCart className="w-5 h-5 mr-1" />
                  <span>需求清單</span>
                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-3 bg-accent-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
                <Link to="/admin" className="flex items-center text-slate-400 hover:text-primary-600 transition" title="管理後台">
                  <User className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-primary-600 focus:outline-none p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 rounded-b-2xl shadow-lg absolute w-full left-0 top-[100%] mt-2 overflow-hidden">
            <div className="px-2 pt-2 pb-4 space-y-1">
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600">全部商品</Link>
              <Link to="/quick-order" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600">快速訂購</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600">關於我們</Link>
              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-md text-base font-medium text-accent-600 hover:bg-slate-50 flex items-center justify-between">
                <span>需求清單</span>
                {totalQuantity > 0 && (
                  <span className="bg-accent-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </Link>
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-md text-base font-medium text-slate-500 hover:bg-slate-50 hover:text-primary-600">管理後台</Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
