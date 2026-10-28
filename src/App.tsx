import React, { useState, useEffect } from 'react';
import { NotificationBar } from './components/NotificationBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ShopSection } from './components/ShopSection';
import { FarmPortfolio } from './components/FarmPortfolio';
import { SeasonalCalendar } from './components/SeasonalCalendar';
import { RecipesSection } from './components/RecipesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { FarmTourModal } from './components/FarmTourModal';
import { PhotoManagerModal } from './components/PhotoManagerModal';
import { ArugulaSpecialPage } from './components/ArugulaSpecialPage';
import { FarmAnalyticsModal } from './components/FarmAnalyticsModal';
import { trackVisit, trackOrderConversion, initGoogleAnalytics } from './utils/analytics';
import { PRODUCTS } from './data/products';
import { Product, CartItem } from './types/farm';
import {
  getStoredHeroPhotos,
  saveStoredHeroPhotos,
  getStoredPortfolioPhotos,
  saveStoredPortfolioPhotos,
  resolveProductPhoto,
  syncPhotosToCodebase,
  CustomSlide,
} from './utils/photoStorage';

export default function App() {
  // 1. User's uploaded produce catalog photos from localStorage (Zero AI, Zero external stock)
  const [customProductPhotos, setCustomProductPhotos] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('grassroots_product_photos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 2. User's uploaded hero slideshow photos from localStorage
  const [heroSlides, setHeroSlides] = useState<CustomSlide[]>(() => {
    return getStoredHeroPhotos();
  });

  // 3. User's uploaded farm portfolio photos from localStorage
  const [portfolioPhotos, setPortfolioPhotos] = useState<Record<string, string>>(() => {
    return getStoredPortfolioPhotos();
  });

  // Current active view: 'home' or dedicated 'arugula' special page
  const [currentPage, setCurrentPage] = useState<'home' | 'arugula'>('home');

  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);

  // Check URL hash on load and listen for hash changes
  useEffect(() => {
    if (window.location.hash === '#arugula') {
      setCurrentPage('arugula');
    }
    const handleHashChange = () => {
      if (window.location.hash === '#arugula') {
        setCurrentPage('arugula');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Permanently sync any client localStorage photos to codebase /api/save-final-photos on mount
  useEffect(() => {
    syncPhotosToCodebase().catch(() => {});
  }, []);

  // Initialize analytics and track route visits
  useEffect(() => {
    initGoogleAnalytics();
    if (currentPage === 'arugula') {
      trackVisit('Signature Arugula (#1 Top Sale)', 'Arugula Regular');
    } else {
      trackVisit('Home / Overview');
    }
  }, [currentPage]);

  const handleHeroSlidesUpdate = (slides: CustomSlide[]) => {
    setHeroSlides(slides);
    saveStoredHeroPhotos(slides);
  };

  const handlePortfolioPhotoUpload = (key: string, dataUrl: string) => {
    setPortfolioPhotos((prev) => {
      const updated = { ...prev, [key]: dataUrl };
      saveStoredPortfolioPhotos(updated);
      return updated;
    });
  };

  const handlePortfolioPhotoReset = (key: string) => {
    setPortfolioPhotos((prev) => {
      const updated = { ...prev };
      delete updated[key];
      saveStoredPortfolioPhotos(updated);
      return updated;
    });
  };

  const handleProductPhotoUpload = (productId: string, dataUrl: string) => {
    setCustomProductPhotos((prev) => {
      const updated = { ...prev, [productId]: dataUrl };
      try {
        localStorage.setItem('grassroots_product_photos', JSON.stringify(updated));
      } catch (err) {
        console.warn('Storage quota limit reached', err);
      }
      return updated;
    });
  };

  const handleProductPhotoReset = (productId: string) => {
    setCustomProductPhotos((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      try {
        localStorage.setItem('grassroots_product_photos', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Merge user's uploaded photos with products, resolving green ice lettuce, kaffir lime,
  // kale, lemongrass, japanese cucumber, native tomato, papaya, romaine, eggs & arugula
  const activeProducts = React.useMemo(() => {
    return PRODUCTS.map((prod) => {
      const photo = resolveProductPhoto(prod, customProductPhotos);
      return {
        ...prod,
        image: photo,
      };
    });
  }, [customProductPhotos]);

  // Cart state persisted to localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('grassroots_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { product: PRODUCTS[0], quantity: 2 },
      { product: PRODUCTS[2], quantity: 1 },
    ];
  });

  // Modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Direct 1-click product checkout state
  const [checkoutDirectProduct, setCheckoutDirectProduct] = useState<Product | null>(null);
  const [checkoutDirectQuantity, setCheckoutDirectQuantity] = useState<number>(1);

  const handleOpenQuickCheckout = (product: Product, quantity = 1) => {
    setCheckoutDirectProduct(product);
    setCheckoutDirectQuantity(quantity);
    setIsCheckoutOpen(true);
  };

  const selectedProduct = React.useMemo(() => {
    if (!selectedProductId) return null;
    return activeProducts.find((p) => p.id === selectedProductId) || null;
  }, [selectedProductId, activeProducts]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('grassroots_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartValue = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleAddToCart = (product: Product, quantity = 1, customization?: string) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (ci) => ci.product.id === product.id && ci.customization === customization
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, quantity, customization }];
    });
  };

  const handleAddMultipleToCart = (products: Product[]) => {
    products.forEach((prod) => handleAddToCart(prod, 1));
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPortfolio = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      window.location.hash = '';
      setTimeout(() => {
        document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigateToArugula = () => {
    setCurrentPage('arugula');
    window.location.hash = 'arugula';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 selection:bg-[#1B3523] selection:text-white">
      {/* Top Harvest Announcement Bar */}
      <NotificationBar onNavigateToArugula={handleNavigateToArugula} />

      {/* Top Navigation */}
      <Header
        cartCount={totalCartCount}
        cartTotal={totalCartValue}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTourModal={() => setIsTourModalOpen(true)}
        onOpenPhotoManager={() => setIsPhotoManagerOpen(true)}
        onNavigateToArugula={handleNavigateToArugula}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
      />

      {currentPage === 'arugula' ? (
        <ArugulaSpecialPage
          onBack={handleBackToHome}
          onAddToCart={handleAddToCart}
          onQuickCheckout={handleOpenQuickCheckout}
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={totalCartCount}
          products={activeProducts}
        />
      ) : (
        <main id="main-content">
          {/* Top Hero Slideshow with User's Uploaded Photos & 3:00 PM PHT Dispatch */}
          <Hero
            slides={heroSlides}
            onHeroSlidesUpdate={handleHeroSlidesUpdate}
            onExploreShop={scrollToShop}
            onExplorePortfolio={scrollToPortfolio}
            onBookTour={() => setIsTourModalOpen(true)}
            onOpenPhotoManager={() => setIsPhotoManagerOpen(true)}
            onNavigateToArugula={handleNavigateToArugula}
          />

          {/* Online Produce Shop with User's Uploaded Photos */}
          <ShopSection
            products={activeProducts}
            cartItems={cartItems}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onOpenDetails={(p) => setSelectedProductId(p.id)}
            onQuickCheckout={handleOpenQuickCheckout}
            onPhotoUpload={handleProductPhotoUpload}
            onPhotoReset={handleProductPhotoReset}
            onOpenPhotoManager={() => setIsPhotoManagerOpen(true)}
            onNavigateToArugula={handleNavigateToArugula}
          />

          {/* Clean Farming Portfolio with User's Uploaded Soil & Rain Shelter Photos */}
          <FarmPortfolio
            portfolioPhotos={portfolioPhotos}
            onPortfolioPhotoUpload={handlePortfolioPhotoUpload}
            onPortfolioPhotoReset={handlePortfolioPhotoReset}
          />

          {/* Seasonal Crop Calendar & Field Guide */}
          <SeasonalCalendar />

          {/* Farm Kitchen Recipes */}
          <RecipesSection onAddMultipleToCart={handleAddMultipleToCart} />

          {/* Testimonials & Social Proof */}
          <TestimonialsSection />
        </main>
      )}

      {/* Footer */}
      <Footer
        onOpenTour={() => setIsTourModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
      />

      {/* Modals & Slide-overs */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProductId(null)}
        onAddToCart={handleAddToCart}
        onQuickCheckout={handleOpenQuickCheckout}
        onPhotoUpload={handleProductPhotoUpload}
        onPhotoReset={handleProductPhotoReset}
        onNavigateToArugula={handleNavigateToArugula}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setCheckoutDirectProduct(null);
          setCheckoutDirectQuantity(1);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setCheckoutDirectProduct(null);
          setCheckoutDirectQuantity(1);
        }}
        items={cartItems}
        directProduct={checkoutDirectProduct}
        directQuantity={checkoutDirectQuantity}
        onOrderCompleted={(order) => {
          console.log('Order completed:', order);
          trackOrderConversion();
        }}
        onClearCart={handleClearCart}
      />

      <FarmTourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
      />

      {/* Photo Manager Modal for user to view & manage all their uploaded photos */}
      <PhotoManagerModal
        isOpen={isPhotoManagerOpen}
        onClose={() => setIsPhotoManagerOpen(false)}
        productPhotos={customProductPhotos}
        onProductPhotoUpload={handleProductPhotoUpload}
        onProductPhotoReset={handleProductPhotoReset}
        heroSlides={heroSlides}
        onHeroSlidesUpdate={handleHeroSlidesUpdate}
        portfolioPhotos={portfolioPhotos}
        onPortfolioPhotoUpload={handlePortfolioPhotoUpload}
        onPortfolioPhotoReset={handlePortfolioPhotoReset}
      />

      {/* Real-Time Farm Traffic & Visitor Analytics Modal */}
      <FarmAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
    </div>
  );
}
