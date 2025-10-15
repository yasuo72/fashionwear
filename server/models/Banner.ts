import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  text: string;
  type: 'badge' | 'announcement' | 'promo';
  location: 'hero' | 'navbar' | 'footer' | 'category';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    text: {
      type: String,
      required: true,
      maxlength: 255,
    },
    type: {
      type: String,
      enum: ['badge', 'announcement', 'promo'],
      default: 'badge',
    },
    location: {
      type: String,
      enum: ['hero', 'navbar', 'footer', 'category'],
      default: 'hero',
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

export default mongoose.model<IBanner>('Banner', BannerSchema);
