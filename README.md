# 🌾 Farmer Marketplace (Full MERN Stack)

A web platform where **farmers list produce directly** and **customers browse, search, and order** without middlemen. Farmers set their own prices, and customers can find fresh produce near them.

---

## 📁 Unified Folder Structure

```
farmer-marketplace/
├── package.json              # Root scripts to trigger server and client
├── README.md                 # Project guide & credentials
├── server/                   # Express, Mongoose, JWT & Multer Backend
│   ├── config/
│   │   └── db.js            # MongoDB connection with memory-server fallback
│   ├── models/              # User, Product, Order, Review schemas
│   ├── controllers/         # Auth, Product, Order, Admin, Review business logic
│   ├── routes/              # Express API route endpoints
│   ├── middleware/          # Auth JWT protect, role authorize, upload, error
│   ├── uploads/             # Produce image storage
│   ├── seed.js              # Database seeder with realistic farmers & produce
│   ├── .env                 # Server configuration environment variables
│   ├── package.json
│   └── server.js            # Main backend entry point
└── client/                   # React, Vite, Tailwind CSS & Recharts Frontend
    ├── src/
    │   ├── api/             # Axios instance with JWT interceptor
    │   ├── context/         # AuthContext & CartContext
    │   ├── components/      # Navbar, Footer, ProductCard, ProtectedRoute, etc.
    │   ├── pages/           # Home, ProductList, ProductDetail, Cart, Checkout,
    │   │                    # MyOrders, FarmerDashboard, FarmerProducts,
    │   │                    # FarmerAddEditProduct, FarmerOrders, AdminPanel
    │   ├── App.jsx          # Route definitions
    │   └── main.jsx         # Vite DOM entry
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Quick Start Guide

### 1. Seed & Start Backend Server (Port 5000)
```bash
cd server
npm run seed     # Populate database with demo farmers, products & orders
npm start        # Start backend API at http://localhost:5000
```

### 2. Start Frontend Client (Port 3000)
```bash
cd client
npm run dev      # Start React Vite dev server at http://localhost:3000
```

---

## 🔑 Demo Quick-Login Credentials

Use the Quick One-Click Fill buttons on the login screen or these credentials:

| Role | Email | Password | Details |
|---|---|---|---|
| **Farmer 1** | `farmer1@greenfields.com` | `password123` | Green Fields Organic Farm (Sacramento, CA) |
| **Farmer 2** | `farmer2@sunshinevalley.com` | `password123` | Sunshine Valley Produce (Willamette Valley, OR) |
| **Customer** | `customer@freshbuy.com` | `password123` | Alice Johnson (San Francisco, CA) |
| **Admin** | `admin@farm.com` | `password123` | Platform Administrator HQ |
