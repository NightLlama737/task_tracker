# Použij jen Node image
FROM node:20-alpine

# Nastav pracovní adresář
WORKDIR /app

# Zkopíruj závislosti
COPY package*.json ./
RUN npm install

# Zkopíruj celý backend
COPY . .

# Expose port backendu
EXPOSE 4000

# Spuštění serveru
CMD ["node", "src/index.js"]
