import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  slug: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  tags: string[];
  uploadedBy: mongoose.Types.ObjectId;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    thumbnailUrl: {
      type: String,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['desa', 'kegiatan', 'infrastruktur', 'alam', 'lainnya'],
      default: 'desa',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
