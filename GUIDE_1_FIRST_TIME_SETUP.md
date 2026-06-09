# First-Time Setup

## Project Scope

This marketplace app includes:

- Buyer storefront, checkout, order tracking, and inbox
- Seller dashboard for products, orders, refunds, events, coupons, and analytics
- Admin dashboard for sellers, users, orders, products, events, withdraw requests, and complaints
- Marketplace assistant chatbot powered by Grok with a fallback mode
- Complaint and dispute resolution workflow

## Prerequisites

- Node.js 18 or newer
- MongoDB connection string
- Cloudinary credentials
- SMTP credentials for email activation
- Stripe test keys
- Optional: Grok API key for AI assistant

## Backend Setup

1. Open a terminal in `Backend`.
2. Install dependencies if needed:

```bash
npm install
```

3. Review `Backend/config/.env` and confirm the required values are set.
4. Start the backend:

```bash
npm run dev
```

The server listens on `PORT` from `.env`, or `8000` by default.

## Frontend Setup

1. Open a second terminal in `frontend`.
2. Install dependencies if needed:

```bash
npm install
```

3. Start the frontend:

```bash
npm start
```

## Initial Checks

- Open the storefront in the browser
- Register a buyer account and confirm email activation
- Create a seller account and confirm seller activation
- Verify login, product browsing, checkout, and dashboards









created in the database with the default credentials username: admin@local.test / password: Admin@12345