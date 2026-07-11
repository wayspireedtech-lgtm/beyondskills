import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PartnerLogo from './PartnerLogo';

const PARTNERS = [
  { display: 'Google Cloud', key: 'Google Cloud Partner' },
  { display: 'Meta Ads', key: 'Meta Ads Agency Partner' },
  { display: 'AWS Cloud', key: 'AWS Cloud Architect' },
  { display: 'Microsoft Hub', key: 'Microsoft Hub Member' },
  { display: 'Razorpay', key: 'Razorpay Integrated Gateway' },
  { display: 'HubSpot', key: 'HubSpot Partner' },
  { display: 'Vercel', key: 'Vercel Partner System' },
  { display: 'Shopify', key: 'Shopify Experts Team' }
];

export default function Curved3DCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);

  // Check viewport width for responsive calculations
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle slide transitions
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + PARTNERS.length) % PARTNERS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % PARTNERS.length);
  };

  // Auto-play feature (Dribbble style)
  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, 1500);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused]);

  // Calculate circular wrap-around offsets
  const getOffset = (index) => {
    let offset = index - activeIndex;
    while (offset < -Math.floor(PARTNERS.length / 2)) offset += PARTNERS.length;
    while (offset > Math.floor(PARTNERS.length / 2)) offset -= PARTNERS.length;
    return offset;
  };

  return (
    <section 
      className="relative w-full bg-[#FCE7F3]/70 py-12 md:py-16 overflow-hidden z-10 select-none border-y border-pink-200/40"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Curved Cutout Overlay */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none z-20">
        <svg viewBox="0 0 1440 100" className="w-full h-auto fill-white scale-y-[1.1] origin-top">
          <path d="M0,0 L1440,0 L1440,20 Q720,80 0,20 Z" />
        </svg>
      </div>

      {/* Main 3D Slider Area */}
      <div 
        className="relative w-full h-[180px] md:h-[220px] flex items-center justify-center"
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        {PARTNERS.map((partner, idx) => {
          const offset = getOffset(idx);
          const absOffset = Math.abs(offset);
          
          // Layout calculations for smaller round partner cards
          const separation = isMobile ? 95 : 180;
          const translateX = offset * separation;
          const translateZ = absOffset * (isMobile ? -35 : -65);
          const rotateY = offset * (isMobile ? 18 : 25);
          const scale = isMobile ? (1 - absOffset * 0.12) : (1 - absOffset * 0.08);
          
          const isActive = idx === activeIndex;

          return (
            <div
              key={partner.key}
              onClick={() => {
                if (offset !== 0) setActiveIndex(idx);
              }}
              className={`absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-white shadow-xl shadow-pink-900/10 border border-slate-200/60 flex flex-col items-center justify-center p-3 text-center space-y-1 md:space-y-1.5 cursor-pointer hover:border-brand-purple/40`}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex: 10 - absOffset,
                opacity: absOffset > 3 ? 0 : absOffset === 3 ? 0.35 : 1,
                pointerEvents: absOffset > 1 ? 'none' : 'auto',
                transition: 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.55s ease, z-index 0.55s ease',
              }}
            >
              <PartnerLogo name={partner.key} className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
              <span className="text-[8px] md:text-[9.5px] font-extrabold text-slate-800 uppercase tracking-tight leading-tight max-w-[85px] line-clamp-2">
                {partner.display}
              </span>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-4 mt-4 relative z-30">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full border border-brand-purple/50 text-brand-purple flex items-center justify-center hover:bg-brand-purple hover:text-white transition-all duration-300 active:scale-95 cursor-pointer bg-white/90 backdrop-blur-sm shadow-md hover:shadow-brand-purple/15"
          aria-label="Previous partner"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full border border-brand-purple/50 text-brand-purple flex items-center justify-center hover:bg-brand-purple hover:text-white transition-all duration-300 active:scale-95 cursor-pointer bg-white/90 backdrop-blur-sm shadow-md hover:shadow-brand-purple/15"
          aria-label="Next partner"
        >
          <ArrowRight className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Bottom Curved Cutout Overlay */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none z-20">
        <svg viewBox="0 0 1440 100" className="w-full h-auto fill-white scale-y-[1.1] origin-bottom">
          <path d="M0,100 L1440,100 L1440,80 Q720,20 0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
