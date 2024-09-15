# Base image
FROM node:latest

# Crear directorio de la app
WORKDIR /app

# Copiar todo el package.json
COPY package*.json ./

# Instalar las dependencias de producción
RUN npm install

# Copiar los demás archivos
COPY . ./

# Compilar la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/src/app.js"]
