import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const branchSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    phone: String,
    email: String,
    isActive: {
      type: Boolean,
      default: true
    },
    operatingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  branchSchema.index({ location: '2dsphere' });
  export const BranchModel = mongoose.model('Branch', branchSchema);