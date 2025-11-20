import React from 'react';

// FIX: Moved Theme definition here from themeService.ts to resolve circular dependencies.
export const AVAILABLE_THEMES_LIST = [
  'dark', 'light', 'gryffindor', 'slytherin', 'ollivanders', 
  'gringotts', 'wholesale', 'halloween', 'winter'
] as const;
// A theme ID can be one of the built-in themes or a custom string for uploaded themes.
export type Theme = typeof AVAILABLE_THEMES_LIST[number] | (string & {});


export type LocalizedString = {
  [key:string]: string; // e.g., { en: 'Hello', es: 'Hola' }
}

export type Pricing = {
  [currency: string]: number; // e.g., { USD: 39.99, EUR: 36.99 }
}

export interface InventoryLocation {
  centreId: string;
  name: string;
  stock: number;
}

export type MediaType = 'image' | 'video' | 'image_360';

export interface ProductMedia {
  type: MediaType;
  url: string;
  thumbnailUrl?: string; // Optional: for videos or 360 images to show a specific thumbnail
}

export interface ProductVariation {
  id: number; // Unique ID for the variation
  attributes: { [key: string]: string }; // e.g., { size: 'M', color: 'Red' }
  sku: string;
  barcode?: string;
  pricing: Pricing;
  rrp?: Pricing;
  tradePrice?: Pricing;
  inventory: InventoryLocation[];
  media?: ProductMedia[]; // Optional: variations can have their own images
}


export interface Product {
  id: number;
  name: LocalizedString;
  description: LocalizedString;
  // For products WITHOUT variations, these are used directly.
  // For products WITH variations, these can be seen as "base" or "default" values.
  pricing: Pricing;
  rrp?: Pricing;
  tradePrice?: Pricing;
  media: ProductMedia[];
  taxonomy: {
    fandom: string;
    subCategory: string;
  };
  sku: string;
  barcode?: string; // EAN, UPC, etc.
  inventory: InventoryLocation[];
  sellerId: number;
  // New fields for variations
  hasVariations?: boolean;
  variations?: ProductVariation[];
  variationOptions?: { [key: string]: string[] }; // e.g., { size: ['S', 'M', 'L'], color: ['Red', 'Blue'] }
  // New fields for B2B / Dropshipping
  fulfillmentModel: 'HoS Warehouse' | 'Seller Direct';
  procurementDetails?: {
    caseQuantity?: number;
    minOrderQuantity?: number;
  };
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
}

// Derived 'stock' property for convenience
export interface ProductWithTotalStock extends Product {
  stock: number;
  averageRating: number;
  reviewCount: number;
}

export interface CartItem extends Product {
  quantity: number;
  variationId?: number;
}

export interface Address {
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ShippingAddress extends Address {
  firstName: string;
  lastName: string;
  email?: string; // For guest checkouts
}

export interface UserAddress extends ShippingAddress {
  id: number;
  isDefault: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // For simulated local authentication
  loyaltyPoints: number;
  role: 'customer' | 'seller' | 'admin' | 'support_agent' | 'content_moderator' | 'marketing_manager' | 'finance_manager' | 'accountant' | 'order_manager' | 'shipping_coordinator' | 'warehouse_operative' | 'logistics_coordinator' | 'customer_support_lead' | 'catalog_manager' | 'delivery_coordinator';
  phone?: string;
  addresses?: UserAddress[];
  createdAt: string;
}



export interface PaymentDetails {
  method: 'Simulated Card' | 'Simulated PayPal';
  transactionId: string;
}

export interface OrderAuditLogEntry {
    timestamp: string;
    user: string;
    previousStatus: Order['status'];
    newStatus: Order['status'];
    notes?: string;
}


export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  
  // Financial Breakdown
  currency: string;
  subtotal: number;
  shippingCost: number;
  taxes: number;
  platformFee: {
    local: number; // The fee in the transaction's original currency
    base: number;  // The fee converted to the platform's base currency (e.g., GBP)
  };
  total: number; // The final amount charged to the customer (subtotal + shipping + taxes)
  promoCode?: string;
  discountAmount: number;
  
