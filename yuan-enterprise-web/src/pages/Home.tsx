import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import HeroOrbit from '../components/HeroOrbit';

export default function Home() {
  // Define product series to display in the single clean section
  const productSeries = [
    {
      id: 'series-general',
      title: '一般清潔袋',
      desc: '平底封口設計，日常收納與家用垃圾的首選。',
      spec: '中/大/特大/超大/超小',
      img: '/assets/01_清潔袋/01_一般捲取式/中_20L/規格圖__IMG_0221.JPG', // TODO: process single item img
      link: '/products?category=01_清潔袋&subcategory=01_一般捲取式'
    },
    {
      id: 'series-drawstring',
      title: '拉繩清潔袋',
      desc: '抽繩設計不沾手，輕鬆打包提著走。',
      spec: '大/特大/超大/巨無霸',
      img: '/assets/01_清潔袋/02_拉繩式/大_45L_24張/規格圖__IMG_0230.JPG', // TODO: process single item img
      link: '/products?category=01_清潔袋&subcategory=02_拉繩式'
    },
    {
      id: 'series-extract',
      title: '抽取式清潔袋',
      desc: '單張抽取好方便，大容量適合營業場所。',
      spec: '超大/超特大/超巨大/超巨霸',
      img: '/assets/01_清潔袋/03_抽取式與業務用/超大_黑色_28張/規格圖__IMG_0239.JPG', // TODO: process single item img
      link: '/products?category=01_清潔袋&subcategory=03_抽取式與業務用'
    },
    {
      id: 'series-food-heat',
      title: '保鮮耐熱袋',
      desc: '耐高溫材質，適合熱食分裝與熱湯盛裝。',
      spec: '200x300mm / 280x410mm',
      img: '/assets/02_食品保鮮耐熱袋/01_台塑保鮮耐熱袋/200x300mm_150枚/包裝正面圖__IMG_0243.JPG', // TODO: process single item img
      link: '/products?category=02_食品保鮮耐熱袋'
    },
    {
      id: 'series-zipper',
      title: '普通夾鏈袋',
      desc: '多尺寸透明夾鏈袋，小物收納分類最實用。',
      spec: '00特小號 ~ 12號',
      img: '/assets/03_夾鏈袋/01_台塑LDPE夾鏈袋/08號_170x240mm/規格圖__IMG_0248.JPG', // TODO: process single item img
      link: '/products?category=03_夾鏈袋&subcategory=01_台塑LDPE夾鏈袋'
    },
    {
      id: 'series-storage',
      title: '保鮮密實袋',
      desc: '雙軌夾鏈加強密封，分裝食材更有條理。',
      spec: '大 / 中',
      img: '/assets/03_夾鏈袋/02_台塑保鮮密實袋/L_大_20張每盒/01_包裝正面主圖__IMG_0282.JPG',
      link: '/products?category=03_夾鏈袋&subcategory=02_台塑保鮮密實袋'
    },
    {
      id: 'series-freezer',
      title: '保鮮冷凍袋',
      desc: '加厚防凍設計，適合生鮮魚肉冷凍保存。',
      spec: '大 / 中',
      img: '/assets/03_夾鏈袋/03_台塑保鮮冷凍袋/L_大_14張每盒/01_包裝正面主圖__IMG_0284.JPG',
      link: '/products?category=03_夾鏈袋&subcategory=03_台塑保鮮冷凍袋'
    },
    {
      id: 'series-pest',
      title: '病媒防治',
      desc: '專業級蟑螂老鼠防治餌劑，維持環境衛生。',
      spec: '快點絕 / 一錠鼠',
      img: '/assets/04_病媒防治/02_老鼠防治/一錠鼠_滅鼠餌劑/01_包裝主圖__IMG_0268.JPG',
      link: '/products?category=04_病媒防治'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroOrbit />

      {/* Product Series Section */}
      <section className="bg-white border-t border-slate-100 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-slate-100 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              產品系列
            </h2>
            <Link to="/products" className="text-primary-600 font-medium hover:text-primary-700 flex items-center transition group">
              查看全部商品 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0 md:gap-y-8">
            {productSeries.map((series, idx) => (
              <Link 
                key={series.id} 
                to={series.link} 
                className={`group flex items-center p-4 -mx-4 md:mx-0 md:p-6 md:rounded-2xl transition-all duration-300 hover:bg-slate-50 ${idx !== productSeries.length - 1 ? 'border-b border-slate-100 md:border-transparent' : ''}`}
              >
                {/* 1:1 Image Container */}
                <div className="w-[112px] h-[112px] sm:w-[124px] sm:h-[124px] md:w-[144px] md:h-[144px] flex-shrink-0 bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-3 group-hover:border-primary-200 transition-colors">
                  <img 
                    src={series.img} 
                    alt={series.title} 
                    className="w-[85%] h-[85%] object-contain"
                  />
                </div>
                
                {/* Text Content */}
                <div className="ml-4 sm:ml-5 flex-1 min-w-0 flex flex-col justify-center min-h-[112px]">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 truncate">
                    {series.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2 sm:mb-3 leading-relaxed line-clamp-2">
                    {series.desc}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-slate-500 truncate pr-2">
                      規格：{series.spec}
                    </span>
                    <span className="flex-shrink-0 text-primary-600 text-sm font-medium flex items-center group-hover:text-primary-700">
                      <span className="hidden sm:inline">查看規格</span>
                      <ArrowUpRight className="w-4 h-4 sm:ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/products" className="inline-flex items-center justify-center px-6 py-3 bg-white border border-slate-200 rounded-md text-slate-700 font-medium hover:bg-slate-50 transition w-full shadow-sm">
              查看全部商品
            </Link>
          </div>
        </div>
      </section>

      {/* About Section Teaser */}
      <section className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900">關於侑安國際有限公司</h2>
        <p className="text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
          以品質立信，以服務致遠。我們提供台塑原料專業經銷、免洗餐具包材、客製化包材服務。
          為什麼選擇我們：專業、穩定、長期。
        </p>
        <Link to="/about" className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition">
          了解詳細企業資訊 <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
