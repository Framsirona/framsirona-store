export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  previewImages: string[];
  downloadFile: string; // URL or Canva Link, or uploaded Cloudinary cloud storage file
  createdAt: string; // ISO timestamp
  fileSize?: string; // professional metadata (e.g. "12 MB")
  fileFormat?: string; // professional metadata (e.g. "PSD", "Canva Link", "PDF")
  features?: string[]; // bullet point features to make details page premium
  paymentLink?: string; // Snippe external checkout URL
  checkoutUrl: string; // Snippe direct hosted checkout URL
  imageUrl?: string; // Cloudinary URL for preview image
  downloadUrl?: string; // Cloudinary URL for ZIP file
}

export type CategoryType = 
  | 'Poster templates'
  | 'Flyer templates'
  | 'Business card templates'
  | 'Canva templates'
  | 'Ebooks'
  | 'PSD templates'
  | 'Social media kits'
  | 'Invoice templates'
  | 'Branding kits';

export interface CategoryInfo {
  id: CategoryType;
  name: CategoryType;
  description: string;
  icon: string; // Lucide icon name
  count?: number;
  imageUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface WebsiteTemplate {
  id: string;
  title: string;
  description: string;
  category: 
    | 'Business website'
    | 'Logistics company website'
    | 'Accounting firm website'
    | 'Job board website'
    | 'Church website'
    | 'Real estate website'
    | 'Creative agency website'
    | 'Portfolio website'
    | 'Barber shop website'
    | 'Restaurant website'
    | 'Ecommerce website';
  price: number;
  previewImages: string[];
  liveDemoUrl: string;
  techStack: string[];
  downloadFile: string; // downloadable ZIP
  features: string[];
  createdAt: string;
  paymentLink?: string; // Optional Snippe checkout URL
}

export interface AffiliateProduct {
  id: string;
  title: string;
  description: string;
  category: 'Recommended Tools' | 'Creator Essentials' | 'Office & Business Tools';
  image: string;
  amazonLink: string;
  createdAt: string;
}

export interface DigitalOrder {
  id: string;
  productId: string;
  productType: 'product' | 'website';
  productTitle: string;
  buyerEmail: string;
  pricePaid: number;
  createdAt: string;
  status: 'completed' | 'processing' | 'pending' | 'canceled';
  paymentGateway: 'Snippe' | 'Manual-Sim';
  paymentIntentId: string;
  downloadToken: string;
  tokenExpiresAt: string;
}

export interface DownloadLog {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  buyerEmail: string;
  ipAddress: string;
  userAgent: string;
  downloadedAt: string;
  status: 'success' | 'expired' | 'invalid_token';
}

export interface WebhookLog {
  id: string;
  receivedAt: string;
  event: string;
  gateway: string;
  payload: string;
  status: 'verified' | 'unverified' | 'failed';
}


