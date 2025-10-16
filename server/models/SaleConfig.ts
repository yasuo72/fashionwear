import mongoose, { Schema, Document } from 'mongoose';

export interface ISaleCategory {
  title: string;
  description: string;
  discount: string;
  badge: string;
  gradient: string;
  icon: string;
  isActive: boolean;
}

export interface ISaleConfig extends Document {
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroBadgeText: string;
  heroGradient: string;
  
  // Flash Sale
  flashSaleEnabled: boolean;
  flashSaleTitle: string;
  flashSaleDescription: string;
  flashSaleCountdownHours: number;
  
  // Sale Categories
  saleCategories: ISaleCategory[];
  
  // Stats Section
  maxDiscount: string;
  flashSaleDuration: string;
  freeShippingThreshold: string;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SaleCategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  discount: {
    type: String,
    required: true,
  },
  badge: {
    type: String,
    required: true,
  },
  gradient: {
    type: String,
    default: 'from-blue-500 to-purple-600',
  },
  icon: {
    type: String,
    default: 'ShoppingBag',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const SaleConfigSchema: Schema = new Schema(
  {
    heroTitle: {
      type: String,
      default: 'MEGA SALE',
    },
    heroSubtitle: {
      type: String,
      default: 'Up to 70% OFF on Fashion Essentials',
    },
    heroBadgeText: {
      type: String,
      default: 'Limited Time Only',
    },
    heroGradient: {
      type: String,
      default: 'from-red-500 via-pink-500 to-orange-500',
    },
    flashSaleEnabled: {
      type: Boolean,
      default: true,
    },
    flashSaleTitle: {
      type: String,
      default: '⚡ Flash Sale',
    },
    flashSaleDescription: {
      type: String,
      default: 'Grab these deals before they\'re gone!',
    },
    flashSaleCountdownHours: {
      type: Number,
      default: 24,
    },
    saleCategories: {
      type: [SaleCategorySchema],
      default: [
        {
          title: 'Fashion Sale',
          description: 'Up to 60% off on clothing',
          discount: '60%',
          badge: '2000+ Items',
          gradient: 'from-blue-500 to-purple-600',
          icon: 'ShoppingBag',
          isActive: true,
        },
        {
          title: 'Clearance Sale',
          description: 'Up to 70% off selected items',
          discount: '70%',
          badge: 'Limited Stock',
          gradient: 'from-green-500 to-teal-600',
          icon: 'Percent',
          isActive: true,
        },
        {
          title: 'End of Season',
          description: 'Up to 50% off winter collection',
          discount: '50%',
          badge: 'Trending',
          gradient: 'from-orange-500 to-red-600',
          icon: 'TrendingDown',
          isActive: true,
        },
      ],
    },
    maxDiscount: {
      type: String,
      default: '70%',
    },
    flashSaleDuration: {
      type: String,
      default: '24h',
    },
    freeShippingThreshold: {
      type: String,
      default: '₹1000',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISaleConfig>('SaleConfig', SaleConfigSchema);
