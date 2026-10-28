export type ProductCategory = 
  | 'all' 
  | 'vegetables' 
  | 'greens' 
  | 'fruits' 
  | 'boxes' 
  | 'pantry';

export interface Product {
  id: string;
  name: string;
  variety?: string;
  category: ProductCategory;
  price: number;
  unit: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  harvestWindow: string;
  plotLocation: string;
  inStock: boolean;
  stockCount: number;
  isOrganicCertified: boolean;
  isHeirloom: boolean;
  isLimitedHarvest?: boolean;
  flavorNotes: string[];
  storageTip: string;
  chefSuggestion: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: string;
}

export interface HarvestBoxOption {
  id: string;
  name: string;
  tagline: string;
  serves: string;
  itemsCount: string;
  price: number;
  frequency: 'weekly' | 'biweekly' | 'onetime';
  sampleItems: string[];
  popular?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  featuredProductIds: string[];
  description: string;
  ingredients: string[];
  instructions: string[];
}

export interface FarmPlot {
  id: string;
  name: string;
  acreage: string;
  soilType: string;
  primaryCrops: string[];
  irrigation: string;
  description: string;
  image: string;
}

export type PaymentMethodType = 'gcash' | 'bdo' | 'bpi' | 'cod' | 'pickup_cash';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  deliveryDate: string;
  fulfillmentType: 'delivery' | 'pickup';
  paymentMethod: PaymentMethodType;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
  createdAt?: string;
  emailSent?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  organization: string;
  source: 'google' | 'chef' | 'community';
  rating: number;
  badge?: string;
  date?: string;
}

export interface Farmer {
  id: string;
  name: string;
  role: string;
  badge: string;
  bio: string;
  specialties: string[];
  image?: string;
}
