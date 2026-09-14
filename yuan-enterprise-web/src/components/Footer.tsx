export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">佑安企業 (名稱待確認)</h3>
            <p className="text-sm">專業供應餐飲、企業、批發之各類免洗包裝與清潔用品。</p>
            <p className="text-sm mt-4 text-accent-500">※ 本站為展示系統，價格與交期將由專人與您確認</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">快速連結</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="hover:text-white transition">所有商品</a></li>
              <li><a href="/quick-order" className="hover:text-white transition">快速訂購</a></li>
              <li><a href="/about" className="hover:text-white transition">企業介紹</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">聯絡我們</h3>
            <ul className="space-y-2 text-sm">
              <li>電話：[待補]</li>
              <li>LINE：[待補]</li>
              <li>地址：[待補]</li>
              <li>營業時間：[待補]</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-700 text-sm text-center">
          &copy; {new Date().getFullYear()} 佑安企業. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
