import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroOrbit from '../components/HeroOrbit';
import { categories, products } from '../data/store';

export default function Home() {
  // Select some featured products for the fallback/featured list
  const featuredProductIds = [
    '01_清潔袋-01_一般捲取式-大_45L',
    '02_食品保鮮耐熱袋-01_台塑保鮮耐熱袋-200x300mm_150枚',
    '03_夾鏈袋-01_台塑LDPE夾鏈袋-08號_170x240mm',
    'fp-zipper-storage',
    'fp-freezer-bag',
    '04_病媒防治-02_老鼠防治-一錠鼠_滅鼠餌劑'
  ];
  
  const featuredProducts = featuredProductIds.map(id => products.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroOrbit />

      {/* Quick Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto w-full">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
          <span className="w-1.5 h-6 bg-primary-600 rounded-full mr-3"></span>
          依用途找產品
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => {
            let desc = '';
            if (cat.id === '01_清潔袋') desc = '各式尺寸與厚度，滿足家用與營業需求';
            else if (cat.id === '02_食品保鮮耐熱袋') desc = '安全無毒材質，適合高溫食物裝盛';
            else if (cat.id === '03_夾鏈袋') desc = '提供普通夾鏈、密實與冷凍等多種規格';
            else if (cat.id === '04_病媒防治') desc = '專業級蟑螂老鼠防治，維持環境衛生';

            return (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all border border-slate-100 hover:border-primary-200 flex flex-col">
                <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-slate-50 border-b border-slate-100">
                  <img src={cat.cover} alt={cat.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-2">{cat.name}</h3>
                  <p className="text-sm text-slate-500 flex-grow">{desc}</p>
                  <div className="mt-4 text-primary-600 text-sm font-medium flex items-center">
                    查看系列 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products (Fallback list) */}
      <section className="bg-slate-50 border-y border-slate-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <span className="w-1.5 h-6 bg-accent-500 rounded-full mr-3"></span>
              產品選覽
            </h2>
            <Link to="/products" className="text-primary-600 font-medium hover:text-primary-700 hidden sm:flex items-center">
              看全部商品 <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-5">
            {featuredProducts.map(product => {
              if (!product) return null;
              const hasSpecs = product.specs && product.specs.length > 0;
              const coverImg = hasSpecs ? (product.specs[0]?.images?.[0]?.path || product.shared_images?.[0]?.path) : (product.images[0]?.path || '');
              
              let specString = '';
              if (hasSpecs) {
                specString = product.specs.map(s => s.label).join(' / ');
              } else if (product.parsedSpec) {
                specString = [product.parsedSpec.size_or_type, product.parsedSpec.capacity_or_dim].filter(Boolean).join(' ');
              }

              return (
                <Link key={product.id} to={`/products/${encodeURIComponent(product.id)}`} className="group bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 overflow-hidden flex flex-col transition-all">
                  <div className="aspect-w-1 aspect-h-1 w-full bg-white relative border-b border-slate-50">
                    {coverImg ? (
                      <img src={coverImg} alt={product.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">無圖片</div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                    <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <div className="text-xs text-slate-500 mt-auto line-clamp-1">
                      {specString || '標準規格'}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/products" className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-slate-200 rounded-md text-slate-700 font-medium hover:bg-slate-50 transition w-full">
              瀏覽全部商品
            </Link>
          </div>
        </div>
      </section>

      {/* About Section Teaser */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">關於侑安國際有限公司</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">
          以品質立信，以服務致遠。我們提供台塑原料專業經銷、免洗餐具包材、客製化包材服務。
          為什麼選擇我們：專業、穩定、長期。
        </p>
        <Link to="/about" className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
          了解詳細企業資訊 <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
