import cron from 'node-cron';
import { TicketModel } from '../../data/models/ticket/model';
import { EmailService } from '../services/email.service';
import { generateTicketEmailTemplate } from '../templates/email.template';

const emailService = new EmailService();

export const ticketEmailJob = () => {
  TicketModel.watch().on('change', async (change) => {
    if (change.operationType === 'insert') {
      try {
        const ticket = await TicketModel.findById(change.fullDocument._id)
          .populate('branch', 'name manager')
          .populate('createdBy', 'name email')
          // Agregamos población del manager de la sucursal
          .populate({
            path: 'branch',
            populate: {
              path: 'manager',
              select: 'email'
            }
          });

        if (!ticket) return;

        //@ts-ignore
        const [longitude, latitude] = ticket.location.coordinates;
        
        const htmlBody = generateTicketEmailTemplate(
          ticket.ticketNumber,
          ticket.title,
          ticket.description,
          ticket.category,
          ticket.priority,
          latitude,
          longitude,
          //@ts-ignore
          ticket.branch.name
        );

        // Lista de destinatarios
        const recipients = [
          "donyale132@gmail.com",
          "braulioalejandronavarretehorta@gmail.com",
          //@ts-ignore
          ticket.branch.manager?.email // Email del gerente de la sucursal
        ].filter(email => email); // Filtramos los valores nulos o undefined

        // Enviar a todos los destinatarios
        await emailService.sendEmail({
          to: recipients.join(', '), // Unimos los emails con comas
          //@ts-ignore
          subject: `Nuevo Ticket ${ticket.ticketNumber} - ${ticket.branch.name}`,
          htmlBody: htmlBody,
        });

        console.log(`Email enviado para el ticket ${ticket.ticketNumber} a ${recipients.length} destinatarios`);
      } catch (error) {
        console.error('Error al procesar el nuevo ticket:', error);
      }
    }
  });
};