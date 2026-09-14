export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">侑安國際有限公司</h3>
            <p className="text-sm">以品質立信，以服務致遠<br/>台塑原料專業經銷、免洗餐具包材、客製化包材服務。</p>
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
              <li>電話：02-24521268</li>
              <li>FAX：02-24521579</li>
              <li>LINE ID：@593cexey</li>
              <li>地址：基隆市七堵區工建北路5號</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-700 text-sm text-center">
          &copy; {new Date().getFullYear()} 侑安國際有限公司. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
