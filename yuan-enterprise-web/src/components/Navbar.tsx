import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold tracking-wider">
              佑安企業<span className="text-primary-100 text-sm ml-2">包裝與清潔用品</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="hover:text-primary-100 transition">瀏覽商品</Link>
            <Link to="/quick-order" className="hover:text-primary-100 transition">快速訂購</Link>
            <Link to="/about" className="hover:text-primary-100 transition">關於我們</Link>
            
            <div className="flex items-center space-x-4 border-l border-primary-700 pl-4">
              <Link to="/cart" className="flex items-center hover:text-accent-500 transition">
                <ShoppingCart className="w-5 h-5 mr-1" />
                <span>需求清單</span>
              </Link>
              <Link to="/admin" className="flex items-center hover:text-primary-100 transition">
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-primary-100 focus:outline-none">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-800 pb-4">
          <div className="px-2 pt-2 space-y-1">
            <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700">瀏覽商品</Link>
            <Link to="/quick-order" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700">快速訂購</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700">關於我們</Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-accent-500 hover:bg-primary-700">需求清單</Link>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700">管理後台</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
