import { TicketModel } from '../../data/models/ticket/model';
import { EmailService } from '../services/email.service';
import { generateTicketEmailTemplate } from '../templates/email.template';

const emailService = new EmailService();

export const ticketEmailJob = () => {
    console.log('🚀 Iniciando servicio de emails para tickets...');

    // Configuración del change stream con resumeAfter
    const changeStream = TicketModel.watch([], {
        fullDocument: 'updateLookup'
    });

    // Manejador de eventos del change stream
    changeStream.on('change', async (change) => {
        console.log(`🎯 Evento detectado: ${change.operationType}`);
        console.log('Documento:', JSON.stringify(change, null, 2));

        let ticket;
        try {
            if (change.operationType === 'insert') {
                ticket = await TicketModel.findById(change.fullDocument._id)
                    .populate([
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

                if (!ticket) {
                    console.log('❌ Ticket no encontrado después de inserción');
                    return;
                }

                //@ts-ignore
                const coordinates = ticket.location?.coordinates || [0, 0];
                
                const htmlBody = generateTicketEmailTemplate(
                    ticket.ticketNumber,
                    ticket.title || 'Sin título',
                    ticket.description || 'Sin descripción',
                    ticket.category || 'Sin categoría',
                    ticket.priority || 'MEDIUM',
                    coordinates[1],
                    coordinates[0],
                    //@ts-ignore
                    ticket.branch?.name || 'Sin sucursal'
                );

                const recipients = [
                    "donyale132@gmail.com",
                    "braulioalejandronavarretehorta@gmail.com",
                    //@ts-ignore
                    ticket.branch?.manager?.email,
                    //@ts-ignore
                    ticket.createdBy?.email
                ].filter(Boolean);

                await emailService.sendEmail({
                    to: recipients.join(', '),
                    //@ts-ignore
                    subject: `Nuevo Ticket ${ticket.ticketNumber} - ${ticket.branch?.name || 'Sin Sucursal'}`,
                    htmlBody
                });

                console.log(`✅ Email enviado para nuevo ticket: ${ticket.ticketNumber}`);
            } 
            else if (change.operationType === 'update') {
                ticket = await TicketModel.findById(change.documentKey._id)
                    .populate([
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

                if (!ticket) {
                    console.log('❌ Ticket no encontrado para actualización');
                    return;
                }
//@ts-ignore
                const coordinates = ticket.location?.coordinates || [0, 0];
                const latestUpdate = ticket.timeline[ticket.timeline.length - 1];

                const htmlBody = generateTicketEmailTemplate(
                    ticket.ticketNumber,
                    ticket.title || 'Sin título',
                    latestUpdate?.comment || ticket.description || 'Sin descripción',
                    ticket.category || 'Sin categoría',
                    ticket.priority || 'MEDIUM',
                    coordinates[1],
                    coordinates[0],
                    //@ts-ignore
                    ticket.branch?.name || 'Sin sucursal'
                );

                const recipients = [
                    "donyale132@gmail.com",
                    "braulioalejandronavarretehorta@gmail.com",
                    //@ts-ignore
                    ticket.branch?.manager?.email,
                    //@ts-ignore
                    ticket.createdBy?.email,
                    //@ts-ignore
                    ticket.assignedTo?.email
                ].filter(Boolean);

                await emailService.sendEmail({
                    to: recipients.join(', '),
                    subject: `Actualización de Ticket ${ticket.ticketNumber} - ${ticket.status}`,
                    htmlBody
                });

                console.log(`✅ Email enviado para actualización de ticket: ${ticket.ticketNumber}`);
            }
        } catch (error) {
            console.error('❌ Error procesando evento:', error);
        }
    });

    // Manejo de errores del change stream
    changeStream.on('error', (error) => {
        console.error('❌ Error en el change stream:', error);
    });

    // Manejo de cierre del change stream
    changeStream.on('close', () => {
        console.log('⚠️ Change stream cerrado. Intentando reconectar...');
        // Aquí podrías implementar una lógica de reconexión si es necesario
    });

    console.log('✅ Servicio de emails iniciado correctamente');
};

// Asegurar que la conexión se mantenga viva
process.on('SIGINT', () => {
    console.log('⚠️ Cerrando servicio de emails...');
    process.exit(0);
});