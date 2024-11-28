import { envs } from "../../config/envs.plugin";

export function generateTicketEmailTemplate(
  ticketNumber: string,
  title: string,
  description: string,
  category: string,
  priority: string,
  lat: number,
  lng: number,
  branchName: string
): string {
    const mapboxUrl = generateMapboxStaticImageURL(lat, lng);
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nuevo Ticket Creado - ${ticketNumber}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #2563eb;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
            }
            .ticket-info {
                margin-bottom: 20px;
            }
            .priority-tag {
                display: inline-block;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 14px;
                font-weight: bold;
                color: white;
                background-color: ${getPriorityColor(priority)};
            }
            .map-container {
                text-align: center;
                margin: 20px 0;
            }
            .map-img {
                width: 100%;
                max-width: 500px;
                border-radius: 8px;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 15px;
                text-align: center;
                font-size: 12px;
                border-radius: 0 0 10px 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Nuevo Ticket: ${ticketNumber}</h1>
                <p>Sucursal: ${branchName}</p>
            </div>
            <div class="content">
                <div class="ticket-info">
                    <h2>${title}</h2>
                    <p><strong>Descripción:</strong> ${description}</p>
                    <p><strong>Categoría:</strong> ${category}</p>
                    <p><strong>Prioridad:</strong> <span class="priority-tag">${priority}</span></p>
                </div>
                <div class="map-container">
                    <img class="map-img" src="${mapboxUrl}" alt="Ubicación del ticket"/>
                </div>
            </div>
            <div class="footer">
                <p>Este es un correo automático. Por favor, no responder.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

function getPriorityColor(priority: string): string {
    switch(priority.toUpperCase()) {
        case 'URGENT': return '#dc2626';
        case 'HIGH': return '#ea580c';
        case 'MEDIUM': return '#ca8a04';
        case 'LOW': return '#16a34a';
        default: return '#2563eb';
    }
}

function generateMapboxStaticImageURL(lat: number, lng: number) {
    const accessToken = envs.MAPBOX_ACCESS_TOKEN;
    const zoom = 15;
    const width = 600;
    const height = 300;

    return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l-triangle+f74e4e(${lng},${lat})/${lng},${lat},${zoom}/${width}x${height}?access_token=${accessToken}`;
}