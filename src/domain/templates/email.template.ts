import { envs } from "../../config/envs.plugin";

export function generateInfectionEmailTemplate(genre: string, age: number, lat: number, lng: number): string {
    const mapboxUrl = generateMapboxStaticImageURL(lat, lng)
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Detalles del Incidente - Viruela del Mono</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f7e9e9;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 30px auto;
                background-color: #fff8f0;
                border-radius: 15px;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
                overflow: hidden;
                border: 3px solid #ff6b6b;
            }
            .header {
                background-color: #ff6b6b;
                color: #ffffff;
                padding: 30px;
                text-align: center;
                position: relative;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1.5px;
            }
            .header::after {
                content: url('https://example.com/monkeypox-icon.png'); /* Icono temático */
                position: absolute;
                top: 10px;
                right: 10px;
                width: 40px;
                height: 40px;
            }
            .content {
                padding: 25px;
                font-size: 16px;
                line-height: 1.6;
            }
            .content p {
                margin: 12px 0;
            }
            .content strong {
                color: #ff4e50;
            }
            .map-container {
                text-align: center;
                margin-top: 20px;
            }
            .map-img {
                width: 90%;
                height: auto;
                border-radius: 15px;
                border: 2px solid #ff4e50;
            }
            .footer {
                background-color: #ffe4e4;
                color: #555;
                padding: 15px;
                text-align: center;
                font-size: 12px;
            }
            .highlight {
                background-color: #ffdddd;
                padding: 5px;
                border-radius: 5px;
            }
            .alert-banner {
                background-color: #ff6b6b;
                color: white;
                font-size: 14px;
                padding: 10px;
                text-align: center;
                font-weight: bold;
                text-transform: uppercase;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>¡Alerta de Viruela del Mono!</h1>
            </div>
            <div class="alert-banner">
                Casos recientes detectados en tu área
            </div>
            <div class="content">
                <p><strong>Género del afectado:</strong> <span class="highlight">${genre}</span></p>
                <p><strong>Edad del afectado:</strong> <span class="highlight">${age} años</span></p>
                <p><strong>Ubicación aproximada:</strong> Latitud ${lat}, Longitud ${lng}</p>
                <div class="map-container">
                    <img class="map-img" src="${mapboxUrl}" alt="Ubicación del incidente"/>
                </div>
            </div>
            <div class="footer">
                <p>Este correo ha sido generado automáticamente para mantenerte informado. No respondas a este mensaje.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export const generateMapboxStaticImageURL = (lat: number, lng: number) => {
    const accessToken = envs.MAPBOX_ACCESS_TOKEN;
    const zoom = 13;
    const width = 800;
    const height = 500;

    return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l-embassy+f74e4e(${lng},${lat})/${lng},${lat},${zoom}/${width}x${height}?access_token=${accessToken}`;
}