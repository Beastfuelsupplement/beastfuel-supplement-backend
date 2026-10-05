# BEASTFUEL Supplements Store — Backend API

> Node.js + Express + MongoDB REST API powering the BEASTFUEL Supplements store.

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express** | HTTP framework |
| **MongoDB** | Database |
| **Mongoose** | ODM / schema modeling |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Multer** | Image file uploads |

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) v6+ (local) **or** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud — free tier available)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/beastfuel-store
JWT_SECRET=your-random-secret-key-here
```

> **Atlas users:** replace `MONGODB_URI` with your connection string:
> `mongodb+srv://<user>:<pass>@cluster.mongodb.net/beastfuel-store`

### 3. Seed the database

```bash
node seed.js
```

Output:
```
✅ Admin user created (admin@beastfuel.com / admin123)
✅ Sample products created
🎉 Seeding complete!
```

### 4. Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js          # Users — bcrypt hashing, roles (user/admin)
│   ├── Product.js       # Products — name, price, category, stock
│   ├── Order.js         # Orders — items, status, auto order numbers
│   ├── Customer.js      # Customer records
│   └── Review.js        # Product reviews with ratings
├── routes/
│   ├── auth.js          # Signup, login, password, profile
│   ├── products.js      # CRUD products
│   ├── orders.js        # CRUD orders
│   ├── customers.js     # CRUD customers
│   ├── reviews.js       # CRUD reviews
│   └── upload.js        # Image uploads (Multer)
├── middleware/
│   └── auth.js          # JWT verification & admin guard
├── server.js            # App entry point
├── seed.js              # Database seeder
└── .env.example         # Environment template
```

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/auth/signup` | ✗ | Register new user |
| POST | `/auth/login` | ✗ | Login → returns JWT |
| GET | `/auth/me` | ✓ | Current user profile |
| PUT | `/auth/update-password` | ✓ | Change password |
| PUT | `/auth/update-profile` | ✓ | Update name/email |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| GET | `/products` | ✗ | List active products |
| GET | `/products/:id` | ✗ | Single product |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| GET | `/orders` | ✓ | User's orders |
| GET | `/orders/all` | Admin | All orders |
| POST | `/orders` | ✓ | Create order |
| PUT | `/orders/:id` | Admin | Update order |
| DELETE | `/orders/:id` | Admin | Delete order |

### Customers

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| GET | `/customers` | Admin | List customers |
| PUT | `/customers/:id` | Admin | Update customer |
| DELETE | `/customers/:id` | Admin | Delete customer |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| GET | `/reviews/product/:id` | ✗ | Product reviews |
| POST | `/reviews` | ✓ | Submit review |
| DELETE | `/reviews/:id` | ✓ | Delete own review |

### File Upload

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/upload` | Admin | Upload single image |
| POST | `/upload/multiple` | Admin | Upload multiple images |

---

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@beastfuel.com` | `admin123` |

> ⚠️ Change these before deploying to production.

---

## 🌐 Deployment

### MongoDB Atlas Setup
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Add a database user and whitelist your IP (or `0.0.0.0/0`)
3. Copy the connection string to `MONGODB_URI`

### Deploy Backend (Render)
1. Push to GitHub
2. Create a **Web Service** on [render.com](https://render.com)
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `npm start`
5. Add environment variables (`PORT`, `MONGODB_URI`, `JWT_SECRET`)

---

## 📄 License

MIT