  // Post-transaction details
  status: 'Processing' | 'Awaiting Shipment' | 'Partially Shipped' | 'Shipped' | 'Awaiting Pickup' | 'Delivered' | 'Cancelled' | 'Return Requested' | 'Return Approved' | 'Return Rejected' | 'Return Processing' | 'Return Completed' | 'Delivery Exception';
  sellerPayout: number; // The amount the seller receives (subtotal - platformFee.local)

  // Logistics Details
  shippingMethod: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippingNotes?: string;

  // Audit Trail
  auditLog: OrderAuditLogEntry[];
}

export interface SellerTheme {
  name: Theme;
  customizations?: Record<string, string>;
}

export interface SellerPerformance {
  totalSales: number;
  averageRating: number;
  activeListings: number;
}

export interface AuditLogEntry {
  action: 'approved' | 'rejected' | 'verified' | 'unverified';
  admin: string;
  timestamp: string;
}

export interface Transaction {
    id: string;
    date: string;
    type: 'Sale' | 'Payout' | 'Adjustment' | 'Fee' | 'Refund';
    amount: number; // Positive for credit, negative for debit
    currency: string;
    description: string;
    referenceId?: string; // e.g., Order ID or Payout ID
    sellerId: number;
    processedBy: string; // Name of admin or 'System'
}

export interface PayoutRecord {
  date: string;
  amount: number;
  currency: string;
  transactionId: string;
}

export interface SellerFinancials {
  balance: { [currency: string]: number };
  payoutHistory: PayoutRecord[];
  transactionLog: Transaction[];
  // New fields for automated payouts
  payoutProvider: 'stripe' | 'paypal' | null;
  payoutAccountId: string | null;
  kycStatus: 'not_started' | 'pending' | 'verified' | 'action_required' | 'rejected';
}

export interface Seller {
  id: number;
  name: string; // Storefront name
  theme: SellerTheme;
  businessName: string;
  contactEmail: string;
  businessAddress: Address;
  productCategories: string[];
  status: 'pending' | 'approved' | 'rejected';
  type: 'B2C' | 'Wholesale';
  applicationDate: string;
  isVerified: boolean; // Platform-level verification (e.g., business docs)
  payoutsEnabled: boolean; // Payout provider verification (e.g., Stripe KYC)
  performance: SellerPerformance;
  auditLog: AuditLogEntry[];
  financials: SellerFinancials;
  unlockedThemes: Theme[];
}

export interface Promotion {
  id: number;
  code: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'PRODUCT_SPECIFIC_PERCENTAGE';
  value: number; // e.g., 10 for 10% or 10 for $10. Not used for FREE_SHIPPING.
  minSpend?: number;
  isActive: boolean;
  
  // Advanced Features
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  usageCount: number;
  maxUsage?: number;
  
  // Targeting
  applicableCategory?: string;
  applicableProductIds?: number[];
}

// --- LOGISTICS TYPES ---

export type ShippingZone = 'UK' | 'EU' | 'NA' | 'ROW'; // Rest of World

export interface ShippingRate {
  method: 'Standard' | 'Express';
  zone: ShippingZone;
  cost: number;
  estimatedDays: { min: number, max: number };
}

export interface Carrier {
  id: string;
  name: string;
  rates: ShippingRate[];
}

export interface ShippingOption {
    carrierId: string;
    carrierName: string;
    method: 'Standard' | 'Express';
    cost: number;
    estimatedDelivery: string;
}

export interface TrackingStatus {
    timestamp: string;
    status: string;
    location: string;
}


export type ReturnReasonCode = 'WRONG_ITEM' | 'DAMAGED' | 'UNWANTED' | 'WRONG_SIZE' | 'OTHER';

export interface ReturnReason {
    code: ReturnReasonCode;
    description: string;
}

