#test
FROM node:20.19-slim

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY admin/package.json ./admin/

RUN npm install

COPY . .

RUN cd backend && npm install && npx prisma generate
RUN cd backend && npm run build

CMD ["sh", "-c", "cd backend && npx prisma migrate deploy && node dist/main.js"]