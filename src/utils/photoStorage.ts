/**
 * Centralized utility for client-side photo uploads, canvas resizing,
 * and persistent server-side & localStorage synchronization for Grassroots & Co. Farms.
 */

import finalPhotosData from '../data/finalPhotos.json';

export interface CustomSlide {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  isCustom: boolean;
  uploadedAt: number;
}

export const STORAGE_KEYS = {
  heroSlides: 'grassroots_hero_slideshow_photos',
  productPhotos: 'grassroots_product_photos',
  portfolioPhotos: 'grassroots_portfolio_photos',
  boxPhotos: 'grassroots_box_photos',
  farmerPhotos: 'grassroots_farmer_photos',
  isLocked: 'grassroots_site_photos_locked',
};

/**
 * Resizes and compresses an uploaded image file using an offscreen canvas
 * to prevent browser localStorage quota exceeded errors while retaining high visual fidelity.
 */
export const optimizeImageFile = (
  file: File,
  maxWidth = 1400,
  maxHeight = 1050,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw with smooth bi-linear interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with specified quality
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Hero slideshow storage helpers.
 * Falls back to permanent baked-in finalPhotos.json so photos are never lost when published.
 */
export const getStoredHeroPhotos = (): CustomSlide[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.heroSlides);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Error reading hero photos from storage', err);
  }
  // Fallback to permanent project photos
  return (finalPhotosData.heroSlides as CustomSlide[]) || [];
};

export const saveStoredHeroPhotos = (slides: CustomSlide[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.heroSlides, JSON.stringify(slides));
  } catch (err) {
    console.warn('LocalStorage limit reached when saving hero photos', err);
  }
};

/**
 * Produce catalog photo storage helpers.
 * Merges permanent baked-in finalPhotos.json with any local edits.
 */
export const getStoredProductPhotos = (): Record<string, string> => {
  const baked = (finalPhotosData.productPhotos as Record<string, string>) || {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.productPhotos);
    if (!raw) return baked;
    const parsed = JSON.parse(raw);
    return { ...baked, ...parsed };
  } catch {
    return baked;
  }
};

export const saveStoredProductPhotos = (photos: Record<string, string>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.productPhotos, JSON.stringify(photos));
  } catch (err) {
    console.warn('LocalStorage limit reached when saving product photos', err);
  }
};

/**
 * Portfolio photo storage helpers.
 * Merges permanent baked-in finalPhotos.json with any local edits.
 */
export const getStoredPortfolioPhotos = (): Record<string, string> => {
  const baked = (finalPhotosData.portfolioPhotos as Record<string, string>) || {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.portfolioPhotos);
    if (!raw) return baked;
    const parsed = JSON.parse(raw);
    return { ...baked, ...parsed };
  } catch {
    return baked;
  }
};

export const saveStoredPortfolioPhotos = (photos: Record<string, string>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.portfolioPhotos, JSON.stringify(photos));
  } catch (err) {
    console.warn('LocalStorage limit reached when saving portfolio photos', err);
  }
};

/**
 * Box Builder photo storage helpers.
 * Merges permanent baked-in finalPhotos.json with any local edits.
 */
export const getStoredBoxPhotos = (): Record<string, string> => {
  const baked = (finalPhotosData.boxPhotos as Record<string, string>) || {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.boxPhotos);
    if (!raw) return baked;
    const parsed = JSON.parse(raw);
    return { ...baked, ...parsed };
  } catch {
    return baked;
  }
};

export const saveStoredBoxPhotos = (photos: Record<string, string>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.boxPhotos, JSON.stringify(photos));
  } catch (err) {
    console.warn('LocalStorage limit reached when saving box photos', err);
  }
};

/**
 * Check whether photos are locked for publishing so visitors cannot edit or delete them.
 * Defaults to TRUE for security so published visitors cannot alter anything.
 */
export const getIsPhotosLocked = (): boolean => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.isLocked);
    if (raw !== null) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return true; // Locked by default
};

export const setIsPhotosLocked = (locked: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.isLocked, JSON.stringify(locked));
  } catch {
    // ignore
  }
};

/**
 * Permanently saves all currently uploaded photos to the codebase (src/data/finalPhotos.json)
 * so that when the applet is built and published, the photos are baked into the static distribution
 * and will NEVER be removed or lost.
 */
export const syncPhotosToCodebase = async (): Promise<boolean> => {
  try {
    const heroSlides = getStoredHeroPhotos();
    const productPhotos = getStoredProductPhotos();
    const portfolioPhotos = getStoredPortfolioPhotos();
    const boxPhotos = getStoredBoxPhotos();

    const payload = {
      heroSlides,
      productPhotos,
      portfolioPhotos,
      boxPhotos,
      isLocked: true,
      finalizedAt: Date.now(),
    };

    const res = await fetch('/api/save-final-photos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setIsPhotosLocked(true);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to sync photos to codebase:', err);
    return false;
  }
};

