import React, { useState } from 'react';
import { X, Check, Plus, Minus, Sprout, MapPin, Clock, ChefHat, Camera, Upload, RotateCcw, ShoppingBag } from 'lucide-react';
import { Product } from '../types/farm';
import { optimizeImageFile } from '../utils/photoStorage';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onQuickCheckout?: (product: Product, quantity: number) => void;
  isLocked?: boolean;
  onPhotoUpload?: (productId: string, dataUrl: string) => void;
  onPhotoReset?: (productId: string) => void;
  onNavigateToArugula?: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onQuickCheckout,
  isLocked = true,
  onPhotoUpload,
  onPhotoReset,
  onNavigateToArugula,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 900);
  };

  const handleModalPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const optimized = await optimizeImageFile(file, 1200, 900, 0.82);
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div 
        className="relative bg-[#FBF9F5] rounded-2xl max-w-3xl w-full border border-[#E6DFD3] shadow-2xl overflow-hidden text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-stone-700 hover:text-stone-900 hover:bg-white shadow-xs transition-colors cursor-pointer"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Visual */}
          <div className="relative aspect-square md:aspect-auto bg-stone-100 min-h-[300px]">
            {hasImage ? (
              <>
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover select-none"
                />
                {/* Photo Change button - only when unlocked */}
                {!isLocked && onPhotoUpload && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 z-10">
                    {onPhotoReset && (
                      <button
                        type="button"
                        onClick={() => onPhotoReset(product.id)}
                        title="Remove photo"
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs transition-colors shadow-xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <label
                      htmlFor={`modal-photo-${product.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/85 text-white text-xs font-medium backdrop-blur-xs cursor-pointer transition-colors shadow-xs"
                      title="Change photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Updating...' : 'Change Photo'}</span>
                      <input
                        id={`modal-photo-${product.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleModalPhotoUpload}
                      />
                    </label>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#F4EFE6] text-stone-700 text-center border-b md:border-b-0 md:border-r border-dashed border-[#DDD5C5]">
                <div className="w-14 h-14 rounded-full bg-white/80 border border-stone-200 flex items-center justify-center text-emerald-800 shadow-xs mb-3">
                  <Sprout className="w-7 h-7 text-emerald-800" />
                </div>
                <p className="font-serif font-bold text-lg text-stone-800">{product.name}</p>
                <p className="text-xs text-stone-500 mt-1">{product.plotLocation}</p>

                {!isLocked && onPhotoUpload && (
                  <label
                    htmlFor={`modal-upload-empty-${product.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1B3523] hover:bg-[#122418] text-white text-xs font-medium cursor-pointer shadow-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isProcessing ? 'Processing...' : 'Upload Real Photo'}</span>
                    <input
                      id={`modal-upload-empty-${product.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleModalPhotoUpload}
                    />
                  </label>
                )}
              </div>
            )}

            {/* Origin Strip */}
            <div className="absolute bottom-3 left-3 bg-[#1B3523]/90 text-stone-100 text-xs px-3 py-1 rounded backdrop-blur-xs flex items-center gap-1.5 pointer-events-none">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>{product.plotLocation}</span>
            </div>
          </div>

          {/* Right: Technical Notes & Purchase Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div>
              {/* Variety & Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-900">
                  {product.category}
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="text-xs text-stone-600 font-medium">
                  {product.variety}
                </span>
                {product.isHeirloom && (
                  <span className="text-[#1B3523] bg-emerald-100/70 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Heirloom Seed
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3523]">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-2 text-xl font-serif font-bold text-[#1B3523]">
                ₱{product.price}
                <span className="text-sm font-sans font-normal text-stone-500 ml-1.5">
                  {product.unit}
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-stone-600 leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Special Arugula Top Sale Page Link */}
              {product.id.includes('arugula') && onNavigateToArugula && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToArugula();
                  }}
                  className="mt-3 w-full py-2.5 px-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-semibold text-amber-950 flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Grassroots #1 Top Sale Showcase</span>
                  </span>
                  <span className="text-[#984D2E] font-bold group-hover:underline">
                    View Dedicated Arugula Page →
                  </span>
                </button>
              )}

              {/* Harvest Window & Storage */}
              <div className="mt-5 space-y-2.5 pt-4 border-t border-stone-200 text-xs">
                <div className="flex items-start gap-2 text-stone-700">
                  <Clock className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">Harvest Window: </span>
                    {product.harvestWindow}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-stone-700">
                  <ChefHat className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">Kitchen Notes: </span>
                    {product.chefSuggestion}
                  </div>
                </div>
              </div>

              {/* Flavor Profile Badges */}
              {product.flavorNotes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-200">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-1.5">
                    Flavor &amp; Texture Notes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.flavorNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#EFE9DD] text-stone-800 px-2.5 py-1 rounded border border-[#DDD5C5]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector & Add Button */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between gap-4">
                
                {/* Quantity Stepper */}
                <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-40 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-semibold text-stone-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Quick Checkout Button */}
                <button
                  onClick={() => {
                    if (onQuickCheckout) {
                      onClose();
                      onQuickCheckout(product, quantity);
                    } else {
                      handleAdd();
                    }
                  }}
                  className="flex-1 py-3 px-3.5 rounded-lg font-bold text-xs sm:text-sm bg-[#1B3523] hover:bg-[#122418] text-white flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-300" />
                  <span>Check Out Order · ₱{(product.price * quantity).toLocaleString()}</span>
                </button>

                {/* Add to Basket Button */}
                <button
                  onClick={handleAdd}
                  className={`py-3 px-3 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer border ${
                    justAdded
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300 active:scale-98'
                  }`}
                  title="Add to harvest basket and continue shopping"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span className="hidden sm:inline">Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Add to Basket</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-stone-500">
                Packed in wax-free ventilated farm containers · Receive instant email with payment method upon checkout
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
