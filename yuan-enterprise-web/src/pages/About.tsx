import { Building2, FileCheck, Phone, MapPin } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        <div className="bg-primary-900 text-white p-8 md:p-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">關於侑安國際有限公司</h1>
          <p className="text-primary-100 max-w-2xl mx-auto">
            以品質立信，以服務致遠<br/>
            台塑原料專業經銷、免洗餐具包材、客製化包材服務。為什麼選擇我們：專業、穩定、長期。
          </p>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center text-primary-600 mb-4">
                <Building2 className="w-6 h-6 mr-2" />
                <h2 className="text-2xl font-bold text-slate-900">企業介紹</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                我們提供多樣化的產品線，從一般清潔袋、醫療感染袋到各類食品保鮮袋與病媒防治產品，滿足您在營業或工業上的各種需求。我們堅持品質，提供最可靠的產品。
              </p>
            </div>
            
            <div>
              <div className="flex items-center text-primary-600 mb-4">
                <FileCheck className="w-6 h-6 mr-2" />
                <h2 className="text-2xl font-bold text-slate-900">認證與授權</h2>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <img 
                  src="/assets/90_企業與授權資料/01_廣告委託及許可資料/金禾盛與佑安_授權附件/授權及執照合併圖__IMG_0263.JPG" 
                  alt="授權及執照" 
                  className="w-full h-auto rounded shadow-sm mb-2"
                />
                <p className="text-sm text-slate-500 text-center">
                  相關廣告委託及許可資料
                </p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 mb-12" />

          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">聯絡資訊</h2>
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100">
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-primary-600 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900">電話</h3>
                    <p className="text-slate-600 mt-1">02-24521268</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 text-primary-600 mr-4 flex-shrink-0 flex items-center justify-center font-bold">
                    F
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">FAX</h3>
                    <p className="text-slate-600 mt-1">02-24521579</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 text-primary-600 mr-4 flex-shrink-0 flex items-center justify-center font-bold">
                    L
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">LINE 官方帳號</h3>
                    <p className="text-slate-600 mt-1">@593cexey</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-primary-600 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900">地址</h3>
                    <p className="text-slate-600 mt-1">基隆市七堵區工建北路5號</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
