import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  type: 'rw' | 'rt' | 'kelurahan' | 'fasilitas' | 'wisata' | 'lainnya';
  description?: string;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  imageUrl?: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['rw', 'rt', 'kelurahan', 'fasilitas', 'wisata', 'lainnya'],
      default: 'lainnya',
    },
    description: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: -180,
      max: 180,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk geospatial queries
LocationSchema.index({ location: '2dsphere' });

export default mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);
