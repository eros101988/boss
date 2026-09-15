import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Factory } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="bg-slate-50 border-b border-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            包裝與清潔用品，一次找齊
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            依用途與規格挑選，加入需求清單後由專人確認報價。
          </p>
        </div>
      </section>

      {/* Main Product Grid */}
      <ProductGrid />

      {/* Features Section */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">我們的優勢</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">工廠直供</h3>
              <p className="text-slate-600">提供穩定貨源與具競爭力的批發價格，滿足大量採購需求。</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">品質保證</h3>
              <p className="text-slate-600">嚴選優良材質，耐用不易破，符合各式營業與工業標準。</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">快速配送</h3>
              <p className="text-slate-600">建立完善的物流配送體系，確保商品準時送達您的手中。</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Teaser */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-slate-900">關於侑安國際有限公司</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
          以品質立信，以服務致遠。我們提供台塑原料專業經銷、免洗餐具包材、客製化包材服務。
          為什麼選擇我們：專業、穩定、長期。
        </p>
        <Link to="/about" className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
          了解更多公司資訊 <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
