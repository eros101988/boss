import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Factory } from 'lucide-react';
import { categories } from '../data/store';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            專業包裝與清潔用品供應商
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-10">
            專為餐飲店、企業採購及批發客戶提供高品質免洗袋、清潔袋及病媒防治產品。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/products" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-900 bg-white hover:bg-slate-50 transition">
              瀏覽商品 <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/quick-order" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent-600 hover:bg-accent-500 transition">
              快速訂購 (熟客)
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">供應產品</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all border border-slate-100 hover:border-primary-200">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-slate-100">
                <img src={cat.cover} alt={cat.name} className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
        <h2 className="text-3xl font-bold mb-6 text-slate-900">關於佑安企業</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
          我們致力於提供優質的免洗用品與清潔袋，服務無數餐飲業、企業與經銷商。
          從產品挑選到售後服務，我們始終秉持專業與熱誠。
        </p>
        <Link to="/about" className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
          了解更多公司資訊 <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
