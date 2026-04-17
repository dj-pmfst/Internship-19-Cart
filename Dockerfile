FROM node:20

WORKDIR /app

# 
COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY admin/package.json ./admin/
COPY backend/prisma ./backend/prisma

RUN npm install
RUN cd backend && npm install

COPY . .

RUN cd backend && npx prisma generate
RUN cd backend && npm run build

CMD ["node", "backend/dist/main.js"]