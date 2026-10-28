import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Camera, Upload, Sprout } from 'lucide-react';
import { optimizeImageFile, CustomSlide } from '../utils/photoStorage';

interface HeroProps {
  slides: CustomSlide[];
  isLocked?: boolean;
  onHeroSlidesUpdate: (slides: CustomSlide[]) => void;
  onExploreShop: () => void;
  onExplorePortfolio: () => void;
  onBookTour: () => void;
  onOpenPhotoManager?: () => void;
  onNavigateToArugula?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  slides,
  isLocked = true,
  onHeroSlidesUpdate,
  onExploreShop,
  onExplorePortfolio,
  onBookTour,
  onOpenPhotoManager,
  onNavigateToArugula,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasSlides = slides && slides.length > 0;
  const currentSlide = hasSlides ? slides[currentIndex % slides.length] : null;

  const handleNext = useCallback(() => {
    if (!hasSlides || slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [hasSlides, slides.length]);

  const handlePrev = useCallback(() => {
    if (!hasSlides || slides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [hasSlides, slides.length]);

  // Slideshow auto-advance interval
  useEffect(() => {
    if (!isPlaying || isHovered || !hasSlides || slides.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, isHovered, hasSlides, slides.length, handleNext]);

  // Process uploaded photos
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const newItems: CustomSlide[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const optimized = await optimizeImageFile(file, 1600, 1200, 0.82);
        const cleanName = file.name.replace(/\.[^/.]+$/, '').slice(0, 32);
        newItems.push({
          id: `hero-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          url: optimized,
          title: cleanName || 'Farm Harvest',
          subtitle: 'Balas, Bacolor, Pampanga',
          isCustom: true,
          uploadedAt: Date.now(),
        });
      }

      if (newItems.length > 0) {
        onHeroSlidesUpdate([...newItems, ...slides]);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Error optimizing hero photos', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-[#E6DFD3] bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Asymmetric Split Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-stretch">
          
          {/* Column 1: Editorial Value Proposition & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              {/* Category eyebrow with dispatch notice */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-4">
                <span>Direct From Living Soil</span>
                <span aria-hidden="true">·</span>
                <span>Balas, Bacolor, Pampanga</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#1B3523] bg-emerald-100/80 px-2.5 py-0.5 rounded-sm font-mono text-[11px] font-bold">
                  3:00 PM PHT Dispatch
                </span>
              </div>

              {/* Display Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] font-serif font-bold text-[#1B3523] tracking-tight [text-wrap:balance]">
                Wild greens &amp; living produce picked at dawn in Pampanga.
              </h1>

              {/* Subtitle / Core Narrative */}
              <p className="mt-5 text-base sm:text-lg text-stone-700 leading-relaxed max-w-xl font-sans font-normal">
                Grown across 7 hectares in Balas, Bacolor using microbial compost windrows, companion planting, and zero synthetic chemicals. Harvested within hours of delivery to your kitchen.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={onExploreShop}
                  className="px-6 py-3.5 bg-[#1B3523] text-stone-100 font-medium text-sm rounded-lg hover:bg-[#122418] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
                >
                  Shop Today’s Harvest
                </button>
                <button
                  onClick={onExplorePortfolio}
                  className="px-6 py-3.5 bg-transparent text-[#1B3523] border border-[#1B3523]/40 font-medium text-sm rounded-lg hover:bg-[#1B3523]/5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Our Farming Methods
                </button>
                {!isLocked && onOpenPhotoManager && (
                  <button
                    onClick={onOpenPhotoManager}
                    className="px-4 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-medium text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Manage My Photos</span>
                  </button>
                )}
              </div>

              {/* Direct Arugula Top Sale Special Page Highlight */}
              {onNavigateToArugula && (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={onNavigateToArugula}
                    className="inline-flex items-center gap-2.5 px-4 py-2 bg-emerald-950/5 hover:bg-emerald-950/10 text-[#1B3523] border border-emerald-900/20 rounded-xl text-xs font-medium transition-all shadow-2xs group cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="font-semibold">Grassroots #1 Top Sale:</span>
                    <span>Signature Balas Wild Arugula</span>
                    <span className="text-[10px] font-bold bg-[#984D2E] text-white px-2 py-0.5 rounded uppercase ml-1">
                      Explore Special Page →
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Farm status */}
            <div className="mt-8 lg:mt-0 flex items-center justify-between text-xs text-stone-500 pt-4 border-t border-stone-200/60">
              <span>Balas, Bacolor Farm Gate: Open for fresh pickup</span>
              <button
                onClick={onBookTour}
                className="hover:text-stone-900 underline underline-offset-4 font-medium transition-colors cursor-pointer"
              >
                Book Farm Visit &amp; Walk
              </button>
            </div>
          </div>

          {/* Column 2: Visual Hero Showcase */}
          <div
            className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#E6DFD3] bg-stone-900 transition-all min-h-[420px] lg:min-h-full group flex flex-col justify-between shadow-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {hasSlides && currentSlide ? (
              <>
                {/* Top Toolbar: Counter, Play/Pause & Add Photos */}
                <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between gap-2 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-black/75 backdrop-blur-md text-white text-xs font-mono font-medium rounded-full border border-white/20 shadow-md">
                      {currentIndex + 1} / {slides.length}
                    </span>

                    <span className="px-2.5 py-1 bg-emerald-700/90 backdrop-blur-md text-white text-[11px] font-medium rounded-full border border-emerald-400/30 shadow-md flex items-center gap-1">
                      <span>Your Farm Photos</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      className="inline-flex items-center gap-1 px-3 py-1 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs rounded-full border border-white/20 transition-all cursor-pointer shadow-sm"
                      title="Upload more photos"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{isUploading ? 'Saving...' : '+ Add'}</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>

                    {slides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 bg-black/75 hover:bg-black/95 backdrop-blur-md text-white text-xs rounded-full transition-all shadow-md hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
                        title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                        aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                      >
                        {isPlaying ? (
                          <Pause className="w-3.5 h-3.5 text-amber-300" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Slideshow Image Display */}
                <div className="relative w-full h-full min-h-[420px] lg:h-full lg:absolute lg:inset-0 bg-stone-900">
                  <img
                    key={currentSlide.id}
                    src={currentSlide.url}
                    alt={currentSlide.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover min-h-[420px] lg:h-full lg:absolute lg:inset-0 transition-opacity duration-500 ease-in-out select-none"
                  />

                  {/* Navigation Arrows: Left & Right */}
                  {slides.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/60 hover:bg-black/85 text-white rounded-full backdrop-blur-md border border-white/20 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg cursor-pointer"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/60 hover:bg-black/85 text-white rounded-full backdrop-blur-md border border-white/20 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg cursor-pointer"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Bottom Scrim with Slide Info & 3:00 PM PHT Dispatch */}
                <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white flex flex-col gap-3 pointer-events-auto">
                  
                  {/* Pagination Dots */}
                  {slides.length > 1 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                      {slides.map((slide, idx) => (
                        <button
                          key={slide.id}
                          onClick={() => setCurrentIndex(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            idx === currentIndex
                              ? 'w-7 bg-emerald-400'
                              : 'w-2 bg-white/40 hover:bg-white/70'
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Slide Meta and 3:00 PM PHT Dispatch Time */}
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0 pr-2">
                      <p className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold truncate">
                        Balas, Bacolor, Pampanga · 7 Hectares
                      </p>
                      <p className="text-sm sm:text-base font-serif font-bold text-stone-100 leading-snug line-clamp-1">
                        {currentSlide.title}
                      </p>
                      <p className="text-xs text-stone-300 truncate">
                        {currentSlide.subtitle}
                      </p>
                    </div>

                    {/* 3:00 PM PHT Time Badge */}
                    <div className="shrink-0 flex flex-col items-end text-right">
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-medium">
                        Daily Dispatch
                      </span>
                      <div className="mt-0.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 backdrop-blur-md rounded border border-emerald-400/40 text-white shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-mono font-bold tabular-nums">3:00 PM PHT</span>
                      </div>
                    </div>
                  </div>

                </div>
              </>
            ) : (
              /* When NO slides exist yet: Clean, Natural Showcase with Direct Upload */
              <div className="relative w-full h-full min-h-[440px] flex flex-col justify-between p-6 sm:p-8 bg-[#F4EFE6] text-stone-900 border-2 border-dashed border-[#D2C5B4] rounded-2xl select-none">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/10 text-[#1B3523] text-xs font-semibold uppercase tracking-wider">
                    <Camera className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Your Farm Photo Showcase</span>
                  </div>
                </div>

                <div className="my-auto py-8 text-center flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-[#E0D7C8] shadow-sm flex items-center justify-center text-emerald-800 mb-4">
                    <Camera className="w-9 h-9 text-emerald-900" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3523] tracking-tight max-w-md">
                    Top Farm Slideshow
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-sm leading-relaxed">
                    Upload your farm photos here. They will appear right at the top of your website in a smooth slideshow.
                  </p>

                  <div className="mt-6">
                    <label className="inline-flex items-center gap-2 px-5 py-3 bg-[#1B3523] hover:bg-[#122418] text-white text-xs sm:text-sm font-semibold rounded-xl cursor-pointer transition-all shadow-md active:scale-98">
                      <Upload className="w-4 h-4 text-emerald-300" />
                      <span>{isUploading ? 'Optimizing Photos...' : 'Upload Photos from Device'}</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E0D7C8] flex items-center justify-between text-xs text-stone-600">
                  <div>
                    <span className="font-semibold text-stone-800">Balas, Bacolor, Pampanga</span>
                    <span className="hidden sm:inline text-stone-400"> · 7 Hectares Living Soil</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded border border-stone-300 text-stone-800 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-[11px] font-mono font-bold">Next Dispatch: 3:00 PM PHT</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4-Column KPI / Trust Strip */}
        <div className="mt-14 pt-8 border-t border-[#E6DFD3] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1B3523] tabular-nums">7 Hectares</p>
            <p className="text-xs text-stone-600 font-medium">Balas, Bacolor, Pampanga</p>
            <p className="text-[11px] text-stone-500">Family-owned &amp; rooted consciously</p>
          </div>
          
          <div className="space-y-1">
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1B3523] tabular-nums">&lt; 12 Hours</p>
            <p className="text-xs text-stone-600 font-medium">Soil-to-Doorstep Freshness</p>
            <p className="text-[11px] text-stone-500">Picked fresh on harvest day</p>
          </div>

          <div className="space-y-1">
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1B3523] tabular-nums">100%</p>
            <p className="text-xs text-stone-600 font-medium">Natural Organic Practices</p>
            <p className="text-[11px] text-stone-500">Zero synthetic chemical fertilizers</p>
          </div>

          <div className="space-y-1">
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1B3523] tabular-nums">21+ Crops</p>
            <p className="text-xs text-stone-600 font-medium">Fresh Daily Pricelist</p>
            <p className="text-[11px] text-stone-500">Arugula, greens, berries &amp; farm eggs</p>
          </div>
        </div>

      </div>
    </section>
  );
};
