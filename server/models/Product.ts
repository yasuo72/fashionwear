import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVariant {
  size: string;
  color: string;
  stock: number;
  sku?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  categoryId: mongoose.Types.ObjectId;
  images: string[];
  variants: IProductVariant[];
  brand?: string;
  rating: number;
  reviewCount: number;
  tags?: string[];
  isActive: boolean;
  isFeatured: boolean;
  isOnSale?: boolean;
  isTrending?: boolean;
  isBestSelling?: boolean;
}

const ProductVariantSchema = new Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String },
});

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    images: {
      type: [String],
      required: true,
      validate: [arrayMinLength, 'At least one image is required'],
    },
    variants: {
      type: [ProductVariantSchema],
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: {
      type: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isBestSelling: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

function arrayMinLength(val: any[]) {
  return val.length > 0;
}

ProductSchema.index({ name: 'text', description: 'text', brand: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);
