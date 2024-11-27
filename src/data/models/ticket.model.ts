import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ticketSchema = new mongoose.Schema({
    ticketNumber: {
      type: String,
      required: true,
      unique: true
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    category: {
      type: String,
      enum: ['MAINTENANCE', 'IT_SUPPORT', 'SECURITY', 'SUPPLIES', 'OTHER'],
      required: true
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM'
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'],
      default: 'PENDING'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
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
    attachments: [{
      filename: String,
      url: String,
      uploadedAt: Date
    }],
    timeline: [{
      status: String,
      comment: String,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    resolutionTime: Number, // en minutos
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    closedAt: Date
  });
  
  ticketSchema.index({ location: '2dsphere' });
  ticketSchema.index({ ticketNumber: 1 });
  
  // Middleware para generar número de ticket
  ticketSchema.pre('save', async function(next) {
    if (this.isNew) {
      const count = await mongoose.model('Ticket').countDocuments();
      this.ticketNumber = `TK-${String(count + 1).padStart(6, '0')}`;
    }
    this.updatedAt = new Date();
    next();
  });
  
  export const TicketModel = mongoose.model('Ticket', ticketSchema);