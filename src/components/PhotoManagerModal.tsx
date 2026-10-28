import React, { useState } from 'react';
import { X, Camera, Trash2, Upload, CheckCircle2, Image as ImageIcon, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { optimizeImageFile, CustomSlide } from '../utils/photoStorage';

interface PhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  productPhotos: Record<string, string>;
  onProductPhotoUpload: (productId: string, dataUrl: string) => void;
  onProductPhotoReset: (productId: string) => void;
  heroSlides: CustomSlide[];
  onHeroSlidesUpdate: (slides: CustomSlide[]) => void;
  portfolioPhotos: Record<string, string>;
  onPortfolioPhotoUpload: (key: string, dataUrl: string) => void;
  onPortfolioPhotoReset: (key: string) => void;
}

export const PhotoManagerModal: React.FC<PhotoManagerModalProps> = ({
  isOpen,
  onClose,
  productPhotos,
  onProductPhotoUpload,
  onProductPhotoReset,
  heroSlides,
  onHeroSlidesUpdate,
  portfolioPhotos,
  onPortfolioPhotoUpload,
  onPortfolioPhotoReset,
}) => {
  const [activeTab, setActiveTab] = useState<'produce' | 'hero' | 'portfolio'>('produce');
  const [searchFilter, setSearchFilter] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSingleProductUpload = async (productId: string, file: File) => {
    try {
      setIsProcessing(true);
      const optimized = await optimizeImageFile(file, 1000, 750, 0.82);
      onProductPhotoUpload(productId, optimized);
      showNotification('Produce photo updated!');
    } catch (err) {
      console.error(err);
      showNotification('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHeroMultipleUpload = async (files: FileList) => {
    try {
      setIsProcessing(true);
      const newItems: CustomSlide[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const optimized = await optimizeImageFile(file, 1600, 1200, 0.82);
        newItems.push({
          id: `custom-slide-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          url: optimized,
          title: file.name.replace(/\.[^/.]+$/, '').slice(0, 30),
          subtitle: 'Uploaded farm photograph',
          isCustom: true,
          uploadedAt: Date.now(),
        });
      }
      if (newItems.length > 0) {
        onHeroSlidesUpdate([...newItems, ...heroSlides]);
        showNotification(`Added ${newItems.length} slideshow photos!`);
      }
    } catch (err) {
      console.error(err);
      showNotification('Error processing hero photos');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePortfolioUpload = async (key: string, file: File) => {
    try {
      setIsProcessing(true);
      const optimized = await optimizeImageFile(file, 1400, 1050, 0.82);
      onPortfolioPhotoUpload(key, optimized);
      showNotification('Farm portfolio photo updated!');
    } catch (err) {
      console.error(err);
      showNotification('Error processing photo');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const productPhotosCount = PRODUCTS.filter((p) => Boolean(productPhotos[p.id] || p.image)).length;
  const portfolioPhotosCount = Object.keys(portfolioPhotos).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#FBF9F5] rounded-2xl max-w-4xl w-full border border-[#E6DFD3] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#E6DFD3] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-1">
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>Farm Photo Manager</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-600 font-normal normal-case">100% Real Farm Photos Only</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1B3523]">
              Upload Your Own Farm Photos
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              All AI photos have been removed. Upload real photographs of your harvest, fields, and facilities directly below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Close photo manager"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 bg-[#F6F2EA] border-b border-[#E6DFD3] overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('produce')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'produce'
                ? 'bg-[#1B3523] text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200/70'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Produce Catalog</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'produce' ? 'bg-emerald-800 text-emerald-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {productPhotosCount} / {PRODUCTS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'hero'
                ? 'bg-[#1B3523] text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200/70'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Hero Top Slideshow</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'hero' ? 'bg-emerald-800 text-emerald-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {heroSlides.length} photos
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'portfolio'
                ? 'bg-[#1B3523] text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200/70'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Farm Facilities &amp; Soil</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'portfolio' ? 'bg-emerald-800 text-emerald-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {portfolioPhotosCount} photos
            </span>
          </button>

          {feedback && (
            <div className="ml-auto text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md animate-fade-in">
              {feedback}
            </div>
          )}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: PRODUCE CATALOG */}
          {activeTab === 'produce' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    Produce Items ({PRODUCTS.length})
                  </h4>
                  <p className="text-xs text-stone-600">
                    Click any item to upload or change its photo from your computer or phone.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search produce..."
                    className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                  />
                  {productPhotosCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Clear all uploaded produce photos?')) {
                          Object.keys(productPhotos).forEach((id) => onProductPhotoReset(id));
                          showNotification('All produce photos cleared');
                        }
                      }}
                      className="px-2.5 py-1.5 text-xs text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                      title="Clear all uploaded produce photos"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of Produce items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProducts.map((prod) => {
                  const photoSrc = productPhotos[prod.id] || prod.image;
                  const hasPhoto = Boolean(photoSrc);

                  return (
                    <div
                      key={prod.id}
                      className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                        hasPhoto
                          ? 'bg-white border-emerald-300/80 shadow-xs'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {/* Photo Thumbnail / Placeholder */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-200 shrink-0 border border-stone-200 flex items-center justify-center">
                        {hasPhoto ? (
                          <img
                            src={photoSrc}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-stone-400 flex flex-col items-center">
                            <Camera className="w-5 h-5 mb-0.5" />
                            <span className="text-[9px] font-mono">No photo</span>
                          </div>
                        )}
                      </div>

                      {/* Info & Upload Action */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-semibold text-emerald-900 truncate">
                            {prod.category}
                          </span>
                          {hasPhoto && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-medium px-1 rounded">
                              Uploaded
                            </span>
                          )}
                        </div>
                        <p className="font-serif font-bold text-sm text-stone-900 truncate">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-stone-500 font-mono">
                          ₱{prod.price} {prod.unit}
                        </p>

                        <div className="mt-1.5 flex items-center gap-2">
                          <label className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1B3523] hover:bg-[#122418] text-white text-[10px] font-medium cursor-pointer transition-colors">
                            <Upload className="w-3 h-3" />
                            <span>{hasPhoto ? 'Change' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isProcessing}
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleSingleProductUpload(prod.id, f);
                              }}
                            />
                          </label>

                          {hasPhoto && (
                            <button
                              type="button"
                              onClick={() => onProductPhotoReset(prod.id)}
                              className="text-stone-400 hover:text-red-700 text-[10px] transition-colors"
                              title="Remove photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: HERO TOP SLIDESHOW */}
          {activeTab === 'hero' && (
            <div>
              <div className="p-4 rounded-xl bg-white border border-[#E6DFD3] mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    Hero Top Slideshow Photos ({heroSlides.length})
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Upload multiple photos to cycle dynamically at the very top of your farm website.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3523] hover:bg-[#122418] text-white text-xs font-medium rounded-lg cursor-pointer transition-all shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>Upload Multiple Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={isProcessing}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) handleHeroMultipleUpload(e.target.files);
                      }}
                    />
                  </label>

                  {heroSlides.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Clear all hero photos?')) {
                          onHeroSlidesUpdate([]);
                          showNotification('All hero slideshow photos cleared');
                        }
                      }}
                      className="px-3 py-2 text-xs text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {heroSlides.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-stone-300 rounded-xl bg-stone-50">
                  <Camera className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                  <p className="font-serif font-bold text-stone-800 text-base">
                    No Hero Slideshow Photos Uploaded Yet
                  </p>
                  <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
                    All AI photos have been removed. Click the button below to upload your real farm photos for the top banner.
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B3523] hover:bg-[#122418] text-white text-xs font-medium rounded-lg cursor-pointer transition-colors shadow-xs">
                    <Camera className="w-4 h-4" />
                    <span>Choose Photos to Upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) handleHeroMultipleUpload(e.target.files);
                      }}
                    />
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {heroSlides.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className="group relative rounded-xl overflow-hidden border border-stone-200 aspect-[4/3] bg-stone-100 shadow-xs"
                    >
                      <img
                        src={slide.url}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = heroSlides.filter((s) => s.id !== slide.id);
                            onHeroSlidesUpdate(updated);
                            showNotification('Slide removed');
                          }}
                          className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors"
                          title="Remove this photo"
                          aria-label="Remove this photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FARM PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif font-bold text-base text-stone-900">
                  Farming Portfolio &amp; Facilities
                </h4>
                <p className="text-xs text-stone-600">
                  Upload authentic photos for the Living Soil regenerative section, the Grassroots Rain Shelter, and Plot zones.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Living Soil */}
                <div className="p-4 rounded-xl bg-white border border-[#E6DFD3] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-900">
                      Practice 01
                    </span>
                    <h5 className="font-serif font-bold text-sm text-stone-900 mt-0.5">
                      Living Soil &amp; Compost Windrows
                    </h5>
                    <p className="text-xs text-stone-500 mt-1">
                      8.2% Organic Matter Topsoil held in farmer hands or compost piles.
                    </p>
                  </div>

                  <div className="mt-4 relative aspect-[16/10] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                    {portfolioPhotos['soil'] ? (
                      <img
                        src={portfolioPhotos['soil']}
                        alt="Living Soil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4 text-stone-400">
                        <Camera className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-[11px]">No photo uploaded yet</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B3523] hover:bg-[#122418] text-white text-xs font-medium cursor-pointer transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{portfolioPhotos['soil'] ? 'Change Soil Photo' : 'Upload Soil Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handlePortfolioUpload('soil', f);
                        }}
                      />
                    </label>

                    {portfolioPhotos['soil'] && (
                      <button
                        type="button"
                        onClick={() => onPortfolioPhotoReset('soil')}
                        className="text-stone-400 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Grassroots Rain Shelter */}
                <div className="p-4 rounded-xl bg-white border border-[#E6DFD3] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-900">
                      Practice 02
                    </span>
                    <h5 className="font-serif font-bold text-sm text-stone-900 mt-0.5">
                      Grassroots Rain Shelter
                    </h5>
                    <p className="text-xs text-stone-500 mt-1">
                      Protected hoop house for tender wild arugula, baby greens, and micro-herbs.
                    </p>
                  </div>

                  <div className="mt-4 relative aspect-[16/10] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                    {portfolioPhotos['rain-shelter'] ? (
                      <img
                        src={portfolioPhotos['rain-shelter']}
                        alt="Grassroots Rain Shelter"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4 text-stone-400">
                        <Camera className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-[11px]">No photo uploaded yet</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B3523] hover:bg-[#122418] text-white text-xs font-medium cursor-pointer transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{portfolioPhotos['rain-shelter'] ? 'Change Shelter Photo' : 'Upload Shelter Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handlePortfolioUpload('rain-shelter', f);
                        }}
                      />
                    </label>

                    {portfolioPhotos['rain-shelter'] && (
                      <button
                        type="button"
                        onClick={() => onPortfolioPhotoReset('rain-shelter')}
                        className="text-stone-400 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-white border-t border-[#E6DFD3] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Photos are saved automatically to your farm website in your browser</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1B3523] hover:bg-[#122418] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
