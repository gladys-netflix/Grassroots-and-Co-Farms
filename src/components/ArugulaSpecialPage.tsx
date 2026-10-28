import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Award,
  Sun,
  Droplets,
  Sprout,
  Check,
  Plus,
  Minus,
  ChefHat,
  ShieldCheck,
  Clock,
  Heart,
  Share2
} from 'lucide-react';
import { Product } from '../types/farm';

interface ArugulaSpecialPageProps {
  onBack: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickCheckout?: (product: Product, quantity: number) => void;
  onOpenCart: () => void;
  cartCount: number;
  products: Product[];
}

export const ArugulaSpecialPage: React.FC<ArugulaSpecialPageProps> = ({
  onBack,
  onAddToCart,
  onQuickCheckout,
  onOpenCart,
  cartCount,
  products,
}) => {
  // Find baby and regular arugula from products
  const babyArugula = products.find((p) => p.id === 'prod-arugula-baby') || {
    id: 'prod-arugula-baby',
    name: 'Arugula Baby',
    variety: 'Tender Wild Micro-Leaves',
    category: 'greens' as const,
    price: 400,
    unit: 'per kg',
    image: '/assets/aistudio/IMG_6865_97b47eb3.jpg',
    shortDescription: 'Delicate, tender young arugula leaves with a refined nutty pepper flavor.',
    fullDescription: 'Harvested at 21 days in our Balas rain shelters for maximum tenderness and mild peppery mustard spark.',
    harvestWindow: 'Picked at dawn daily (5:30 AM)',
    plotLocation: 'Plot B: Greens Rain Shelter',
    inStock: true,
    stockCount: 30,
    isOrganicCertified: true,
    isHeirloom: true,
    flavorNotes: ['Delicate Nutty Crunch', 'Mild Peppery Spark', 'Tender Stems'],
    storageTip: 'Store in airtight container with damp paper towel.',
    chefSuggestion: 'Toss with extra virgin olive oil, shaved Parmigiano-Reggiano, and fresh lemon.',
  };

  const regularArugula = products.find((p) => p.id === 'prod-arugula-regular') || {
    id: 'prod-arugula-regular',
    name: 'Arugula Regular',
    variety: 'Robust Wild Rocket',
    category: 'greens' as const,
    price: 350,
    unit: 'per kg',
    image: '/assets/aistudio/IMG_6873_ae3149b1.jpg',
    shortDescription: 'Full-bodied mature wild rocket with bold peppery pungent punch.',
    fullDescription: 'Deeply serrated dark green wild rocket leaves grown in living volcanic compost beds under high-tunnel rain shelters.',
    harvestWindow: 'Harvested daily at dawn',
    plotLocation: 'Plot B: Rain Shelter Beds',
    inStock: true,
    stockCount: 40,
    isOrganicCertified: true,
    isHeirloom: true,
    flavorNotes: ['Bold Pungent Pepper', 'Deep Herbal Bite', 'Crisp Ribs'],
    storageTip: 'Keep chilled in a ventilated container.',
    chefSuggestion: 'Top woodfired pizzas, fold into morning pasta, or pound with pili nuts into wild pesto.',
  };

  const [babyQty, setBabyQty] = useState(1);
  const [regularQty, setRegularQty] = useState(1);
  const [justAddedBaby, setJustAddedBaby] = useState(false);
  const [justAddedRegular, setJustAddedRegular] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('/assets/aistudio/IMG_6873_ae3149b1.jpg');

  const handleAddBaby = () => {
    onAddToCart(babyArugula, babyQty);
    setJustAddedBaby(true);
    setTimeout(() => setJustAddedBaby(false), 1500);
  };

  const handleAddRegular = () => {
    onAddToCart(regularArugula, regularQty);
    setJustAddedRegular(true);
    setTimeout(() => setJustAddedRegular(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 animate-fadeIn pb-24">
      {/* Sticky Sub-Header Navigation */}
      <div className="sticky top-20 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E6DFD3] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1B3523] hover:text-[#122418] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Farm Catalog</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Grassroots #1 Top Sale</span>
            </span>

            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1B3523] text-white rounded-lg text-xs font-medium hover:bg-[#122418] transition-colors shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
              <span>Harvest Basket ({cartCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Showcase: Grassroots Signature Wild Arugula */}
      <section className="pt-8 sm:pt-12 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Brand Story & Terroir */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900">
              <span className="inline-flex items-center gap-1 bg-emerald-100/90 text-[#1B3523] px-2.5 py-1 rounded font-bold">
                <Award className="w-3.5 h-3.5 text-emerald-800" />
                <span>#1 Top Seller Crop</span>
              </span>
              <span>·</span>
              <span>Balas, Bacolor, Pampanga</span>
              <span>·</span>
              <span className="text-[#984D2E]">Rain Shelter Cultivated</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1B3523] tracking-tight leading-[1.08] [text-wrap:balance]">
              Our Signature Wild Arugula
            </h1>

            <p className="text-lg sm:text-xl font-serif text-[#984D2E] italic">
              “Crisp, intensely peppery, with an unmistakable clean hazelnut finish.”
            </p>

            <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
              Why is Grassroots Arugula our most requested harvest? In Balas, Bacolor, we grow our wild rocket inside dedicated high-tunnel rain shelters. Shielded from torrential tropical downpours and harsh midday scalding, each leaf develops thick cell walls, vibrant green rosettes, and an assertive peppery mustard punch without the stringy bitterness of stressed field greens.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-[#E6DFD3] shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Dawn Cut Time</span>
                <span className="text-base sm:text-lg font-serif font-bold text-[#1B3523]">5:30 AM PHT</span>
                <span className="text-[10px] text-stone-500 block">Maximum crispness</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E6DFD3] shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Soil Organic Matter</span>
                <span className="text-base sm:text-lg font-serif font-bold text-[#1B3523]">8.2% Topsoil</span>
                <span className="text-[10px] text-stone-500 block">Zero synthetic chemicals</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E6DFD3] shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Same-Day Dispatch</span>
                <span className="text-base sm:text-lg font-serif font-bold text-[#1B3523]">3:00 PM PHT</span>
                <span className="text-[10px] text-stone-500 block">From field to table</span>
              </div>
            </div>

            {/* Anchor CTA Button */}
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="#order-arugula"
                className="px-6 py-3.5 bg-[#1B3523] text-white font-medium text-sm rounded-xl hover:bg-[#122418] transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-300" />
                <span>Order Today's Arugula Harvest</span>
              </a>
              <a
                href="#arugula-agronomy"
                className="px-5 py-3.5 bg-white text-[#1B3523] border border-[#1B3523]/30 font-medium text-sm rounded-xl hover:bg-stone-50 transition-all shadow-2xs cursor-pointer"
              >
                Learn How We Grow It
              </a>
            </div>
          </div>

          {/* Right Column: Real Farm Photography Showcase */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Large Photo Frame */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-900 border border-[#E6DFD3] shadow-md group">
              <img
                src={selectedPhoto}
                alt="Grassroots Wild Arugula Farm Beds"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-mono mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>100% Authentic Grassroots Farm Photography</span>
                </div>
                <p className="text-sm sm:text-base font-serif font-semibold text-stone-100">
                  {selectedPhoto === '/assets/aistudio/IMG_6873_ae3149b1.jpg'
                    ? 'Rain Shelter Protected Bed Rows with Drip Irrigation · Balas, Bacolor'
                    : 'Tender Baby Wild Arugula Rosette Cluster in 8.2% Organic Matter Soil'}
                </p>
              </div>
            </div>

            {/* Photo Selector Thumbnails */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPhoto('/assets/aistudio/IMG_6873_ae3149b1.jpg')}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                  selectedPhoto === '/assets/aistudio/IMG_6873_ae3149b1.jpg'
                    ? 'border-[#1B3523] ring-2 ring-[#1B3523]/20 shadow-sm'
                    : 'border-[#E6DFD3] opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src="/assets/aistudio/IMG_6873_ae3149b1.jpg"
                  alt="Rain Shelter Bed Rows"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-medium">
                  Greenhouse Bed Rows
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPhoto('/assets/aistudio/IMG_6865_97b47eb3.jpg')}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                  selectedPhoto === '/assets/aistudio/IMG_6865_97b47eb3.jpg'
                    ? 'border-[#1B3523] ring-2 ring-[#1B3523]/20 shadow-sm'
                    : 'border-[#E6DFD3] opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src="/assets/aistudio/IMG_6865_97b47eb3.jpg"
                  alt="Baby Leaves Rosette"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-medium">
                  Tender Rosette Leaves
                </span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* The Two Arugula Varieties: Direct Order Section */}
      <section id="order-arugula" className="py-16 bg-[#F4EFE6]/70 border-y border-[#E6DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-2">
              <Sprout className="w-4 h-4 text-emerald-800" />
              <span>Available for Daily Dawn Harvest</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3523] tracking-tight">
              Choose Your Preferred Cut &amp; Harvest Stage
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base">
              Both varieties are hand-clipped with clean shears at 5:30 AM, gently pre-cooled, and packed in breathable craft containers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Variety 1: Baby Wild Arugula */}
            <div className="bg-white rounded-2xl border border-[#E6DFD3] shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#1B3523]/40 transition-colors">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src="/assets/aistudio/IMG_6865_97b47eb3.jpg"
                    alt="Baby Wild Arugula Micro-Leaves"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#1B3523] text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-xs">
                    21-Day Tender Harvest
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-xs font-mono font-bold px-3 py-1 rounded">
                    ₱400 / kg
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-stone-900">Baby Wild Arugula</h3>
                      <p className="text-xs text-[#984D2E] font-semibold uppercase tracking-wider mt-0.5">
                        Tender Wild Micro-Leaves
                      </p>
                    </div>
                    <span className="text-xs font-medium text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                      In Stock · Dawn Harvest
                    </span>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    Harvested young at 21 days for absolute delicacy. Thin, supple stems and smooth-lobed leaves with a gentle hazelnut note and mild spicy finish.
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                      Key Flavor &amp; Culinary Profile:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded">Delicate Nutty Sweetness</span>
                      <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded">Subtle Peppery Spark</span>
                      <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded">Gourmet Raw Salads</span>
                      <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded">Beef Carpaccio</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Box */}
              <div className="p-6 sm:p-7 bg-[#FBF9F5] border-t border-[#E6DFD3] flex items-center justify-between gap-4">
                <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setBabyQty(Math.max(1, babyQty - 1))}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3.5 text-sm font-mono font-bold text-stone-900">
                    {babyQty} kg
                  </span>
                  <button
                    type="button"
                    onClick={() => setBabyQty(babyQty + 1)}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onQuickCheckout) {
                      onQuickCheckout(babyArugula, babyQty);
                    } else {
                      handleAddBaby();
                    }
                  }}
                  className="flex-1 py-3 px-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#1B3523] text-white hover:bg-[#122418] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  title="Direct checkout pop-up with delivery or pickup details"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-300" />
                  <span>Check Out · ₱{(babyArugula.price * babyQty).toLocaleString()}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddBaby}
                  className={`py-3 px-3.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs border ${
                    justAddedBaby
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300 active:scale-[0.98]'
                  }`}
                  title="Add to basket"
                >
                  {justAddedBaby ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Add to Basket</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Variety 2: Regular Robust Wild Rocket */}
            <div className="bg-white rounded-2xl border border-[#E6DFD3] shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#1B3523]/40 transition-colors">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src="/assets/aistudio/IMG_6873_ae3149b1.jpg"
                    alt="Regular Robust Wild Rocket"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#984D2E] text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-xs">
                    Mature Serrated Rocket
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-xs font-mono font-bold px-3 py-1 rounded">
                    ₱350 / kg
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-stone-900">Arugula Regular</h3>
                      <p className="text-xs text-[#984D2E] font-semibold uppercase tracking-wider mt-0.5">
                        Robust Wild Rocket
                      </p>
                    </div>
                    <span className="text-xs font-medium text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                      In Stock · Daily Cut
                    </span>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    Deeply lobed dark leaves with strong ribs. Packs a bold, punchy horseradish mustard warmth that holds its texture on hot sourdough pizza and blends into rich wild pestos.
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                      Key Flavor &amp; Culinary Profile:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded">Bold Pungent Pepper</span>
                      <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded">Crisp Leaf Ribs</span>
                      <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded">Woodfired Pizza</span>
                      <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded">Pili Nut Pesto</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Box */}
              <div className="p-6 sm:p-7 bg-[#FBF9F5] border-t border-[#E6DFD3] flex items-center justify-between gap-4">
                <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setRegularQty(Math.max(1, regularQty - 1))}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3.5 text-sm font-mono font-bold text-stone-900">
                    {regularQty} kg
                  </span>
                  <button
                    type="button"
                    onClick={() => setRegularQty(regularQty + 1)}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onQuickCheckout) {
                      onQuickCheckout(regularArugula, regularQty);
                    } else {
                      handleAddRegular();
                    }
                  }}
                  className="flex-1 py-3 px-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#1B3523] text-white hover:bg-[#122418] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  title="Direct checkout pop-up with delivery or pickup details"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-300" />
                  <span>Check Out · ₱{(regularArugula.price * regularQty).toLocaleString()}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddRegular}
                  className={`py-3 px-3.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs border ${
                    justAddedRegular
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300 active:scale-[0.98]'
                  }`}
                  title="Add to basket"
                >
                  {justAddedRegular ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Add to Basket</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Agronomy Section: Why Rain Shelter & Living Soil Make Our Arugula Different */}
      <section id="arugula-agronomy" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            <span>Regenerative Terroir</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3523] tracking-tight">
            The 4 Secrets Behind Grassroots Arugula
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            Arugula is famously sensitive to tropical heat and rainfall. Here is how our estate in Balas, Bacolor achieves restaurant-grade texture year-round.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-[#E6DFD3] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold">
              01
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Grassroots Rain Shelter
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Tropical monsoon deluges crush delicate leaves and splash mud pathogens. Our high-tunnel canopy diffuses sunlight and keeps leaves completely dry and pristine.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E6DFD3] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold">
              02
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              8.2% Volcanic Organic Soil
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Industrial fertilizer pumps arugula full of water and creates harsh bitter sulfur compounds. Our aerobic compost delivers mineral balance and a rich hazelnut undertone.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E6DFD3] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold">
              03
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Subterranean Drip Lines
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              As seen in our farm photos, irrigation is placed directly at root depth. By never wetting the foliage from above, mold, blight, and leaf yellowing are naturally avoided.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E6DFD3] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold">
              04
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Dawn Hand-Shear Cutting
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Our harvesters begin at 5:30 AM while the leaves hold full moisture turgor from the cool night air. Cut cleanly with Japanese shears so stems never tear or oxidize.
            </p>
          </div>
        </div>
      </section>

      {/* Culinary Pairings & Kitchen Inspiration */}
      <section className="py-16 bg-white border-t border-[#E6DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-2">
              <ChefHat className="w-4 h-4 text-emerald-800" />
              <span>Chef &amp; Home Kitchen Field Guide</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#1B3523] tracking-tight">
              How to Savor Grassroots Arugula at Home
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD3] space-y-3">
              <h4 className="font-serif font-bold text-lg text-stone-900">
                Neapolitan Sourdough Pizza
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Add a generous mountain of raw Baby Arugula immediately after the pizza emerges from the oven. The residual heat gently wilts the lower leaves while the top stays crisp and peppery.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD3] space-y-3">
              <h4 className="font-serif font-bold text-lg text-stone-900">
                Shaved Parmigiano &amp; Lemon
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Toss with unfiltered olive oil, coarse sea salt, and a quick squeeze of Calamansi or lemon. Shave aged Parmigiano over top for the classic Italian Osteria salad.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#E6DFD3] space-y-3">
              <h4 className="font-serif font-bold text-lg text-stone-900">
                Pampanga Pili Nut Rocket Pesto
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Pulse our mature Regular Arugula with toasted roasted pili nuts, native garlic, olive oil, and hard cheese. Produces an emerald-green sauce with remarkable depth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Bottom Basket Bar for seamless ordering */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E6DFD3] py-3.5 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-emerald-950 uppercase tracking-wider">
              Grassroots Top Sale · Wild Arugula
            </p>
            <p className="text-xs text-stone-600">
              Harvested daily at 5:30 AM in Balas, Bacolor · Dispatched by 3:00 PM PHT
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onBack}
              className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Browse All Produce
            </button>

            <button
              onClick={onOpenCart}
              className="px-5 py-2 bg-[#1B3523] hover:bg-[#122418] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
              <span>View Harvest Basket ({cartCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