/**
 * Robust photo resolver for produce catalog items.
 * Guarantees that photos uploaded by the user for green ice lettuce, kaffir lime,
 * kale, lemon grass, japanese cucumber, tomato native, red lady papaya,
 * romaine lettuce, brown eggs, and arugula are accurately matched and displayed.
 */
export const resolveProductPhoto = (
  prod: { id: string; name: string; image?: string },
  customPhotos: Record<string, string> = {},
  bakedPhotos: Record<string, string> = (finalPhotosData.productPhotos as Record<string, string>) || {}
): string => {
  const allPhotos: Record<string, string> = { ...bakedPhotos, ...customPhotos };

  // 1. Direct ID match (e.g., 'prod-green-ice-lettuce')
  if (allPhotos[prod.id]) return allPhotos[prod.id];

  // 2. Slug match (e.g., 'green-ice-lettuce')
  const slug = prod.id.replace(/^prod-/, '');
  if (allPhotos[slug]) return allPhotos[slug];

  // 3. Name-based match
  const cleanProdName = prod.name.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const [key, val] of Object.entries(allPhotos)) {
    if (!val) continue;
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (cleanKey === cleanProdName || cleanProdName.includes(cleanKey) || cleanKey.includes(cleanProdName)) {
      return val;
    }

    // Heuristics for the user's specific uploaded items
    if (prod.id.includes('green-ice') && (cleanKey.includes('greenice') || cleanKey.includes('icelettuce') || cleanKey.includes('greenicelettuce') || (cleanKey.includes('green') && cleanKey.includes('ice')))) {
      return val;
    }
    if (prod.id.includes('kaffir') && (cleanKey.includes('kaffir') || cleanKey.includes('makrut') || cleanKey.includes('lime'))) {
      return val;
    }
    if (prod.id.includes('kale') && cleanKey.includes('kale')) {
      return val;
    }
    if (prod.id.includes('lemon-grass') && (cleanKey.includes('lemongrass') || cleanKey.includes('lemon') || cleanKey.includes('tanglad'))) {
      return val;
    }
    if (prod.id.includes('japanese-cucumber') && (cleanKey.includes('cucumber') || cleanKey.includes('japanesecucumber') || cleanKey.includes('pipino') || cleanKey.includes('japanese'))) {
      return val;
    }
    if ((prod.id.includes('tomato-native') || prod.id.includes('native')) && (cleanKey.includes('native') || cleanKey.includes('tomatonative') || cleanKey.includes('kamatis') || (cleanKey.includes('tomato') && cleanKey.includes('native')))) {
      return val;
    }
    if (prod.id.includes('red-lady-papaya') && (cleanKey.includes('papaya') || cleanKey.includes('redlady') || cleanKey.includes('redladypapaya'))) {
      return val;
    }
    if (prod.id.includes('romaine') && (cleanKey.includes('romaine') || cleanKey.includes('cos') || cleanKey.includes('romainelettuce'))) {
      return val;
    }
    if ((prod.id.includes('brown-egg') || prod.id.includes('egg')) && (cleanKey.includes('egg') || cleanKey.includes('brownegg') || cleanKey.includes('browneggs') || cleanKey.includes('tray'))) {
      return val;
    }
    if (prod.id.includes('arugula-baby') && (cleanKey.includes('arugulababy') || cleanKey.includes('babyarugula'))) {
      return val;
    }
    if (prod.id.includes('arugula-regular') && (cleanKey.includes('arugularegular') || cleanKey.includes('rocket'))) {
      return val;
    }
    if (prod.id.includes('arugula') && cleanKey.includes('arugula')) {
      return val;
    }
  }

  // Fallback to product.image default (which has real Arugula photos baked in)
  return prod.image || '';
};

/**
 * Resolves the 1 rain shelter photo uploaded by user from portfolio, box, or baked storage.
 */
export const resolveRainShelterPhoto = (
  portfolioPhotos: Record<string, string> = {},
  bakedPortfolio: Record<string, string> = (finalPhotosData.portfolioPhotos as Record<string, string>) || {}
): string => {
  const merged = { ...bakedPortfolio, ...portfolioPhotos };

  if (merged['rain-shelter']) return merged['rain-shelter'];
  if (merged['rainShelter']) return merged['rainShelter'];
  if (merged['shelter']) return merged['shelter'];
  if (merged['rain_shelter']) return merged['rain_shelter'];

  for (const [key, val] of Object.entries(merged)) {
    if (val && (key.toLowerCase().includes('rain') || key.toLowerCase().includes('shelter'))) {
      return val;
    }
  }

  // Fallback to real greenhouse rain shelter photo uploaded by user
  return '/assets/aistudio/IMG_6873_ae3149b1.jpg';
};

