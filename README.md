🛒 Smart-Cart: Advanced Multi-Vendor Marketplace Web System
A full-stack multi-vendor e-commerce platform that enables small businesses to sell products online through a single, unified marketplace — built with the MERN Stack.

Final Year Project — Department of Computer Science, University of Agriculture Faisalabad
Student: Nabeel Arshad (2022-AG-7699)
Supervisor: Dr. M. Milhan Afzal Khan
Course: CS-610 Final Year Project 4(0-4)


📌 Table of Contents

About the Project
Features
Tech Stack
System Architecture
User Roles
Functional Requirements
Getting Started
Hardware & Software Requirements
Testing
Future Enhancements
References


📖 About the Project
Many small businesses want to sell products online but cannot afford to build their own websites or lack the technical knowledge to do so. Smart-Cart solves this problem by providing a centralized, affordable, and user-friendly multi-vendor marketplace where:

Vendors can open their own online stores and manage products independently.
Customers can browse, search, compare, and purchase products securely.
Admins can monitor and manage the entire platform from a single dashboard.

The project was developed using the RAD (Rapid Application Development) model, which supports iterative development and fast feedback-based improvements.

✨ Features
👤 Customer

Register and log in securely
Browse and search products by keyword, category, or price range
Add, update, and remove items from the shopping cart
Secure checkout with shipping address and online payment
Apply discount coupons and save multiple delivery addresses
Track order status in real time
Communicate with vendors via inbox

🏪 Vendor

Register as a vendor and create an online store
Add, edit, and delete products (with images, price, quantity, description)
View and process incoming orders
Monitor sales reports and revenue analytics
Manage store profile and account settings

🛡️ Admin

Manage all users, vendors, and products from a central dashboard
Approve or block vendor accounts
Monitor all platform transactions
View system-wide analytics and reports
Handle refunds and complaints


🛠️ Tech Stack
LayerTechnologyFrontendReact.jsBackendNode.js, Express.jsDatabaseMongoDBAuthenticationJWT (JSON Web Tokens)Development ToolsVisual Studio Code, Postman, GitHubProcess ModelRAD (Rapid Application Development)

🏗️ System Architecture
Smart-Cart follows a 3-Tier Architecture:
┌─────────────────────────────┐
│   Presentation Layer        │  ← React.js (Frontend)
├─────────────────────────────┤
│   Application Layer         │  ← Node.js + Express.js (Backend API)
├─────────────────────────────┤
│   Data Storage Layer        │  ← MongoDB (Database)
└─────────────────────────────┘
This separation ensures modularity, ease of maintenance, and the ability to scale individual components independently.

👥 User Roles
RoleDescriptionCustomerBrowses and purchases productsVendorManages their own store and productsAdminOversees the entire platform

✅ Functional Requirements
IDRequirementFR01User Authentication (Login & Logout)FR02User Registration (Customer & Vendor)FR03Vendor Store & Product ManagementFR04Product Browsing, Search & FilteringFR05Shopping Cart ManagementFR06Order Placement & Secure Payment ProcessingFR07Admin Management PanelFR08Notifications & Vendor-Customer Communication
Non-Functional Requirements:

Availability: System available 24/7 except scheduled maintenance
Performance: Responds within 2–3 seconds under normal load
Scalability: Supports growing numbers of users, vendors, and products without degradation


🚀 Getting Started
Prerequisites
Make sure you have the following installed:

Node.js (v16 or above)
MongoDB (local or Atlas)
Git

Installation

Clone the repository

bash   git  https://github.com/your-username/smart-cart.git
   cd smart-cart

Install backend dependencies

bash   cd backend
   npm install

Install frontend dependencies

bash   cd ../frontend
   npm install

Configure environment variables
Create a .env file in the backend directory:

env   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key

Run the application
Start the backend:

bash   cd backend
   npm run dev
Start the frontend:
bash   cd frontend
   npm start

Open in browser

   http://localhost:3000

💻 Hardware & Software Requirements
Hardware
ComponentMinimumRecommendedProcessorIntel Core i3Intel Core i5 / i7RAM4 GB8 GB or moreInternetStable broadbandHigh-speed broadbandScreen Resolution1366 × 7681920 × 1080 or higher
Software
RequirementDetailsBrowserChrome, Firefox, Edge, Safari (latest versions)OSWindows, macOS, or LinuxRuntimeNode.js v16+DatabaseMongoDB (local or cloud)

🧪 Testing
A total of 7 functional test cases were designed and executed covering all critical system modules:
Test CaseModuleStatusTC-1User Login Functionality✅ PassTC-2User Registration Functionality✅ PassTC-3Vendor Product Management✅ PassTC-4Product Search & Filtering✅ PassTC-5Shopping Cart Management✅ PassTC-6Order Placement & Payment Processing✅ PassTC-7Admin Management Panel✅ Pass
All test cases passed successfully. No major defects or critical bugs were identified. JWT-based authentication, payment processing, and edge case handling (e.g., out-of-stock items, invalid inputs) all performed as expected.

🔮 Future Enhancements

🤖 AI-based product recommendations for personalized shopping
📱 Dedicated mobile application (iOS & Android)
🚚 Real-time delivery tracking integration
💳 Local payment gateway support (e.g., JazzCash, Easypaisa)
📊 Advanced analytics dashboards for vendors and admins


📚 References

Pressman, R. S. (2019). Software Engineering: A Practitioner's Approach (9th ed.). McGraw-Hill Education.
Sommerville, I. (2016). Software Engineering (10th ed.). Pearson Education.
React Documentation
Node.js Documentation
Express.js Documentation
MongoDB Documentation
JWT Documentation
Visual Studio Code Documentation
GitHub Documentation
Postman Learning Center


📄 License
This project was developed as an academic Final Year Project at the University of Agriculture Faisalabad. All rights reserved © 2026 Nabeel Arshad.
