import mongoose from "mongoose";
import { EmailService } from "../../../domain/services/email.service";
import { generateTicketEmailTemplate } from "../../../domain/templates/email.template";

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

// Índices
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

// Middleware para enviar email cuando se crea un nuevo ticket
ticketSchema.post('findOneAndUpdate', async function(doc) {
  if (!doc) return;

  try {
    const ticket = await doc.populate([
      {
        path: 'branch',
        populate: {
          path: 'manager',
          select: 'email'
        }
      },
      { path: 'createdBy', select: 'name email' },
      { path: 'assignedTo', select: 'name email' }
    ]);

    const [longitude, latitude] = ticket.location.coordinates;
    
    const emailService = new EmailService();
    const lastTimelineEntry = ticket.timeline[ticket.timeline.length - 1];

    const htmlBody = generateTicketEmailTemplate(
      ticket.ticketNumber,
      `Actualización de Ticket: ${ticket.title}`,
      `${lastTimelineEntry?.comment || `Estado actualizado a ${ticket.status}`}\n\nDescripción original: ${ticket.description}`,
      ticket.category,
      ticket.priority,
      latitude,
      longitude,
      ticket.branch.name
    );

    const recipients = [
      "donyale132@gmail.com",
      "braulioalejandronavarretehorta@gmail.com"
    ];

    // Agregar el email del gerente si existe
    if (ticket.branch?.manager?.email) {
      recipients.push(ticket.branch.manager.email);
    }

    // Agregar el email del creador si existe
    if (ticket.createdBy?.email && !recipients.includes(ticket.createdBy.email)) {
      recipients.push(ticket.createdBy.email);
    }

    // Agregar el email del asignado si existe
    if (ticket.assignedTo?.email && !recipients.includes(ticket.assignedTo.email)) {
      recipients.push(ticket.assignedTo.email);
    }

    await emailService.sendEmail({
      to: recipients.join(', '),
      subject: `Actualización de Ticket ${ticket.ticketNumber} - ${ticket.status}`,
      htmlBody: htmlBody
    });

    console.log(`📧 Email de actualización enviado para el ticket ${ticket.ticketNumber}`);
  } catch (error) {
    console.error('Error al enviar email de actualización para ticket:', error);
  }
});

export const TicketModel = mongoose.model('Ticket', ticketSchema);