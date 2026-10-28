import React, { useState } from 'react';
import { ShoppingBag, Menu, X, ArrowUpRight, Camera, BarChart3 } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  isLocked?: boolean;
  onOpenCart: () => void;
  onOpenTourModal: () => void;
  onOpenPhotoManager?: () => void;
  onNavigateToArugula?: () => void;
  onOpenAnalytics?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  isLocked = true,
  onOpenCart,
  onOpenTourModal,
  onOpenPhotoManager,
  onNavigateToArugula,
  onOpenAnalytics,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E6DFD3] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#"
            className="flex items-center gap-2 hover:opacity-95 transition-opacity whitespace-nowrap shrink-0"
            aria-label="Grassroots & Co. Farms Home"
          >
            <Logo className="h-11 sm:h-12" />
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-stone-700">
            {onNavigateToArugula && (
              <button
                type="button"
                onClick={onNavigateToArugula}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-900/10 hover:bg-emerald-900/20 text-[#1B3523] rounded-full font-semibold transition-all border border-emerald-800/20 shadow-2xs cursor-pointer group"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Signature Arugula</span>
                <span className="text-[10px] bg-[#984D2E] text-white px-1.5 py-0.2 rounded font-mono font-bold uppercase">#1 Top Sale</span>
              </button>
            )}
            <a
              href="#shop"
              className="hover:text-[#1B3523] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              Shop Produce
            </a>
            <a
              href="#portfolio"
              className="hover:text-[#1B3523] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              Living Soil &amp; Farm
            </a>
            <a
              href="#calendar"
              className="hover:text-[#1B3523] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              Harvest Calendar
            </a>
            <a
              href="#recipes"
              className="hover:text-[#1B3523] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              Field Recipes
            </a>
            <a
              href="#reviews"
              className="hover:text-[#1B3523] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              Reviews
            </a>
          </nav>

          {/* Zone 3: Actions (Photos trigger & Cart) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {onOpenAnalytics && (
              <button
                type="button"
                onClick={onOpenAnalytics}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold border border-stone-300 transition-colors shadow-2xs cursor-pointer"
                title="View Website Traffic & Visitor Insights"
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-800" />
                <span className="hidden md:inline">Traffic</span>
              </button>
            )}

            {!isLocked && onOpenPhotoManager && (
              <button
                type="button"
                onClick={onOpenPhotoManager}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold border border-stone-300 transition-colors shadow-2xs cursor-pointer"
                title="Manage all uploaded photos"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-800" />
                <span>My Photos</span>
              </button>
            )}

            <button
              onClick={onOpenCart}
              className="group flex items-center gap-2.5 px-4 py-2.5 bg-[#1B3523] text-stone-100 rounded-lg hover:bg-[#122418] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 text-sm font-medium shadow-xs cursor-pointer"
              aria-label={`View shopping basket with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Harvest Basket</span>
              <span className="bg-[#2A4D35] px-2 py-0.5 rounded text-xs font-mono font-medium text-white tabular-nums">
                {cartCount}
              </span>
              {cartTotal > 0 && (
                <span className="text-stone-300 text-xs hidden lg:inline font-mono tabular-nums">
                  · ₱{cartTotal.toLocaleString()}
                </span>
              )}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg border border-stone-300/80 hover:bg-stone-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6DFD3] bg-[#FBF9F5] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-3 text-base font-medium text-stone-800">
            {onNavigateToArugula && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToArugula();
                }}
                className="py-2 px-3 rounded-lg bg-emerald-900/10 text-[#1B3523] font-semibold flex items-center justify-between text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Signature Wild Arugula</span>
                </span>
                <span className="text-[10px] bg-[#984D2E] text-white px-2 py-0.5 rounded font-bold uppercase">
                  #1 Top Sale
                </span>
              </button>
            )}
            <a
              href="#shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#1B3523] transition-colors"
            >
              Shop Fresh Produce
            </a>
            <a
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#1B3523] transition-colors"
            >
              Living Soil &amp; Farming Portfolio
            </a>
            <a
              href="#calendar"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#1B3523] transition-colors"
            >
              Seasonal Crop Calendar
            </a>
            <a
              href="#recipes"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#1B3523] transition-colors"
            >
              Farm Kitchen Recipes
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#1B3523] transition-colors"
            >
              Customer Reviews
            </a>
          </nav>
          
          <div className="pt-3 border-t border-stone-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTourModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              Book Farm Tour &amp; Walk
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
