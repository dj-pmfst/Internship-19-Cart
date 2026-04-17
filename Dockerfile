FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY admin/package.json ./admin/
COPY backend/prisma ./backend/prisma

RUN npm install
RUN cd backend && npm install && npx prisma generate

COPY . .

RUN cd backend && npm run build

CMD ["sh", "-c", "cd backend && npx prisma migrate deploy && node dist/main.js"]