import { Request, Response } from 'express';
import { TicketModel } from '../../../data/models/ticket/model';
import { EmailService } from '../../../domain/services/email.service';
import { generateTicketEmailTemplate } from '../../../domain/templates/email.template';

export class TicketController {
    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
        // Bind de los métodos para mantener el contexto
        this.createTicket = this.createTicket.bind(this);
        this.updateTicket = this.updateTicket.bind(this);
        this.sendTicketEmail = this.sendTicketEmail.bind(this);
    }

    private async sendTicketEmail(ticket: any, type: 'created' | 'updated'): Promise<void> {
        try {
            const coordinates = ticket.location?.coordinates || [0, 0];
            const latestUpdate = ticket.timeline[ticket.timeline.length - 1];

            const htmlBody = generateTicketEmailTemplate(
                ticket.ticketNumber,
                ticket.title || 'Sin título',
                type === 'created' ? ticket.description : (latestUpdate?.comment || ticket.description),
                ticket.category || 'Sin categoría',
                ticket.priority || 'MEDIUM',
                coordinates[1],
                coordinates[0],
                ticket.branch?.name || 'Sin sucursal'
            );

            const recipients = [
                "donyale132@gmail.com",
                "braulioalejandronavarretehorta@gmail.com",
                ticket.branch?.manager?.email,
                ticket.createdBy?.email,
                ...(type === 'updated' ? [ticket.assignedTo?.email] : [])
            ].filter(Boolean);

            const subject = type === 'created' 
                ? `Nuevo Ticket ${ticket.ticketNumber} - ${ticket.branch?.name || 'Sin Sucursal'}`
                : `Actualización de Ticket ${ticket.ticketNumber} - ${ticket.status}`;

            await this.emailService.sendEmail({
                to: recipients.join(', '),
                subject,
                htmlBody
            });

            console.log(`✅ Email enviado para ticket ${type}: ${ticket.ticketNumber}`);
        } catch (error) {
            console.error(`Error al enviar email para ticket ${type}:`, error);
            throw error;
        }
    }

    public async createTicket(req: Request, res: Response): Promise<Response> {
        try {
            const count = await TicketModel.countDocuments();
            const ticketNumber = `TK-${String(count + 1).padStart(6, '0')}`;
      
            const ticketData = {
                ...req.body,
                ticketNumber,
                timeline: [{
                    status: 'PENDING',
                    comment: 'Ticket creado',
                    updatedBy: req.body.createdBy,
                    timestamp: new Date()
                }]
            };
      
            const ticket = await TicketModel.create(ticketData);
            
            await ticket.populate([
                { 
                    path: 'branch', 
                    select: 'name code manager',
                    populate: {
                        path: 'manager',
                        select: 'email name'
                    }
                },
                { path: 'createdBy', select: 'name email' },
                { path: 'assignedTo', select: 'name email' }
            ]);

            // Enviar correo de creación
            await this.sendTicketEmail(ticket, 'created');
      
            return res.status(201).json(ticket);
        } catch (error) {
            console.error('Error completo:', error);
            return res.status(500).json({ 
                message: "Error al crear el ticket",
                //@ts-ignore
                error: error.message
            });
        }
    }

  public async getTickets(req: Request, res: Response) {
    try {
      const {
        branch, status, priority,
        startDate, endDate,
        assignedTo, createdBy
      } = req.query;

      const filter: any = {};

      if (branch) filter.branch = branch;
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (assignedTo) filter.assignedTo = assignedTo;
      if (createdBy) filter.createdBy = createdBy;

      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate as string);
        if (endDate) filter.createdAt.$lte = new Date(endDate as string);
      }

      const tickets = await TicketModel.find(filter)
        .populate('branch', 'name code')
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort('-createdAt');

      return res.json(tickets);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener tickets" });
    }
  }

  public async getTicketById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const ticket = await TicketModel.findById(id)
        .populate('branch', 'name code')
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .populate('timeline.updatedBy', 'name email');

      if (!ticket) {
        return res.status(404).json({ message: "Ticket no encontrado" });
      }

      return res.json(ticket);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener el ticket" });
    }
  }

    public async updateTicket(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { status, comment, updatedBy, ...updateData } = req.body;

            const currentTicket = await TicketModel.findById(id);
            if (!currentTicket) {
                return res.status(404).json({ message: "Ticket no encontrado" });
            }

            const updateObj: any = { ...updateData };

            if (status) {
                updateObj.status = status;
                
                const timelineEntry = {
                    status,
                    comment: comment || `Estado actualizado a ${status}`,
                    updatedBy,
                    timestamp: new Date()
                };

                if (status === 'CLOSED') {
                    updateObj.closedAt = new Date();
                    updateObj.resolutionTime = Math.floor(
                        (updateObj.closedAt.getTime() - currentTicket.createdAt.getTime()) / 60000
                    );
                }

                updateObj.$push = { timeline: timelineEntry };
            }

            const ticket = await TicketModel.findByIdAndUpdate(
                id,
                updateObj,
                {
                    new: true,
                    runValidators: true
                }
            ).populate([
                { 
                    path: 'branch', 
                    select: 'name code manager',
                    populate: { 
                        path: 'manager',
                        select: 'email name'
                    }
                },
                { path: 'createdBy', select: 'name email' },
                { path: 'assignedTo', select: 'name email' },
                { path: 'timeline.updatedBy', select: 'name email' }
            ]);

            // Enviar correo de actualización
            if (ticket) {
                await this.sendTicketEmail(ticket, 'updated');
            }

            return res.json(ticket);
        } catch (error) {
            console.error('Error al actualizar ticket:', error);
            return res.status(500).json({
                message: "Error al actualizar ticket",
                //@ts-ignore
                error: error.message
            });
        }
    }

  public async deleteTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticket = await TicketModel.findByIdAndUpdate(
        id,
        { status: 'CANCELLED' },
        { new: true }
      );

      if (!ticket) {
        return res.status(404).json({ message: "Ticket no encontrado" });
      }

      return res.json({ message: "Ticket cancelado correctamente" });
    } catch (error) {
      return res.status(500).json({ message: "Error al cancelar ticket" });
    }
  }

  public async getTicketsByLocation(req: Request, res: Response) {
    try {
      const { longitude, latitude, maxDistance = 5000 } = req.query;

      const tickets = await TicketModel.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)]
            },
            $maxDistance: Number(maxDistance)
          }
        }
      })
      .populate('branch', 'name code')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

      return res.json(tickets);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener tickets por ubicación" });
    }
  }
}
