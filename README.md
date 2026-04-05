# Cart - Shopping Application

Homework 19 - full-stack shopping app 
---

### Tech Stack
- **Frontend** — React 19, Vite, React Router, CSS Modules
- **Admin** — React 19, Vite, TypeScript, React Router
- **Backend** — NestJS, Prisma, PostgreSQL
- **Auth** — JW

---

## Project Structure

```
cart/
├── frontend/        # Mobile-first user app
├── admin/           # Desktop admin dashboard
├── backend/         # NestJS REST API
├── turbo.json       # Turborepo task config
└── package.json     # Root workspace config
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker Desktop (for PostgreSQL)
- npm 9+

### 1. Install dependencies

From the root of the monorepo:

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the `backend/` directory:


### 3. Start the database

```bash
cd backend
docker compose up -d
```

### 4. Run migrations and seed

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

### 5. Start all apps

From the root:

```bash
npm run dev
```

This starts all three apps in parallel via Turborepo:
- **Frontend** → http://localhost:5173
- **Admin** → http://localhost:5174
- **Backend** → http://localhost:3000
- **Swagger** → http://localhost:3000/api

---

### Auth
- `POST /auth/register` — Register new user
- `POST /auth/login` — Login, returns JWT

### Users
- `GET /users/me` (User) — Get current user profile
- `PUT /users/me` (User) — Update address and payment method

### Products
- `GET /products` — List products (search, category, sort, inStock, page, limit)
- `GET /products/:id` — Get single product
- `POST /products` (Admin) — Create product
- `PATCH /products/:id` (Admin) — Update product
- `DELETE /products/:id` (Admin) — Delete product
- `POST /products/upload` (Admin) — Upload product image

### Categories
- `GET /categories` — List all categories
- `POST /categories` (Admin) — Create category
- `DELETE /categories/:id` (Admin) — Delete category *(fails if has products)*

### Orders
- `POST /orders` (User) — Create new order
- `GET /orders/my` (User) — Get current user's orders
- `GET /orders` (Admin) — Get all orders
- `PATCH /orders/:id/status` *(Admin)* — Update order status

### Favorites
- `GET /favorites` (User) — Get user's favorites
- `POST /favorites/:productId` (User) — Add to favorites
- `DELETE /favorites/:productId` (User) — Remove from favorites

---

## Frontend Features

- **Home** — product grid with category filter tabs and infinite scroll
- **Search** — search by name with category chips and color filter drawer
- **Product detail** — image per color variant, size selector, add to cart, favourite toggle
- **Favourites** — saved products with remove
- **Cart** — item list with quantity controls, delivery info, total
- **Checkout** — shipping and billing address with pre-fill from profile
- **Profile** — user info, payment details, logout

---

## Admin Features

Accessible at `/login` — requires an account with `isAdmin: true` in the database.

- **Products** — full CRUD table with search and category filter, image URL support
- **Categories** — create and delete (with product count warning)
- **Orders** — table with status filter, expandable order detail, inline status update

---

## Creating an Admin User

After seeding the database, set a user's `isAdmin` flag directly in the database:

via Prisma Studio:

```bash
cd backend
npx prisma studio
```

---

## Order Statuses

```
PENDING → CONFIRMED → SHIPPED → DELIVERED
```
