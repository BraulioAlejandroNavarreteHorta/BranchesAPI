# Sistema de Gestión de Sucursales y Tickets

API REST para la gestión de sucursales y tickets de servicio, con capacidades de geolocalización y notificaciones por email. Desarrollada con Node.js, Express y MongoDB.

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/) (si decides ejecutar en local sin Docker)

## Instalación

### Clonar el repositorio

```bash
git clone [URL_DE_TU_REPOSITORIO]
cd [NOMBRE_DEL_DIRECTORIO]
```

### Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
PORT=3000
MONGO_URL=mongodb://root:example@localhost:27017/
MAIL_SECRET_KEY=dwhsgoyuflsgkkxu
MAIL_SERVICE=gmail
MAIL_USER=donyale132@gmail.com
MAPBOX_ACCESS_TOKEN=tu_mapbox_token
JWT_SECRET=123456
```

### Instalación de dependencias

```bash
npm install
```

## Ejecución

### Desarrollo local

```bash
npm run dev
```

### Producción con Docker Compose

```bash
docker-compose up -d
```

## Estructura del Proyecto

```
src/
├── config/
│   └── envs.plugin.ts
├── data/
│   ├── models/
│   │   ├── user/
│   │   ├── branch/
│   │   └── ticket/
│   └── init.ts
├── domain/
│   ├── services/
│   └── templates/
└── presentation/
    ├── controllers/
    ├── middlewares/
    └── routes/
```

## Endpoints API

### Autenticación

```http
POST /api/users/login
{
    "email": "admin@system.com",
    "password": "Admin123!"
}
```

### Sucursales

```http
# Obtener todas las sucursales
GET /api/branches

# Crear sucursal
POST /api/branches
{
    "name": "Sucursal Centro",
    "code": "SUC-001",
    "location": {
        "type": "Point",
        "coordinates": [-99.1332, 19.4326]
    },
    "manager": "id_del_manager"
}

# Obtener sucursales cercanas
GET /api/branches/nearby?longitude=-99.1332&latitude=19.4326&maxDistance=5000
```

### Tickets

```http
# Crear ticket
POST /api/tickets
{
    "title": "Falla en equipo",
    "description": "No enciende computadora",
    "branch": "id_de_sucursal",
    "category": "IT_SUPPORT",
    "priority": "HIGH",
    "createdBy": "id_del_usuario",
    "location": {
        "type": "Point",
        "coordinates": [-99.1332, 19.4326]
    }
}

# Obtener tickets
GET /api/tickets

# Actualizar ticket
PUT /api/tickets/{id}
{
    "status": "IN_PROGRESS",
    "comment": "Trabajando en solución"
}
```

## Funcionalidades Principales

- Autenticación de usuarios con JWT
- Gestión de sucursales con geolocalización
- Sistema de tickets con prioridades y categorías
- Notificaciones por correo automáticas
- Búsqueda de sucursales y tickets por ubicación

## Docker

### Construir imagen

```bash
docker build -t braulionavarrete/branches_api .
```

### Desplegar con Docker Compose

```bash
docker-compose up -d
```

El sistema estará disponible en `http://localhost:3000`

## Notificaciones por Email

El sistema envía notificaciones automáticas por correo cuando:
- Se crea un nuevo ticket
- Se actualiza el estado de un ticket
- Se asigna un ticket a un técnico

Los correos incluyen:
- Detalles del ticket
- Mapa de ubicación
- Estado actual
- Información de la sucursal

## Mantenimiento

### Logs

```bash
docker-compose logs -f
```

### Detener servicios

```bash
docker-compose down
```

## Seguridad

- Autenticación mediante JWT
- Middlewares de autorización por roles
- Validación de datos en endpoints
- Sanitización de entradas
- Encriptación de contraseñas

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request