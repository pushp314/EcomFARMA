# 🌾 FarmFresh: Farm-to-Table Marketplace

Connecting locally-sourced fresh produce directly from farmers to shoppers. Built with a premium analytical engine and a direct-line fulfillment system.

---

## 🚀 Quick Launch (Combined Start)

From the root project directory, run:
```bash
npm install && npm run start
```
*This command uses **concurrently** to boot up the Backend (API) on `:5001` and the Frontend (Vite) on `:5173` simultaneously.*

---

## 📦 Modular Setup

### 1. Backend (Logic & Database)
Manage the Prisma ORM, Razorpay Gateway, and Cloudinary image processing.

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### 2. Frontend (Marketplace UI)
The immersive shopping experience powered by React + Tailwind + Recharts.

```bash
cd frontend
npm install
npm run dev
```

---

## 🌱 Database Seeding (Crucial)

To populate the marketplace with a pre-configured catalog of organic vegetables, dairy, and fruits, run the following from the root:
```bash
npm run seed
```
*This will create test accounts for Admin, Farmers, and Customers.*

---

## 🔑 Demo Access Credentials

| Identity | Identity Email | Identity Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@farm.com` | `password123` |
| **Farmer (Ramesh)** | `farmer@farm.com` | `password123` |
| **Farmer (Anita)** | `anita@farm.com` | `password123` |
| **Test Customer** | `customer@farm.com` | `password123` |

---

## ✨ Key Platform Features

- **Direct Farmer Listing**: Specialized dashboard for farmers to upload products and manage inventory live.
- **Analytical Command Center**: Real-time revenue charts (Recharts) and merchant KPIs for Admin and Farmers.
- **Filtered Marketplace**: Dynamic search, category toggles, and price range sliders for an effortless shopping experience.
- **Razorpay Integration**: Secure, signature-verified payments with instant checkout modals.
- **Fulfillment Timeline**: Aesthetic delivery trackers and itemized receipt dashboards for all purchases.

---

## 🛠️ Stack Architecture

*   **UI**: React.js 18, Tailwind CSS v3, Framer Motion
*   **API**: Express, Node.js, Prisma ORM
*   **DB**: PostgreSQL (via Supabase/Local)
*   **Image CD**: Cloudinary
*   **Payments**: Razorpay Gateway v2

---

**Crafted with excellence for a better food future.**
