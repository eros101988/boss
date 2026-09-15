import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause } from 'lucide-react';
import { products } from '../data/store';

// Pick representative products for the orbit (as close to 12 items for full orbit loop)
const heroProductIds = [
  '01_清潔袋-01_一般捲取式-大_45L',
  '01_清潔袋-02_拉繩式-大_45L_24張',
  '01_清潔袋-03_抽取式與業務用-超大_黑色_28張',
  '02_食品保鮮耐熱袋-01_台塑保鮮耐熱袋-200x300mm_150枚',
  '03_夾鏈袋-01_台塑LDPE夾鏈袋-08號_170x240mm',
  'fp-zipper-storage',
  'fp-freezer-bag',
  '04_病媒防治-01_蟑螂防治-快點絕_0.5百分比凝膠餌劑'
];

export default function HeroOrbit() {
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation state matching the reference exactly
  const requestRef = useRef<number>(0);
  const phaseRef = useRef<number>(0.45); // Starting phase from reference
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mediaQuery) {
      setIsPaused(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setIsPaused(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          w: entry.contentRect.width,
          h: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    
    // Initial size
    setDimensions({
      w: containerRef.current.clientWidth,
      h: containerRef.current.clientHeight
    });
    
    return () => observer.disconnect();
  }, []);

  const isActuallyPaused = isPaused || isHovered;

  // 3D Animation Loop based strictly on reference tick()
  useEffect(() => {
    const TAU = Math.PI * 2;
    
    const tick = (now: number) => {
      if (!isActuallyPaused) {
        const dt = lastTimeRef.current ? Math.min((now - lastTimeRef.current) / 1000, 0.05) : 0;
        phaseRef.current = (phaseRef.current + (dt * TAU) / 42) % TAU;
        // Trigger a re-render to update positions.
        // We do this by updating a dummy state or just forcing re-render.
        // Since we want high perf, setting state every frame in React might be slow,
        // but for compatibility with React component structure, we'll update phase state.
        setPhaseState(phaseRef.current); 
      }
      lastTimeRef.current = now;
      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);
    
    const handleVisibilityChange = () => {
      cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = 0;
      if (!document.hidden) {
        requestRef.current = requestAnimationFrame(tick);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActuallyPaused]);

  // Dummy state to force re-renders on tick
  const [phaseState, setPhaseState] = useState(phaseRef.current);

  const heroItems = heroProductIds.map(id => {
    const p = products.find(p => p.id === id);
    if (!p) return null;
    const hasSpecs = p.specs && p.specs.length > 0;
    const coverImg = hasSpecs ? (p.specs[0]?.images?.[0]?.path || p.shared_images?.[0]?.path) : (p.images[0]?.path || '');
    return {
      id: p.id,
      name: p.name,
      coverImg
    };
  }).filter((item): item is NonNullable<typeof item> => Boolean(item));

  // The reference uses 12 items, but we only have 8 in heroItems. Let's pad it out by repeating to match the 12 count if needed,
  // or just use 10 for mobile, 12 for desktop as per reference logic.
  // The reference: const mobile=w<600, n=mobile?10:12;
  const w = dimensions.w;
  const h = dimensions.h;
  const mobile = w > 0 && w < 600;
  const n = mobile ? 10 : 12;
  
  // Pad items to length 12 by repeating
  const displayItems = Array.from({ length: 12 }, (_, i) => heroItems[i % heroItems.length]);

  const togglePause = () => {
    setIsPaused(!isPaused);
    lastTimeRef.current = 0;
  };

  // Rendering logic derived directly from reference render()
  const renderCards = () => {
    if (w === 0 || h === 0) return null;
    
    const TAU = Math.PI * 2;
    const tilts = [-5, 3, -2, 4, -3, 2, -4, 3, -2, 5, -3, 2];
    
    // The ellipse is tilted in screen space; depth faces the lower-right foreground.
    const rx = w * (mobile ? 0.29 : 0.385);
    const ry = h * (mobile ? 0.32 : 0.335);
    const tilt = -0.30;
    
    // The original base size was for 16:10 canvases (600x375). 
    // We are using 1:1 squares now, so we will use the base width as both width and height.
    const base = mobile ? Math.min(84, w * 0.205) : Math.min(148, w * 0.11);

    return displayItems.map((item, i) => {
      if (i >= n) return null; // hide items beyond n
      
      const theta = phaseState + (i * TAU) / n;
      const x0 = rx * Math.cos(theta);
      const y0 = ry * Math.sin(theta);
      
      const x = w * 0.5 + x0 * Math.cos(tilt) - y0 * Math.sin(tilt);
      const y = h * 0.49 + x0 * Math.sin(tilt) + y0 * Math.cos(tilt);
      
      const depth = (Math.sin(theta + 0.62) + 1) / 2;
      const scale = 0.54 + 0.90 * Math.pow(depth, 1.5);
      
      const roll = tilts[i] + 1.8 * Math.sin(theta);
      const pitch = -3 * Math.sin(theta);
      const yaw = 6 * Math.cos(theta);
      
      const zIndex = Math.round(10 + depth * 10);

      return (
        <div
          key={`${item.id}-${i}`}
          className="absolute top-0 left-0 pointer-events-auto"
          style={{
            width: `${base}px`,
            height: `${base}px`, // Force 1:1 square ratio
            zIndex,
            transform: `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${scale}) rotate(${roll}deg) perspective(1100px) rotateX(${pitch}deg) rotateY(${yaw}deg)`
          }}
        >
          <Link
            to={`/products/${encodeURIComponent(item.id)}`}
            className="group relative w-full h-full block bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 p-2 hover:border-primary-400 transition-colors"
          >
            <img src={item.coverImg} alt={item.name} className="w-full h-full object-contain" />
            
            {/* Tooltip on hover (desktop only) */}
            {!mobile && (
              <div className="absolute inset-x-0 -bottom-2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div className="bg-slate-900 text-white text-xs font-medium py-2 px-3 rounded-lg shadow-xl text-center break-keep min-w-[120px] max-w-[200px] mx-auto">
                  {item.name}
                  <div className="text-primary-300 text-[10px] mt-1">查看規格 ↗</div>
                </div>
              </div>
            )}
          </Link>
        </div>
      );
    });
  };

  return (
    <div className="relative w-full h-[90svh] min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-x-clip overflow-y-visible bg-slate-50/50">
      
      {/* Central Brand Text - Safely in the middle */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto flex flex-col items-center text-center w-full max-w-[240px] sm:max-w-[320px] md:max-w-[450px]"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] font-extrabold text-slate-900 leading-tight mb-2 tracking-tight whitespace-nowrap">
          侑安國際
        </h1>
        <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-700 mb-4 whitespace-nowrap">
          包裝・清潔・日常耗材
        </h2>
        <p className="text-xs sm:text-base text-slate-600 mb-6 sm:mb-8 max-w-[200px] sm:max-w-sm mx-auto">
          從日常備品到營業所需，找到合適的用品。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link 
            to="/products" 
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-slate-900 text-white text-sm sm:text-base font-bold rounded-full hover:bg-slate-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
          >
            瀏覽全部商品
          </Link>
          <a 
            href="https://line.me/R/ti/p/%40593cexey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-slate-900 text-sm sm:text-base font-bold rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition shadow-sm hover:shadow text-center"
          >
            LINE 聯絡詢價
          </a>
        </div>
      </div>

      {/* The Orbit Scene Container */}
      <div 
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
        onMouseEnter={() => !mobile && setIsHovered(true)}
        onMouseLeave={() => !mobile && setIsHovered(false)}
        onFocus={() => !mobile && setIsHovered(true)}
        onBlur={() => !mobile && setIsHovered(false)}
      >
        {renderCards()}
      </div>

      {/* Animation Controls (Desktop only) */}
      {!mobile && (
        <button 
          onClick={togglePause}
          className="absolute bottom-8 right-8 z-20 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm border border-slate-200 transition focus:outline-none"
          title={isPaused ? "播放動畫" : "暫停動畫"}
        >
          {isPaused ? <Play className="w-4 h-4 ml-0.5" /> : <Pause className="w-4 h-4" />}
        </button>
      )}

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-400 animate-bounce z-20">
        <span className="text-xs font-medium uppercase tracking-widest mb-1">探索產品</span>
        <div className="w-px h-6 bg-slate-300"></div>
      </div>
    </div>
  );
}
