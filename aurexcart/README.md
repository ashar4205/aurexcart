# AurexCart — Multi-Vendor E-Commerce Platform

> **A PROJECT BY [AUREX-LABS](https://aurexlabs.netlify.app/)**

AurexCart is a fully-featured, production-ready multi-vendor marketplace built with React, Node.js, Express, and MongoDB. Supports digital products, arts, illustrations, used electronics, and more.

---

## Tech Stack

| Layer | Technology | Free Hosting |
|-------|-----------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion | Vercel / Netlify (Free) |
| Backend | Node.js + Express | Render (Free Tier) |
| Database | MongoDB Atlas | Atlas Free M0 (512MB) |
| Auth | Firebase Auth (Google OAuth) | Firebase Spark Plan (Free) |
| Media | Base64 / Cloudinary | Cloudinary Free (25 credits) |
| 3D | Three.js + @react-three/fiber | Bundled |

**All free forever. No credit card required.**

---

## Admin Credentials

```
Username: ashar.aurex
Password: ashar.aurex.00.4205
```

Login at: `/login` (use "Admin Login" or backend admin endpoint)

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd aurexcart

# Install all dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Fill in your MongoDB URI and other values
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Fill in Firebase config (optional for Google login)
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:5000/api

### 4. Seed Database (Optional)

```bash
cd backend && npm run seed
```

---

## Production Deployment (100% Free)

### Step 1: MongoDB Atlas (Database)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a **Free M0** cluster (no credit card)
3. Create a database user
4. Whitelist `0.0.0.0/0` for Render compatibility
5. Copy your connection string

### Step 2: Backend on Render
1. Go to [render.com](https://render.com) and sign up (free)
2. New Web Service → Connect GitHub repo
3. Set Root Directory to `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables from `backend/.env.example`
7. Deploy (free tier, spins down after inactivity — normal)

### Step 3: Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Import GitHub repo
3. Set Root Directory to `frontend`
4. Add environment variables from `frontend/.env.example`
5. Set `VITE_API_URL` to your Render backend URL
6. Deploy

### Step 4: Firebase (Google Login — Optional)
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create project → Add Web App
3. Enable Authentication → Google Sign-In
4. Copy config values to frontend `.env`

---

## Directory Structure

```
aurexcart/
├── backend/
│   ├── server.js              # Express app entry
│   ├── config/db.js           # MongoDB connection
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Product.model.js
│   │   ├── Vendor.model.js
│   │   ├── Order.model.js
│   │   ├── Review.model.js
│   │   └── Analytics.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── vendor.routes.js
│   │   ├── order.routes.js
│   │   ├── cart.routes.js
│   │   ├── review.routes.js
│   │   ├── admin.routes.js
│   │   ├── analytics.routes.js
│   │   └── upload.routes.js
│   ├── middleware/auth.middleware.js
│   ├── scripts/seed.js        # Initial data seeder
│   ├── .env.example
│   └── render.yaml
│
└── frontend/
    ├── src/
    │   ├── App.jsx             # Main app + routing
    │   ├── main.jsx
    │   ├── store.js            # Zustand state (auth, cart, UI)
    │   ├── index.css           # Global styles + Tailwind
    │   ├── lib/
    │   │   ├── api.js          # Axios client + currency utils
    │   │   └── firebase.js     # Firebase/Google auth
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx  # Top nav + slide drawer
    │   │   │   ├── Footer.jsx
    │   │   │   └── CartSidebar.jsx
    │   │   ├── product/
    │   │   │   ├── ProductCard.jsx  # Glass-break hover effect + neon track
    │   │   │   └── ShareModal.jsx   # Social share modal
    │   │   └── effects/
    │   │       └── LoadingScreen.jsx  # Glass-shatter loading
    │   └── pages/
    │       ├── Home.jsx
    │       ├── Products.jsx
    │       ├── ProductDetail.jsx  # 3D viewer + reviews
    │       ├── Booking.jsx        # Cart/order page
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── Dashboard.jsx      # User dashboard
    │       ├── AdminDashboard.jsx # Admin control center
    │       ├── VendorDashboard.jsx
    │       ├── CreateStore.jsx
    │       ├── VendorStore.jsx
    │       ├── Search.jsx
    │       ├── Vendors.jsx
    │       ├── AurexLabs.jsx
    │       ├── NotFound.jsx
    │       └── static/
    │           ├── FAQ.jsx
    │           ├── Terms.jsx
    │           ├── Privacy.jsx
    │           ├── Cookies.jsx
    │           ├── Refunds.jsx
    │           └── HowItWorks.jsx
    ├── public/
    │   ├── favicon.svg
    │   └── site.webmanifest
    ├── tailwind.config.js
    ├── vite.config.js
    └── vercel.json
```

---

## Key Features

| Feature | Details |
|---------|---------|
| Loading Screen | Glass-shatter animation on initial load |
| Product Cards | Glass-break hover: shards fall on hover, rejoin on mouse-leave |
| Neon Track | Infinite looping neon pulse animation below every card |
| Navigation | Slide-out from top (mobile) and left (desktop) |
| Cart | Animated sidebar with quantity controls and live totals |
| Share | Platform-specific share modals (Instagram, Facebook, TikTok, LinkedIn) with product previews |
| 3D Viewer | Three.js GLB/GLTF product model viewer with orbit controls |
| Multi-currency | 10 currencies with real-time conversion display |
| Themes | Dark, Light, Blue Gradient, Purple Gradient |
| Reviews | Star rating, written reviews, helpful votes, vendor responses |
| Admin Panel | Real-time stats: visitors, orders, revenue, share analytics by platform |
| Vendor Dashboard | Product management, order tracking, store customisation, analytics |
| SEO | Full meta tags, OG tags, structured data, sitemap-ready |

---

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/admin-login
POST   /api/auth/firebase-login
GET    /api/auth/me
PATCH  /api/auth/preferences

GET    /api/products
GET    /api/products/:slug
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
POST   /api/products/:id/share

GET    /api/vendors
GET    /api/vendors/:slug
POST   /api/vendors/create
PATCH  /api/vendors/my-store
GET    /api/vendors/my-store/dashboard

GET    /api/cart
POST   /api/cart/add
PATCH  /api/cart/update
DELETE /api/cart/remove/:productId

POST   /api/orders
GET    /api/orders/my-orders

GET    /api/reviews/product/:productId
POST   /api/reviews
PATCH  /api/reviews/:id/helpful

GET    /api/admin/overview      (admin only)
GET    /api/admin/users         (admin only)
GET    /api/admin/vendors       (admin only)
GET    /api/admin/products      (admin only)
GET    /api/admin/orders        (admin only)

POST   /api/analytics/track
GET    /api/analytics/platform-stats  (admin only)

POST   /api/upload/base64
POST   /api/upload/image
```

---

## License

MIT © Aurex Labs — [aurexlabs.netlify.app](https://aurexlabs.netlify.app/)
