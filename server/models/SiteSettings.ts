import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  // Store Info
  storeName: string;
  storeEmail: string;
  storePhone?: string;
  storeAddress?: string;
  
  // Shipping Settings
  freeDeliveryThreshold: number;
  standardShippingCost: number;
  expressShippingCost: number;
  
  // Sale Settings
  saleEnabled: boolean;
  salePercentage?: number;
  saleStartDate?: Date;
  saleEndDate?: Date;
  
  // Tax Settings
  taxEnabled: boolean;
  taxPercentage: number;
  
  // Social Media
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  
  // Maintenance
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema(
  {
    storeName: {
      type: String,
      default: 'FashionHub',
    },
    storeEmail: {
      type: String,
      default: 'contact@fashionhub.com',
    },
    storePhone: {
      type: String,
      default: '',
    },
    storeAddress: {
      type: String,
      default: '',
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 50,
    },
    standardShippingCost: {
      type: Number,
      default: 5,
    },
    expressShippingCost: {
      type: Number,
      default: 15,
    },
    saleEnabled: {
      type: Boolean,
      default: false,
    },
    salePercentage: {
      type: Number,
      default: 0,
    },
    saleStartDate: {
      type: Date,
    },
    saleEndDate: {
      type: Date,
    },
    taxEnabled: {
      type: Boolean,
      default: false,
    },
    taxPercentage: {
      type: Number,
      default: 0,
    },
    facebookUrl: {
      type: String,
      default: '',
    },
    instagramUrl: {
      type: String,
      default: '',
    },
    twitterUrl: {
      type: String,
      default: '',
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceMessage: {
      type: String,
      default: 'We are currently under maintenance. Please check back later.',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
