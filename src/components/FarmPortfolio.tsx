import React, { useState } from 'react';
import { Sprout, Droplets, Sun, Wind, Award, HeartHandshake, CheckCircle2, Camera, Upload, RotateCcw } from 'lucide-react';
import { FARM_PLOTS, FARMERS } from '../data/products';
import { FarmPlot } from '../types/farm';
import { optimizeImageFile } from '../utils/photoStorage';

interface FarmPortfolioProps {
  portfolioPhotos?: Record<string, string>;
  isLocked?: boolean;
  onPortfolioPhotoUpload?: (key: string, dataUrl: string) => void;
  onPortfolioPhotoReset?: (key: string) => void;
}

export const FarmPortfolio: React.FC<FarmPortfolioProps> = ({
  portfolioPhotos = {},
  isLocked = true,
  onPortfolioPhotoUpload,
  onPortfolioPhotoReset,
}) => {
  const [selectedPlotId, setSelectedPlotId] = useState<string>('plot-a');
  const [isProcessing, setIsProcessing] = useState(false);

  const activePlot: FarmPlot =
    FARM_PLOTS.find((p) => p.id === selectedPlotId) || FARM_PLOTS[0];

  const handleUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const optimized = await optimizeImageFile(file, 1400, 1050, 0.82);
      if (onPortfolioPhotoUpload) {
        onPortfolioPhotoUpload(key, optimized);
      }
    } catch (err) {
      console.error('Error optimizing photo', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const soilPhoto = portfolioPhotos['soil'] || '/assets/aistudio/IMG_6865_97b47eb3.jpg';

  // Resolve Rain Shelter photo from user uploads (rain-shelter, rainShelter, shelter, etc.)
  const rainShelterPhoto =
    portfolioPhotos['rain-shelter'] ||
    portfolioPhotos['rainShelter'] ||
    portfolioPhotos['shelter'] ||
    portfolioPhotos['rain_shelter'] ||
    '/assets/aistudio/IMG_6873_ae3149b1.jpg';

  const plotPhoto = portfolioPhotos[activePlot.id];

  return (
    <section id="portfolio" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Chapter 1: The Living Soil Foundation */}
      <div className="mb-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-3">
            <span>Farming Portfolio · Practice 01</span>
            <span aria-hidden="true">·</span>
            <span>Regenerative Soil Stewardship</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3523] tracking-tight">
            Cultivating living soil in Balas, Bacolor before planting a single seed.
          </h2>
          <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
            Our family farm is anchored in the belief that human wellness begins in microbial soil health. Across 7 hectares in Bacolor, Pampanga, we treat the ground as a living biological engine, teeming with indigenous microorganisms, mycorrhizal fungi, and organic matter.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Soil Image */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-stone-100 border border-[#E6DFD3] aspect-[4/3] shadow-sm group">
            {soilPhoto ? (
              <>
                <img
                  src={soilPhoto}
                  alt="Living Soil"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none"
                />
                <div className="absolute bottom-3 left-3 bg-[#1B3523]/90 text-white text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-xs">
                  8.2% Organic Matter Topsoil · Chemical-Free
                </div>

                {!isLocked && onPortfolioPhotoUpload && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onPortfolioPhotoReset && (
                      <button
                        type="button"
                        onClick={() => onPortfolioPhotoReset('soil')}
                        title="Remove photo"
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs transition-colors shadow-xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <label
                      htmlFor="soil-photo-input"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/85 text-white text-xs font-medium backdrop-blur-xs cursor-pointer transition-colors shadow-xs"
                      title="Change soil photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Updating...' : 'Change'}</span>
                      <input
                        id="soil-photo-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUpload('soil', e)}
                      />
                    </label>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F4EFE6] border-2 border-dashed border-[#DDD5C5]">
                <div className="w-14 h-14 rounded-full bg-white/80 border border-stone-200 flex items-center justify-center text-emerald-800 shadow-xs mb-2">
                  <Sprout className="w-7 h-7 text-emerald-800" />
                </div>
                <span className="font-serif font-bold text-sm text-stone-800">Living Soil Photography</span>
                <span className="text-xs text-stone-500 mt-0.5">8.2% Organic Matter Compost Windrows</span>

                {!isLocked && onPortfolioPhotoUpload && (
                  <label
                    htmlFor="soil-upload-empty"
                    className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1B3523] hover:bg-[#122418] text-white text-xs font-medium cursor-pointer shadow-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isProcessing ? 'Saving...' : 'Upload Soil Photo'}</span>
                    <input
                      id="soil-upload-empty"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload('soil', e)}
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Core Philosophy Prose */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-serif italic">
              “When you nourish the soil biology with active microbial fungi, earthworms, and multi-species cover crops, the plant naturally develops pest resistance and produces sugar-to-acid flavor ratios that industrial synthetic fertilizers can never simulate.”
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#F4EFE6]/60 rounded-xl border border-stone-200">
                <h4 className="font-serif font-bold text-base text-stone-900">Zero Inversion Tillage</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  We use broadforks and shallow bed aerators to protect mycorrhizal fungal webs and keep carbon sequestered beneath the surface.
                </p>
              </div>

              <div className="p-4 bg-[#F4EFE6]/60 rounded-xl border border-stone-200">
                <h4 className="font-serif font-bold text-base text-stone-900">Biodiverse Cover Cropping</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Between crop successions, we plant hairy vetch, crimson clover, and daikon radishes to fix atmospheric nitrogen and drill channels into deep clay.
                </p>
              </div>

              <div className="p-4 bg-[#F4EFE6]/60 rounded-xl border border-stone-200">
                <h4 className="font-serif font-bold text-base text-stone-900">Aerated Compost Teas</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  On-farm compost brewed with rainwater for 24 hours inoculates crop foliage with beneficial bacteria that suppress mold and blight organically.
                </p>
              </div>

              <div className="p-4 bg-[#F4EFE6]/60 rounded-xl border border-stone-200">
                <h4 className="font-serif font-bold text-base text-stone-900">Keyline Rainwater Capture</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Subterranean contour swales slow, spread, and sink tropical monsoon rains to recharge our deep Pampanga groundwater table naturally.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Chapter 2: Grassroots Rain Shelter · Protected Cultivation */}
      <div className="pt-16 pb-20 border-t border-[#E6DFD3]">
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-3">
            <span>Farming Portfolio · Practice 02</span>
            <span aria-hidden="true">·</span>
            <span>Protected Tropical Cultivation</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3523] tracking-tight">
            Grassroots Rain Shelter: Shielding fragile greens from monsoon downpours.
          </h3>
          <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
            In Bacolor, Pampanga, heavy tropical monsoon cloudbursts can bruise tender salad greens and cause soil splash pathogens. Our high-tunnel hoop rain shelters provide diffused sunlight and gentle cross-ventilation while completely shielding delicate wild arugula, crisp green ice lettuce, heritage tomatoes, and culinary herbs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FBF9F5] p-6 sm:p-8 rounded-2xl border border-[#E6DFD3] shadow-xs">
          {/* User's Uploaded Rain Shelter Photo */}
          <div className="lg:col-span-6 relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-100 border border-[#E6DFD3] group">
            {rainShelterPhoto ? (
              <>
                <img
                  src={rainShelterPhoto}
                  alt="Grassroots Rain Shelter in Balas, Bacolor"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none"
                />
                <div className="absolute bottom-3 left-3 bg-[#1B3523]/90 text-white text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-xs">
                  Grassroots Rain Shelter · Balas, Bacolor
                </div>

                {!isLocked && onPortfolioPhotoUpload && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onPortfolioPhotoReset && (
                      <button
                        type="button"
                        onClick={() => onPortfolioPhotoReset('rain-shelter')}
                        title="Remove photo"
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs transition-colors shadow-xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <label
                      htmlFor="shelter-photo-input"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/85 text-white text-xs font-medium backdrop-blur-xs cursor-pointer transition-colors shadow-xs"
                      title="Change rain shelter photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Updating...' : 'Change'}</span>
                      <input
                        id="shelter-photo-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUpload('rain-shelter', e)}
                      />
                    </label>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F4EFE6] border-2 border-dashed border-[#DDD5C5]">
                <div className="w-14 h-14 rounded-full bg-white/80 border border-stone-200 flex items-center justify-center text-emerald-800 shadow-xs mb-2">
                  <Sprout className="w-7 h-7 text-emerald-800" />
                </div>
                <span className="font-serif font-bold text-sm text-stone-800">Grassroots Rain Shelter</span>
                <span className="text-xs text-stone-500 mt-0.5">High-Tunnel Protected Microclimate</span>

                {!isLocked && onPortfolioPhotoUpload && (
                  <label
                    htmlFor="shelter-upload-empty"
                    className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1B3523] hover:bg-[#122418] text-white text-xs font-medium cursor-pointer shadow-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isProcessing ? 'Saving...' : 'Upload Rain Shelter Photo'}</span>
                    <input
                      id="shelter-upload-empty"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload('rain-shelter', e)}
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Shelter Details & Agronomy */}
          <div className="lg:col-span-6 space-y-4">
            <h4 className="font-serif font-bold text-xl text-stone-900">
              Unblemished Foliage &amp; Optimal Microclimates
            </h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              By combining bamboo framing with UV-stabilized diffuse canopy covers, the Grassroots Rain Shelter reduces thermal stress during midday sun and prevents monsoon rains from waterlogging root zones or splashing soil onto leaves.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-[#F4EFE6] rounded-xl border border-stone-200/80">
                <span className="text-[11px] font-bold text-[#1B3523] uppercase tracking-wider block">Crops Grown Under Shelter</span>
                <p className="text-xs text-stone-600 mt-0.5">Wild Arugula, Green Ice Lettuce, Romaine, Heirloom Tomatoes, &amp; Tender Herbs</p>
              </div>
              <div className="p-3.5 bg-[#F4EFE6] rounded-xl border border-stone-200/80">
                <span className="text-[11px] font-bold text-[#1B3523] uppercase tracking-wider block">Zero Soil Splashback</span>
                <p className="text-xs text-stone-600 mt-0.5">Leaves stay crisp and clean naturally without damp rot or fungal spore transfer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter 3: The 7-Hectare Family-Owned Farm Estate in Balas, Bacolor, Pampanga */}
      <div className="pt-16 border-t border-[#E6DFD3]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-2">
              <span>Farming Portfolio · Practice 03</span>
              <span aria-hidden="true">·</span>
              <span>Rooted Consciously on 7 Hectares</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3523] tracking-tight">
              Acreage &amp; Geological Microclimates in Balas, Bacolor, Pampanga
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-xl">
              Our 7-hectare family-owned regenerative estate is mapped into 4 distinct plots, pairing each vegetable, berry, and pasture flock to its ideal soil biome.
            </p>
          </div>

          {/* Interactive Plot Buttons */}
          <div className="flex flex-wrap gap-2">
            {FARM_PLOTS.map((plot) => (
              <button
                key={plot.id}
                onClick={() => setSelectedPlotId(plot.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  selectedPlotId === plot.id
                    ? 'bg-[#1B3523] text-white shadow-xs font-semibold'
                    : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300/80'
                }`}
              >
                {plot.name.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Plot Feature Card - Displays user's uploaded photo or organic placeholder */}
        <div className="bg-[#FBF9F5] p-6 sm:p-8 rounded-2xl border border-[#E6DFD3] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
          {/* Plot Photo */}
          <div className="lg:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-[#E6DFD3] group">
            {plotPhoto ? (
              <>
                <img
                  src={plotPhoto}
                  alt={activePlot.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none"
                />
                <div className="absolute bottom-3 left-3 bg-[#1B3523]/90 text-white text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-xs">
                  {activePlot.name} · {activePlot.acreage}
                </div>

                {!isLocked && onPortfolioPhotoUpload && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onPortfolioPhotoReset && (
                      <button
                        type="button"
                        onClick={() => onPortfolioPhotoReset(activePlot.id)}
                        title="Remove photo"
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs transition-colors shadow-xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <label
                      htmlFor={`plot-photo-${activePlot.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/85 text-white text-xs font-medium backdrop-blur-xs cursor-pointer transition-colors shadow-xs"
                      title="Change plot photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Updating...' : 'Change'}</span>
                      <input
                        id={`plot-photo-${activePlot.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUpload(activePlot.id, e)}
                      />
                    </label>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F4EFE6] border-2 border-dashed border-[#DDD5C5]">
                <div className="w-14 h-14 rounded-full bg-white/80 border border-stone-200 flex items-center justify-center text-emerald-800 shadow-xs mb-2">
                  <Sprout className="w-7 h-7 text-emerald-800" />
                </div>
                <span className="font-serif font-bold text-sm text-stone-800">{activePlot.name}</span>
                <span className="text-xs text-stone-500 mt-0.5">{activePlot.acreage} · {activePlot.soilType}</span>

                {!isLocked && onPortfolioPhotoUpload && (
                  <label
                    htmlFor={`plot-upload-empty-${activePlot.id}`}
                    className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1B3523] hover:bg-[#122418] text-white text-xs font-medium cursor-pointer shadow-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isProcessing ? 'Saving...' : 'Upload Plot Photo'}</span>
                    <input
                      id={`plot-upload-empty-${activePlot.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload(activePlot.id, e)}
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="font-semibold text-emerald-900">{activePlot.name}</span>
              <span aria-hidden="true">·</span>
              <span>{activePlot.acreage}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              {activePlot.soilType}
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed">
              {activePlot.description}
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                Primary Cultivated Crops:
              </span>
              <div className="flex flex-wrap gap-2 text-xs text-stone-800 font-medium">
                {activePlot.primaryCrops.map((crop, i) => (
                  <span key={i} className="bg-stone-200/60 px-2.5 py-1 rounded">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-[#F4EFE6] p-5 rounded-xl border border-stone-200/80 space-y-3 text-xs">
            <div>
              <p className="text-stone-500 uppercase tracking-wider text-[10px] font-semibold">Irrigation Source</p>
              <p className="font-medium text-stone-900 mt-0.5">{activePlot.irrigation}</p>
            </div>
            <div className="pt-2 border-t border-stone-200">
              <p className="text-stone-500 uppercase tracking-wider text-[10px] font-semibold">Pest Management</p>
              <p className="font-medium text-stone-900 mt-0.5">Beneficial insectary border plantings &amp; bat boxes</p>
            </div>
            <div className="pt-2 border-t border-stone-200">
              <p className="text-stone-500 uppercase tracking-wider text-[10px] font-semibold">Organic Certification</p>
              <p className="font-medium text-stone-900 mt-0.5">100% Regenerative Organic Living Soil Farming</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter 3: Meet the Growers */}
      <div className="pt-16 border-t border-[#E6DFD3] mt-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-2">
            <span>Farming Portfolio · Stewardship</span>
            <span aria-hidden="true">·</span>
            <span>The Human Hands</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3523] tracking-tight">
            Meet the Farmers Behind Your Food
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-stone-600">
            A dedicated family farm team in Balas, Bacolor, Pampanga rooted consciously in living soil agriculture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {FARMERS.map((farmer) => {
            return (
              <div
                key={farmer.id}
                className="p-7 bg-[#FBF9F5] rounded-2xl border border-[#E6DFD3] flex flex-col justify-between shadow-xs hover:border-[#1B3523]/30 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-[#1B3523] uppercase tracking-wider bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-200">
                      Family-Owned Farm
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">7 Hectares · Bacolor</span>
                  </div>

                  {/* Farmer Portrait / Monogram */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-[#1B3523]/10 border border-[#1B3523]/20 shrink-0 shadow-2xs flex items-center justify-center text-[#1B3523]">
                      <span className="font-serif font-bold text-2xl tracking-tight">
                        {farmer.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-xl text-stone-900 leading-tight">
                        {farmer.name}
                      </h4>
                      <p className="text-xs text-[#984D2E] font-semibold mt-0.5">{farmer.role}</p>
                      <span className="inline-block text-[11px] text-emerald-800 bg-emerald-100/60 font-medium px-2 py-0.5 rounded mt-1.5">
                        {farmer.badge}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                    {farmer.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/80">
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2">Core Stewardship</p>
                  <div className="flex flex-wrap gap-1.5">
                    {farmer.specialties.map((spec, idx) => (
                      <span key={idx} className="text-[10px] bg-stone-100/80 text-stone-700 px-2 py-0.5 rounded-sm border border-stone-200/50">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
