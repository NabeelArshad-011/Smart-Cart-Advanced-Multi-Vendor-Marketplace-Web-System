# 🛒 Smart-Cart: Advanced Multi-Vendor Marketplace Web System

A full-stack multi-vendor e-commerce platform that enables small businesses to sell products online through a single, unified marketplace — built with the **MERN Stack**.

> **Final Year Project** — Department of Computer Science, University of Agriculture Faisalabad  
> **Student:** Nabeel Arshad (2022-AG-7699)  
> **Supervisor:** Dr. M. Milhan Afzal Khan  
> **Course:** CS-610 Final Year Project 4(0-4)

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [User Roles](#user-roles)
- [Functional Requirements](#functional-requirements)
- [Getting Started](#getting-started)
- [Hardware & Software Requirements](#hardware--software-requirements)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)
- [References](#references)

---

## 📖 About the Project

Many small businesses want to sell products online but cannot afford to build their own websites or lack the technical knowledge to do so. **Smart-Cart** solves this problem by providing a centralized, affordable, and user-friendly multi-vendor marketplace where:

- **Vendors** can open their own online stores and manage products independently.
- **Customers** can browse, search, compare, and purchase products securely.
- **Admins** can monitor and manage the entire platform from a single dashboard.

The project was developed using the **RAD (Rapid Application Development)** model, which supports iterative development and fast feedback-based improvements.

---

## ✨ Features

### 👤 Customer
- Register and log in securely
- Browse and search products by keyword, category, or price range
- Add, update, and remove items from the shopping cart
- Secure checkout with shipping address and online payment
- Apply discount coupons and save multiple delivery addresses
- Track order status in real time
- Communicate with vendors via inbox

### 🏪 Vendor
- Register as a vendor and create an online store
- Add, edit, and delete products (with images, price, quantity, description)
- View and process incoming orders
- Monitor sales reports and revenue analytics
- Manage store profile and account settings

### 🛡️ Admin
- Manage all users, vendors, and products from a central dashboard
- Approve or block vendor accounts
- Monitor all platform transactions
- View system-wide analytics and reports
- Handle refunds and complaints

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT (JSON Web Tokens) |
| **Development Tools** | Visual Studio Code, Postman, GitHub |
| **Process Model** | RAD (Rapid Application Development) |

---

## 🏗️ System Architecture

Smart-Cart follows a **3-Tier Architecture**:

```
┌─────────────────────────────┐
│   Presentation Layer        │  ← React.js (Frontend)
├─────────────────────────────┤
│   Application Layer         │  ← Node.js + Express.js (Backend API)
├─────────────────────────────┤
│   Data Storage Layer        │  ← MongoDB (Database)
└─────────────────────────────┘
```

This separation ensures **modularity**, **ease of maintenance**, and the ability to **scale** individual components independently.

---

## 👥 User Roles

| Role | Description |
|---|---|
| **Customer** | Browses and purchases products |
| **Vendor** | Manages their own store and products |
| **Admin** | Oversees the entire platform |

---

## ✅ Functional Requirements

| ID | Requirement |
|---|---|
| FR01 | User Authentication (Login & Logout) |
| FR02 | User Registration (Customer & Vendor) |
| FR03 | Vendor Store & Product Management |
| FR04 | Product Browsing, Search & Filtering |
| FR05 | Shopping Cart Management |
| FR06 | Order Placement & Secure Payment Processing |
| FR07 | Admin Management Panel |
| FR08 | Notifications & Vendor-Customer Communication |

**Non-Functional Requirements:**
- **Availability:** System available 24/7 except scheduled maintenance
- **Performance:** Responds within 2–3 seconds under normal load
- **Scalability:** Supports growing numbers of users, vendors, and products without degradation

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or above)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smart-cart.git
   cd smart-cart
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Run the application**

   Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

   Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 💻 Hardware & Software Requirements

### Hardware

| Component | Minimum | Recommended |
|---|---|---|
| Processor | Intel Core i3 | Intel Core i5 / i7 |
| RAM | 4 GB | 8 GB or more |
| Internet | Stable broadband | High-speed broadband |
| Screen Resolution | 1366 × 768 | 1920 × 1080 or higher |

### Software

| Requirement | Details |
|---|---|
| Browser | Chrome, Firefox, Edge, Safari (latest versions) |
| OS | Windows, macOS, or Linux |
| Runtime | Node.js v16+ |
| Database | MongoDB (local or cloud) |

---

## 🧪 Testing

A total of **7 functional test cases** were designed and executed covering all critical system modules:

| Test Case | Module | Status |
|---|---|---|
| TC-1 | User Login Functionality | ✅ Pass |
| TC-2 | User Registration Functionality | ✅ Pass |
| TC-3 | Vendor Product Management | ✅ Pass |
| TC-4 | Product Search & Filtering | ✅ Pass |
| TC-5 | Shopping Cart Management | ✅ Pass |
| TC-6 | Order Placement & Payment Processing | ✅ Pass |
| TC-7 | Admin Management Panel | ✅ Pass |

All test cases passed successfully. No major defects or critical bugs were identified. JWT-based authentication, payment processing, and edge case handling (e.g., out-of-stock items, invalid inputs) all performed as expected.

---

## 🔮 Future Enhancements

- 🤖 **AI-based product recommendations** for personalized shopping
- 📱 **Dedicated mobile application** (iOS & Android)
- 🚚 **Real-time delivery tracking** integration
- 💳 **Local payment gateway** support (e.g., JazzCash, Easypaisa)
- 📊 **Advanced analytics dashboards** for vendors and admins

---

## 📚 References

- Pressman, R. S. (2019). *Software Engineering: A Practitioner's Approach* (9th ed.). McGraw-Hill Education.
- Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson Education.
- [React Documentation](https://react.dev)
- [Node.js Documentation](https://nodejs.org)
- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://www.mongodb.com)
- [JWT Documentation](https://jwt.io)
- [Visual Studio Code Documentation](https://code.visualstudio.com)
- [GitHub Documentation](https://github.com)
- [Postman Learning Center](https://www.postman.com)

---

## 📄 License

This project was developed as an academic Final Year Project at the **University of Agriculture Faisalabad**. All rights reserved © 2026 Nabeel Arshad.

---

<p align="center">Made with ❤️ by Nabeel Arshad — University of Agriculture Faisalabad</p>
