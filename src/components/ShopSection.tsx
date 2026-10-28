import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, Camera } from 'lucide-react';
import { Product, ProductCategory, CartItem } from '../types/farm';
import { ProductCard } from './ProductCard';

interface ShopSectionProps {
  products: Product[];
  cartItems: CartItem[];
  isLocked?: boolean;
  onAddToCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  onQuickCheckout?: (product: Product) => void;
  onPhotoUpload?: (productId: string, dataUrl: string) => void;
  onPhotoReset?: (productId: string) => void;
  onOpenPhotoManager?: () => void;
  onNavigateToArugula?: () => void;
}

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All Farm Harvest' },
  { id: 'greens', label: 'Arugula, Lettuce & Basil' },
  { id: 'vegetables', label: 'Cherry Tomatoes & Beets' },
  { id: 'fruits', label: 'Fresh Persian Mulberries' },
  { id: 'pantry', label: 'Pasture Eggs & Honey' },
];

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  cartItems,
  isLocked = true,
  onAddToCart,
  onOpenDetails,
  onQuickCheckout,
  onPhotoUpload,
  onPhotoReset,
  onOpenPhotoManager,
  onNavigateToArugula,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [heirloomOnly, setHeirloomOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.variety && item.variety.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesHeirloom = !heirloomOnly || item.isHeirloom;

      return matchesCategory && matchesSearch && matchesHeirloom;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // recommended natural order
    });
  }, [products, selectedCategory, searchQuery, heirloomOnly, sortBy]);

  const getProductCartCount = (productId: string) => {
    const item = cartItems.find((ci) => ci.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <section id="shop" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E6DFD3]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-2">
            <span>Daily Produce Catalog</span>
            <span aria-hidden="true">·</span>
            <span>Harvested within 24 Hours</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-800 font-medium normal-case bg-emerald-100/70 px-2 py-0.5 rounded-sm text-[11px]">
              Balas, Bacolor, Pampanga
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3523] tracking-tight">
            Today’s Harvest from the Valley
          </h2>
          <p className="mt-2 text-stone-600 text-sm max-w-xl">
            Pure organic produce picked at natural botanical ripeness. Packed in recyclable wax-free containers and delivered chilled to your doorstep or available for farm pickup.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search heirloom, berries, kale..."
              className="pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 bg-white placeholder:text-stone-400 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523] w-full sm:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#1B3523] cursor-pointer"
              aria-label="Sort produce"
            >
              <option value="recommended">Featured Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {onOpenPhotoManager && (
              <button
                type="button"
                onClick={onOpenPhotoManager}
                className="py-2 px-3 text-xs rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-medium flex items-center gap-1.5 shadow-2xs transition-colors shrink-0 cursor-pointer"
                title="Manage all uploaded produce photos"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-800" />
                <span>Manage Photos</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Tabs & Quick Toggles */}
      <div className="py-6 flex flex-wrap items-center justify-between gap-4">
        {/* Category Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#1B3523] text-white shadow-xs font-semibold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick Filter: Heirloom Only */}
        <div className="flex items-center gap-4 text-xs text-stone-600">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={heirloomOnly}
              onChange={(e) => setHeirloomOnly(e.target.checked)}
              className="rounded border-stone-300 text-[#1B3523] focus:ring-[#1B3523]"
            />
            <span className="font-medium text-stone-700">Heirloom Varieties Only</span>
          </label>
          <span className="text-stone-400">·</span>
          <span className="font-mono text-stone-500">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
          </span>
        </div>
      </div>

      {/* Featured Grassroots #1 Top Seller Spotlight Banner */}
      {onNavigateToArugula && (
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-[#1B3523] via-[#1E3B27] to-[#254A32] text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm border border-emerald-900/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-emerald-400/40 bg-stone-900">
              <img
                src="/assets/aistudio/IMG_6865_97b47eb3.jpg"
                alt="Grassroots #1 Top Seller Arugula"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-bold text-[10px] uppercase tracking-wider mb-1">
                ⭐ Grassroots #1 Top Sale
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-tight">
                Signature Pampanga Wild Arugula
              </h3>
              <p className="text-xs text-emerald-200 mt-1 line-clamp-1">
                Rain shelter protected, living soil cultivated in Balas, Bacolor. Intensely peppery, tender &amp; crisp.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToArugula}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap text-center shrink-0"
          >
            Explore Special Arugula Page →
          </button>
        </div>
      )}

      {/* Produce Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartQuantity={getProductCartCount(product.id)}
              isLocked={isLocked}
              onAddToCart={onAddToCart}
              onOpenDetails={onOpenDetails}
              onQuickCheckout={onQuickCheckout}
              onPhotoUpload={onPhotoUpload}
              onPhotoReset={onPhotoReset}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#FBF9F5] rounded-2xl border border-dashed border-[#E6DFD3] p-8">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400 mb-3">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif font-bold text-stone-800">No matching produce in today's harvest</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or view our complete daily catalog.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setHeirloomOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
