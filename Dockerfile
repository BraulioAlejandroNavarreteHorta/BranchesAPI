# Base image
FROM node:latest

# Crear directorio de la app
WORKDIR /app

# Copiar todo el package.json
COPY package*.json ./

# Instalar los node modules
RUN npm i

# Copiar los demas archivos
COPY . ./

# Correo comando de build
RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/src/app.js" ]
