import mongoose, { Document, Schema } from 'mongoose';

export interface IHomepageSlider extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HomepageSliderSchema = new Schema<IHomepageSlider>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    order: {
      type: Number,
      required: [true, 'Order is required'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk sorting
HomepageSliderSchema.index({ order: 1, isActive: 1 });

export default mongoose.models.HomepageSlider || mongoose.model<IHomepageSlider>('HomepageSlider', HomepageSliderSchema);
