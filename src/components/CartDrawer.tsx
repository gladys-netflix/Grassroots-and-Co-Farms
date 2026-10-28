import React, { useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Sprout } from 'lucide-react';
import { CartItem } from '../types/farm';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

const FREE_SHIPPING_THRESHOLD = 1500.0;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const remainingForFreeDelivery = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#FBF9F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#E6DFD3] relative text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E6DFD3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1B3523]" />
            <h3 className="font-serif font-bold text-lg text-stone-900">Your Harvest Basket</h3>
            <span className="text-xs bg-stone-200 px-2 py-0.5 rounded font-mono font-semibold">
              {items.reduce((acc, i) => acc + i.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Close harvest basket"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        <div className="bg-[#F4EFE6] px-5 py-3 border-b border-stone-200/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-stone-700 font-medium">
              <Truck className="w-3.5 h-3.5 text-emerald-800" />
              {remainingForFreeDelivery === 0 ? (
                <strong className="text-[#1B3523]">You unlocked Free Farm Delivery!</strong>
              ) : (
                <span>Add <strong>₱{Math.ceil(remainingForFreeDelivery).toLocaleString()}</strong> more for Free Delivery</span>
              )}
            </span>
            <span className="font-mono text-stone-500">{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#1B3523] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-200/80">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                
                {/* Product Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-stone-200 overflow-hidden shrink-0 border border-stone-200 flex items-center justify-center">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Sprout className="w-6 h-6 text-emerald-800/70" />
                  )}
                </div>

                {/* Info & Quantity */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs sm:text-sm font-serif font-bold text-stone-900 truncate">
                        {item.product.name}
                      </h4>
                      {item.customization ? (
                        <p className="text-[11px] text-emerald-800 font-medium truncate mt-0.5">
                          {item.customization}
                        </p>
                      ) : (
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {item.product.unit}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-stone-400 hover:text-red-700 p-1 transition-colors"
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-300 rounded bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-medium text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total for this line */}
                    <span className="font-serif font-bold text-sm text-[#1B3523] tabular-nums">
                      ₱{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <ShoppingBag className="w-12 h-12 text-stone-300 mb-3" />
              <p className="font-serif font-bold text-stone-800">Your basket is empty</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                Explore today’s fresh organic produce to fill your harvest basket.
              </p>
            </div>
          )}
        </div>

        {/* Footer Subtotal & Checkout Button */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E6DFD3] bg-[#F4EFE6]/50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Produce Subtotal</span>
                <span className="font-mono text-stone-900 tabular-nums">₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Chilled Farm Delivery</span>
                <span className="font-mono text-stone-900 tabular-nums">
                  {remainingForFreeDelivery === 0 ? 'FREE' : '₱150'}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-stone-900">Total</span>
                <span className="font-serif font-bold text-xl text-[#1B3523] tabular-nums">
                  ₱{(subtotal + (remainingForFreeDelivery === 0 ? 0 : 150)).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 bg-[#1B3523] hover:bg-[#122418] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all"
            >
              <span>Proceed to Delivery &amp; Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
