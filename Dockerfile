FROM node:20
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY admin/package.json ./admin/
COPY backend/prisma ./backend/prisma
RUN npm install
COPY . .
RUN npx prisma generate --schema=backend/prisma/schema.prisma
RUN npm run build
CMD node backend/dist/main.js