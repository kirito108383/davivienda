FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache postgresql-client

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY drizzle.config.ts ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 5000

# Comando de inicio
CMD ["npm", "start"]