import React, { useState } from 'react';
import { Plus, Check, Eye, Sprout, Camera, Upload, RotateCcw, ShoppingBag, Info } from 'lucide-react';
import { Product } from '../types/farm';
import { optimizeImageFile } from '../utils/photoStorage';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  onQuickCheckout?: (product: Product) => void;
  cartQuantity: number;
  isLocked?: boolean;
  onPhotoUpload?: (productId: string, dataUrl: string) => void;
  onPhotoReset?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetails,
  onQuickCheckout,
  cartQuantity,
  isLocked = true,
  onPhotoUpload,
  onPhotoReset,
}) => {
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const optimized = await optimizeImageFile(file, 1000, 750, 0.82);
      if (onPhotoUpload) {
        onPhotoUpload(product.id, optimized);
        setImgError(false);
      }
    } catch (err) {
      console.error('Failed to process photo', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const hasImage = Boolean(product.image && !imgError);

  const handleCardClick = () => {
    if (onQuickCheckout) {
      onQuickCheckout(product);
    } else {
      onOpenDetails(product);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative bg-[#FBF9F5] rounded-xl border border-[#E6DFD3] hover:border-emerald-700/60 transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Visual Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {hasImage ? (
          <>
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out select-none"
            />
            {/* Subtle photo change control on hover - only visible when unlocked */}
            {!isLocked && onPhotoUpload && (
              <div
                className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                {onPhotoReset && (
                  <button
                    type="button"
                    onClick={() => onPhotoReset(product.id)}
                    title="Remove photo"
                    className="p-1 rounded-md bg-stone-900/75 hover:bg-stone-900 text-white backdrop-blur-xs transition-colors shadow-xs"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
                <label
                  htmlFor={`card-photo-${product.id}`}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-stone-900/75 hover:bg-stone-900 text-white text-[10px] font-medium backdrop-blur-xs cursor-pointer transition-colors shadow-xs"
                  title="Change photo"
                >
                  <Camera className="w-3 h-3" />
                  <span>Change</span>
                </label>
                <input
                  id={`card-photo-${product.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </>
        ) : (
          /* Pure Organic Botanical Display with Direct Upload */
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F4EFE6] p-4 text-center select-none border-b border-dashed border-[#DDD5C5]">
            <div className="w-12 h-12 rounded-full bg-white/90 border border-emerald-900/10 flex items-center justify-center text-emerald-800 shadow-xs mb-2">
              <Sprout className="w-6 h-6 text-emerald-800" />
            </div>
            <span className="text-xs font-serif font-bold text-stone-800">{product.name}</span>
            <span className="text-[10px] text-stone-500 mt-0.5">{product.harvestWindow}</span>

            {!isLocked && onPhotoUpload && (
              <label
                htmlFor={`card-upload-empty-${product.id}`}
                onClick={(e) => e.stopPropagation()}
                className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1B3523] hover:bg-[#122418] text-white text-[10px] font-medium shadow-xs cursor-pointer transition-colors"
              >
                <Upload className="w-3 h-3" />
                <span>{isProcessing ? 'Saving...' : '+ Upload Photo'}</span>
                <input
                  id={`card-upload-empty-${product.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        )}

        {/* Quiet Harvest Window Tag or #1 Top Sale Badge */}
        {product.id.includes('arugula') ? (
          <div className="absolute top-3 left-3 bg-[#984D2E] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs pointer-events-none">
            ★ #1 Top Sale
          </div>
        ) : product.isLimitedHarvest ? (
          <div className="absolute top-3 left-3 bg-[#1B3523]/90 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-sm pointer-events-none">
            Limited Daily Harvest
          </div>
        ) : null}

        {/* In-Cart Count Pill */}
        {cartQuantity > 0 && (
          <div className="absolute top-3 right-3 bg-emerald-800 text-white font-mono text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <span>{cartQuantity}</span>
            <span className="text-[10px] opacity-80">in basket</span>
          </div>
        )}

        {/* Quick Checkout overlay on hover */}
        <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none p-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B3523] text-white text-xs font-semibold shadow-lg">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
            <span>Check Out Order</span>
          </span>
        </div>
      </div>

      {/* Card Content & Commerce Controls */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Variety & Heirloom tag */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="truncate pr-2 font-medium text-stone-600">
              {product.variety || 'Heirloom Field Cut'}
            </span>
            {product.isHeirloom && (
              <span className="text-[#1B3523] bg-emerald-100/70 px-1.5 py-0.2 rounded-xs font-semibold text-[10px] shrink-0">
                Heirloom
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-base font-serif font-bold text-stone-900 group-hover:text-[#1B3523] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="mt-1 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Checkout / Basket Actions */}
        <div className="pt-2.5 border-t border-stone-200/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-serif font-bold text-[#1B3523]">
              ₱{product.price}
              <span className="text-[11px] font-sans font-normal text-stone-500 ml-1">
                {product.unit}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Quick checkout pop-up button */}
            <button
              type="button"
              onClick={() => {
                if (onQuickCheckout) onQuickCheckout(product);
                else onOpenDetails(product);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1B3523] hover:bg-[#122418] text-white flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
              title="Pop up checkout to fill delivery or pickup details and receive email payment method"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
              <span>Check Out</span>
            </button>

            {/* Add to Basket button */}
            <button
              type="button"
              onClick={handleAdd}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center justify-center transition-all shadow-2xs cursor-pointer border ${
                justAdded
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300 active:scale-95'
              }`}
              title={`Add ${product.name} to harvest basket`}
              aria-label={`Add ${product.name} to harvest basket`}
            >
              {justAdded ? (
                <Check className="w-4 h-4 text-emerald-200" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>

            {/* Farm Notes info button */}
            <button
              type="button"
              onClick={() => onOpenDetails(product)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 border border-stone-200 transition-colors cursor-pointer"
              title="Read farm notes & details"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
