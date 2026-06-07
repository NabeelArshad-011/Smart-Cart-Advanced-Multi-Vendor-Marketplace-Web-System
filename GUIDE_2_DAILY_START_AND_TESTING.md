# Project Testing Guide

## What This Guide Covers

This is the end-to-end testing guide for the full marketplace project:

- buyer signup, login, browsing, checkout, and order tracking
- seller signup, login, product management, orders, inbox, analytics, and withdrawals
- admin login, dashboard, moderation, complaints, and seller/user management
- assistant chatbot checks
- email activation checks

## First-Time Admin Setup

If there is no admin user in the database yet, create one before testing the admin panel.

1. Open a terminal in `Backend`.
2. Make sure `Backend/config/.env` contains a valid `DB_URL`.
3. Run the admin seed script:

```bash
npm run seed:admin
```

4. The script creates or updates an admin user with these defaults unless you override them in `.env`:

```text
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@local.test
ADMIN_PASSWORD=Admin@12345
```

5. If you want different admin credentials, set `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `Backend/config/.env` before running the seed.

## Normal Startup

When the environment is already installed, start the app with these two terminals:

```bash
cd Backend
npm run dev
```

```bash
cd frontend
npm start
```

## Test Flow

### 1. Start the backend and frontend

- Confirm the backend logs a successful MongoDB connection.
- Confirm the frontend opens in the browser.

### 2. Create a buyer account

- Open the signup page.
- Create a buyer account with a unique email.
- Confirm the activation email is received.
- Open the activation link and verify the account is created.
- Log in as the buyer.

### 3. Create a seller account

- Open the seller signup page.
- Create a seller account with a unique email.
- Confirm the seller activation email is received.
- Open the seller activation link and verify the seller account is created.
- Log in as the seller.

### 4. Test buyer shopping flow

- Browse products.
- Open a product detail page.
- Add a product to the cart.
- Complete checkout.
- Verify the order success page.
- Open the order tracking page from the buyer account.

### 5. Test seller dashboard flow

- Open the seller dashboard.
- Verify the dashboard summary cards load.
- Open analytics and confirm revenue, conversion rate, low-stock alerts, and top products render.
- Create a product.
- Confirm the product appears in the product list.
- Check orders and refunds pages.
- Open inbox and verify the messaging screen loads.
- Test withdraw request flow if balance exists.

### 6. Test admin panel flow

- Log in using the seeded admin credentials.
- Open the admin dashboard.
- Verify users, sellers, orders, products, events, withdraw requests, and complaints pages.
- Open the complaints page and resolve a complaint if one exists.
- Confirm seller and user management pages load without permission errors.

### 7. Test chatbot and support flow

- Open the floating assistant widget.
- Ask about order status.
- Ask for low-stock products.
- Ask how to file a dispute or complaint.
- Confirm the assistant returns either a Grok response or the local fallback response.

## What To Verify

- Backend connects to MongoDB
- Frontend loads without build errors
- Buyer login, seller login, and admin login work
- Product listing, product details, and cart flow render correctly
- Checkout, payment, and order success pages render correctly
- Seller dashboard loads orders, products, inbox, analytics, and withdraw pages
- Admin dashboard loads users, sellers, orders, products, events, withdraw requests, and complaints
- AI assistant responds with either Grok or local fallback responses
- Complaint resolution can be listed and updated by admin

## Testing Approach

### Fast checks

- Run the backend server and confirm startup logs
- Run the frontend build:

```bash
cd frontend
npm run build
```

### Functional checks

- Create a buyer order and confirm it appears in buyer and seller views
- Create a product and confirm seller analytics reflects stock and revenue changes
- Ask the assistant about products, orders, or complaint handling
- Create a complaint and resolve it from the admin dashboard

### Regression focus

- Order totals should match shop-level splits
- Seller balance should accumulate correctly after delivery
- Product delete should remove all uploaded images from Cloudinary
- User and seller activation should only create the account after activation succeeds
- Admin access should remain restricted to users with role `Admin`

## Environment Variables

Backend expects:

- `PORT`
- `DB_URL`
- `JWT_SECRET_KEY`
- `JWT_EXPIRES`
- `ACTIVATION_SECRET`
- `SMPT_SERVICE`
- `SMPT_HOST`
- `SMPT_PORT`
- `SMPT_PASSWORD`
- `SMPT_MAIL`
- `STRIPE_API_KEY`
- `STRIPE_SECRET_KEY`
- `CLOUDINARY_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `ADMIN_NAME` optional
- `ADMIN_EMAIL` optional
- `ADMIN_PASSWORD` optional
- `ADMIN_AVATAR_URL` optional
- `GROK_API_KEY` optional
- `GROK_MODEL` optional
