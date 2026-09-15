import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause } from 'lucide-react';
import { products } from '../data/store';

// Pick 8 representative products for the orbit
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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Animation state
  const requestRef = useRef<number>(0);
  const [time, setTime] = useState(0);
  
  const isActuallyPaused = isPaused || isHovered || prefersReducedMotion;

  // 3D Animation Loop
  useEffect(() => {
    if (isMobile || isActuallyPaused) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    let lastTime = performance.now();
    const animate = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      
      // Update time: 1 unit per roughly 60 seconds loop
      // dt is in ms, we want time to go from 0 to 2*PI over ~60s
      setTime(prevTime => (prevTime + (dt / 60000) * Math.PI * 2) % (Math.PI * 2));
      
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isMobile, isActuallyPaused]);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mediaQuery) {
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const displayItems = isMobile ? heroItems.slice(0, 6) : heroItems;
  const numItems = displayItems.length;

  const togglePause = () => setIsPaused(!isPaused);

  return (
    <div className="relative w-full h-[90svh] min-h-[700px] flex items-center justify-center overflow-hidden bg-slate-50/50">
      {/* Central Brand Text */}
      <div className="relative z-10 text-center px-4 w-full max-w-[35%] md:max-w-[40%] flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">
          侑安國際
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-700 mb-4">
          包裝・清潔・日常耗材
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-sm mx-auto">
          從日常備品到營業所需，找到合適的用品。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            to="/products" 
            className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
          >
            瀏覽全部商品
          </Link>
          <a 
            href="https://line.me/R/ti/p/%40593cexey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-white text-slate-900 font-bold rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition shadow-sm hover:shadow text-center"
          >
            LINE 聯絡詢價
          </a>
        </div>
      </div>

      {/* Orbiting Products */}
      {!isMobile ? (
        <div 
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{ perspective: '1200px' }}
        >
          <div 
            className="relative w-full h-full max-w-[1400px]"
            style={{ transformStyle: 'preserve-3d' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
          >
            {displayItems.map((item, index) => {
              // Initial phase for this item
              const phaseOffset = (index / numItems) * Math.PI * 2;
              const theta = time + phaseOffset;

              // Base radius settings
              // Expand the orbit so it wraps around the center text
              const rx = window.innerWidth < 1280 ? (window.innerWidth < 1024 ? 350 : 450) : 550; // X radius
              const ry = window.innerWidth < 1280 ? (window.innerWidth < 1024 ? 120 : 150) : 180;  // Y radius
              
              // 3D positioning using parametric equation of tilted circle
              // Tilt the plane slightly to create depth (z changes with sin/cos)
              // Added slight offset to center to avoid hitting the header
              const x = rx * Math.cos(theta);
              const y = ry * Math.sin(theta) + 30 * Math.cos(theta); // slight tilt in Y
              const z = 350 * Math.sin(theta); // Depth amplitude
              
              // Calculate scaling based on Z to enhance depth perception without relying solely on perspective
              // (Z goes from -350 to +350 roughly)
              // Z is positive when closer to viewer
              // Reduce the scale difference to avoid making close items too gigantic
              const scale = 1 + (z / 1200); 
              
              // Sort by Z index so closer items are drawn on top
              const zIndex = Math.floor(z + 1000);

              // Calculate a slight rotation so cards face mostly forward but turn a bit to follow the path
              const rotateY = Math.cos(theta) * 20; // rotate slightly left/right based on X position
              const rotateX = Math.sin(theta) * 10; // slightly tilt up/down
              
              return (
                <div
                  key={item.id}
                  className="absolute top-1/2 left-1/2 pointer-events-auto mt-4"
                  style={{
                    transform: `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, ${z}px) scale(${scale}) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
                    zIndex,
                    // Use a slightly larger card size for desktop
                    width: '200px',
                    height: '200px',
                    transition: isActuallyPaused ? 'transform 0.5s ease-out' : 'none'
                  }}
                >
                  <Link
                    to={`/products/${encodeURIComponent(item.id)}`}
                    className="group relative w-full h-full block bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 p-3 hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:border-primary-200 transition-all duration-300"
                  >
                    <img src={item.coverImg} alt={item.name} className="w-full h-full object-contain" />
                    
                    {/* Tooltip on hover */}
                    <div className="absolute inset-x-0 -bottom-2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="bg-slate-900 text-white text-xs font-medium py-2 px-3 rounded-lg shadow-xl text-center break-keep min-w-[120px] max-w-[200px] mx-auto">
                        {item.name}
                        <div className="text-primary-300 text-[10px] mt-1">查看商品</div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Mobile Layout: Static scattered cards around the center */
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {displayItems.map((item, index) => {
            // Pre-calculated scattered positions for mobile (top-left, top-right, etc.)
            const positions = [
              { top: '10%', left: '5%' },
              { top: '15%', right: '5%' },
              { bottom: '25%', left: '2%' },
              { bottom: '20%', right: '2%' },
              { top: '45%', left: '-5%' },
              { top: '50%', right: '-5%' },
            ];
            const pos = positions[index % positions.length];
            
            return (
              <div 
                key={item.id}
                className="absolute animate-[float_6s_ease-in-out_infinite]"
                style={{ ...pos, animationDelay: `${index * 0.7}s` }}
              >
                <Link
                  to={`/products/${encodeURIComponent(item.id)}`}
                  className="pointer-events-auto block w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] bg-white rounded-xl shadow-lg border border-slate-100 p-2"
                >
                  <img src={item.coverImg} alt={item.name} className="w-full h-full object-contain" />
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Animation Controls (Desktop only) */}
      {!isMobile && (
        <button 
          onClick={togglePause}
          className="absolute bottom-8 right-8 z-20 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm border border-slate-200 transition focus:outline-none"
          title={isPaused ? "播放動畫" : "暫停動畫"}
        >
          {isPaused ? <Play className="w-4 h-4 ml-0.5" /> : <Pause className="w-4 h-4" />}
        </button>
      )}

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-400 animate-bounce">
        <span className="text-xs font-medium uppercase tracking-widest mb-1">探索產品</span>
        <div className="w-px h-6 bg-slate-300"></div>
      </div>
    </div>
  );
}
