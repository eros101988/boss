import { MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function GlobalLineContact() {
  const { items } = useCart();
  const lineUrl = 'https://line.me/R/ti/p/%40593cexey';
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Desktop Floating Button */}
      <div className="hidden md:block fixed bottom-8 right-8 z-50">
        <a 
          href={lineUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-[#00B900] hover:bg-[#009900] text-white rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#00B900]/30"
          title="透過 LINE 聯絡我們"
        >
          <MessageCircle className="w-7 h-7" />
        </a>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe">
        <div className="flex h-[60px]">
          <Link 
            to="/cart" 
            className="flex-1 flex flex-col items-center justify-center border-r border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
          >
            <div className="relative">
              <span className="text-sm font-bold">需求清單</span>
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-4 bg-accent-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {totalQuantity}
                </span>
              )}
            </div>
          </Link>
          <a 
            href={lineUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-[1.2] flex items-center justify-center bg-[#00B900] hover:bg-[#009900] text-white font-bold transition"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            LINE 詢價
          </a>
        </div>
      </div>
    </>
  );
}