export type ReturnStatus =
    | 'Pending Approval'
    | 'Approved - Awaiting Return'
    | 'In Transit'
    | 'Received - Pending Inspection'
    | 'Inspection Complete - Approved'
    | 'Inspection Complete - Rejected'
    | 'Completed - Refunded'
    | 'Completed - Store Credit Issued'
    | 'Completed - Replacement Sent'
    | 'Rejected';

export interface ReturnRequest {
    id: string; // Unique return ID, e.g. RET-ORDERID-TIMESTAMP
    orderId: string;
    items: { productId: number; quantity: number }[];
    reasonCode: ReturnReasonCode;
    reasonDetail: string; // Customer's own words
    status: ReturnStatus;
    requestDate: string;
    resolutionType?: 'Refund' | 'Store Credit' | 'Replacement';
    adminNotes?: string;
    resolutionDate?: string;
    // New fields for tracking
    returnTrackingNumber?: string;
    returnCarrier?: string;
    replacementTrackingNumber?: string;
    replacementCarrier?: string;
}

// --- ANALYTICS TYPES ---
export interface SellerAnalyticsData {
    totalRevenue: number;
    totalItemsSold: number;
    averageOrderValue: number;
    topSellingProducts: (ProductWithTotalStock & { unitsSold: number })[];
    salesByDay: { name: string; sales: number }[];
}

export interface BIInsight {
    type: 'info' | 'warning' | 'suggestion';
    message: string;
}


// --- THEME & CONTENT ENGINE TYPES ---

export interface ThemeHero {
  image: string;
  title: LocalizedString;
  subtitle: LocalizedString;
}

export type HomePageLayoutId = 'standard' | 'featured' | 'enchanted';
export type ProductPageLayoutId = 'classic-split' | 'image-focused-stack';

export interface ThemeConfiguration {
  id: Theme;
  name: string;
  layout: HomePageLayoutId;
  productPageLayout: ProductPageLayoutId;
  hero: ThemeHero;
  price: number; // Price to unlock the theme
  isCustom: boolean; // True if uploaded by an admin
  isAvailable: boolean; // Can be toggled by admin
  cssContent?: string; // For custom uploaded themes
}

export type SeasonalThemeConfig = {
  name: Theme | null;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
};

export type HomePageCollection = {
  id: string;
  title: LocalizedString;
  type: 'new-arrivals' | 'bestsellers' | 'manual';
  productIds: number[]; // Used for 'manual' type
  order: number;
};

export interface HomePageContent {
  hero: ThemeHero;
  featuredFandoms: string[];
  collections: HomePageCollection[];
}


// --- RBAC (Role-Based Access Control) ---
export type Permission =
  // Products
  | 'read:products'
  | 'write:products'
  | 'delete:products'
  // Sellers
  | 'read:sellers'
  | 'write:sellers' // Includes status changes, verification
  // Users
  | 'read:users'
  | 'write:users'
  | 'delete:users'
  // Orders
  | 'read:orders'
  | 'write:orders' // e.g., change status
  | 'read:order_audit_log'
  // Promotions
  | 'read:promotions'
  | 'write:promotions'
  // Financials
  | 'read:financials'
  | 'execute:payouts'
  | 'write:transactions' // For manual entries
  // Platform
  | 'manage:themes'
  | 'manage:roles'
  | 'manage:logistics'
  | 'manage:integrations'
  | 'manage:content'
  // Dashboards
  | 'access:picking_dashboard'
  | 'access:delivery_dashboard';

export interface Role {
  id: string; // e.g., 'admin', 'content_moderator'
  name: string; // e.g., 'Administrator', 'Content Moderator'
  description: string;
  permissions: Permission[];
}

// --- Third-Party Integrations ---
export type IntegrationName = 'stripe' | 'paypal' | 'shipstation';

export interface IntegrationCredentials {
  [key: string]: string;
}

export type IntegrationSettings = Record<IntegrationName, IntegrationCredentials>;