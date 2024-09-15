# Monomap API

Este proyecto consiste en la creación de una API REST escalable que permite registrar y gestionar los casos de la Viruela del Mono en México. La API está desarrollada en Node.js utilizando Express y MongoDB como base de datos.

## Requisitos Previos

Antes de ejecutar la aplicación, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (opcional para ejecutar en contenedor)
- [MongoDB](https://www.mongodb.com/) (si decides ejecutar en local sin Docker)

## Instalación

### Clonar el repositorio

Para empezar, clona el repositorio del proyecto en tu máquina local utilizando el siguiente comando:

```bash
git clone https://github.com/BraulioAlejandroNavarreteHorta/MonoMap.git

```

## Configurar el archivo de entorno
Crea un archivo .env en la raíz del proyecto con las siguientes variables de entorno:
```bash
PORT=3000
MONGO_URL=mongodb://localhost:27017/monomap
MAIL_SECRET_KEY=tu_clave_secreta
MAIL_SERVICE=gmail
MAIL_USER=tu_correo@gmail.com
MAPBOX_ACCESS_TOKEN=tu_mapbox_token
```

Reemplaza tu_clave_secreta, tu_correo@gmail.com y tu_mapbox_token con tus valores reales.

## Instalar las dependencias
Ejecuta el siguiente comando para instalar todas las dependencias del proyecto:
```bash
npm install
```

## Crear contenedor
Ejecuta el siguiente comando para crear el contenedor en docker

```bash
docker-compose up -d --build
```

## Iniciar el proyecto

Ejecuta el siguiente comando para correr el proyecto
```bash
npm run dev
```

## Ejecución con Docker
Asegúrate de tener Docker instalado.
Descargar la Imagen desde Docker Hub
Si no tienes el código fuente del proyecto, puedes ejecutar la imagen directamente desde Docker Hub. Descarga la imagen con el siguiente comando:

```bash
docker pull braulionavarrete/monomap_api:latest
```

### Paso 1: Levantar MongoDB en Docker
Primero, necesitas levantar un contenedor de MongoDB. Ejecuta el siguiente comando:
```bash
docker run -d \
  --name mongo_new \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=example \
  -p 27017:27017 \
  mongo:4.4
```

### Paso 2: Ejecutar la Imagen de la API
Luego, ejecuta la imagen de la API que descargaste de Docker Hub:
```bash
docker run -d \
  --name monomap_api \
  -p 3000:3000 \
  --env PORT=3000 \
  --env MONGO_URL=mongodb://root:example@mongo_new:27017/monomap \
  --env MAIL_SECRET_KEY=tu_clave_secreta \
  --env MAIL_SERVICE=gmail \
  --env MAIL_USER=tu_correo@gmail.com \
  --env MAPBOX_ACCESS_TOKEN=tu_mapbox_token \
  --link mongo_new:mongo_new \
  braulionavarrete/monomap_api:latest
```
Reemplaza tu_clave_secreta, tu_correo@gmail.com y tu_mapbox_token con tus valores reales.

## Acceder a la Aplicación
Con los contenedores en ejecución, accede a la API desde tu navegador o Postman en:

### Obtener todos los casos de viruela del mono:
[GET]
http://localhost:3000/api/infections

### Crear un caso de viruela del mono:
[POST]
http://localhost:3000/api/infections

body (raw):
```json
{
  "lat": 21.152514652376595,
  "lng": -101.71183931837416,
  "genre": "Masculino",
  "age": 19
}
```

### Actualizar un caso de viruela del mono:
[UPDATE]
http://localhost:3000/api/infections/:id

body (raw):
```json
{
  "lat": 38.1234,
  "lng": -123.4567,
  "genre": "Femenino",
  "age": 25
}
```

### Eliminar un caso de viruela del mono:
[DELETE]
http://localhost:3000/api/infections/:id


### Obtener algún caso por ID:
[GET]
http://localhost:3000/api/infections/:id


### Obtener los todos los casos de los últimos siete días:
[GET]
http://localhost:3000/api/infections/last-week


