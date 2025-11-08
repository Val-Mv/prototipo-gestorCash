# Usa Node.js versión ligera
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Compila TypeScript (si falla, ignora el error en build)
RUN npm run build || true

# Expone el puerto del servidor
EXPOSE 8000

# Modo desarrollo por defecto
CMD ["npm", "run", "dev"]
# Para modo producción, cambia a:
# CMD ["npm", "run", "start"]

