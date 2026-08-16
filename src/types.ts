// ─── Agri Direct: Core Types ────────────────────────────────────────

export type UserRole = 'farmer' | 'buyer';
export type Language = 'en' | 'hi' | 'mr';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  location: string;
  avatar: string;
  rating: number;
  joinedDate: string;
}

export type ProductCategory =
  | 'vegetables'
  | 'fruits'
  | 'grains'
  | 'pulses'
  | 'spices'
  | 'dairy'
  | 'oilseeds'
  | 'flowers';

export type ProductUnit = 'kg' | 'quintal' | 'ton' | 'dozen' | 'litre' | 'piece';

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  nameHi: string;
  nameMr: string;
  category: ProductCategory;
  description: string;
  price: number;
  unit: ProductUnit;
  quantity: number;
  location: string;
  harvestDate: string;
  image: string;
  organic: boolean;
  active: boolean;
  createdAt: string;
}

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered';

export interface Offer {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  offeredPrice: number;
  originalPrice: number;
  quantity: number;
  unit: ProductUnit;
  status: OfferStatus;
  message: string;
  createdAt: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  quantity: number;
  unit: ProductUnit;
  totalPrice: number;
  status: OrderStatus;
  deliveryAddress: string;
  placedAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export type NotificationType = 'offer' | 'order' | 'price' | 'system';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface MarketPrice {
  commodity: string;
  commodityHi: string;
  commodityMr: string;
  unit: ProductUnit;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  mandi: string;
  trend: 'up' | 'down' | 'stable';
  priceHistory: number[];
}

export interface AppState {
  currentUser: User;
  users: User[];
  products: Product[];
  offers: Offer[];
  orders: Order[];
  notifications: AppNotification[];
  marketPrices: MarketPrice[];
  language: Language;
}
