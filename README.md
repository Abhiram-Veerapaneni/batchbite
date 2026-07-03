# 🍽️ BatchBite

> **A university-focused batch food delivery platform that reduces delivery cost by intelligently grouping orders into delivery batches instead of delivering every order individually.**

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express-000000?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0C7BFF)
![Status](https://img.shields.io/badge/Status-Active%20Development-success)

---

# 🚀 Overview

BatchBite reimagines food delivery for university campuses.

Traditional food delivery platforms optimize **individual deliveries**. BatchBite optimizes **group deliveries**.

Students place orders within predefined delivery slots. Orders from nearby locations are grouped into batches, allowing a delivery partner to deliver multiple orders together, reducing delivery costs while improving operational efficiency.

Instead of:

```
One Order
        ↓
One Delivery
```

BatchBite follows:

```
Multiple Orders
        ↓
Delivery Slot
        ↓
Batch Creation
        ↓
Single Delivery Route
        ↓
Delivery Agent
```

This creates a scalable system that benefits both customers and restaurants.

---

# 🎯 Problem Statement

Food delivery around universities suffers from:

- High delivery charges
- Multiple agents travelling the same route
- Poor efficiency during peak hours
- Increased traffic and fuel consumption

BatchBite addresses these problems by encouraging students to order together instead of individually.

---

# 💡 Solution

Students choose a delivery slot while placing an order.

Example:

```
09:00 AM - 09:15 AM
09:15 AM - 09:30 AM
09:30 AM - 09:45 AM
```

Orders belonging to the same:

- Delivery Slot
- Region
- Delivery Window

are grouped into a single batch.

```
Users
   │
   ▼
Choose Slot
   │
   ▼
Orders Collected
   │
   ▼
Batch Creation
   │
   ▼
Route Planning
   │
   ▼
Delivery Agent
```

---

# ✨ Key Features

## 👤 User

- JWT Authentication
- Register / Login
- Browse Restaurants
- Browse Menus
- Food Details
- Search Restaurants & Food
- Persistent MongoDB Cart
- Quantity Management
- Single Restaurant Cart Rule
- Delivery Slot Selection
- Razorpay Payment Gateway
- Secure Payment Verification
- Automatic Order Creation After Payment
- Order History
- Live Order Status

---

## 🍴 Restaurant

- Restaurant Dashboard
- Menu Management
- Create Menu Items
- Update Menu Items
- Delete Menu Items
- Cloudinary Image Upload
- Availability Control

---

## 🚚 Delivery Agent

- Separate Authentication
- Assigned Deliveries
- Delivery Dashboard
- Delivery History
- Status Updates

---

## 🛠️ Admin

- Manage Restaurants
- Manage Menu Items
- Manage Delivery Slots
- Update Order Status
- Batch Management *(Upcoming)*

---

# 💳 Payment Architecture

Unlike many beginner projects, BatchBite follows a secure payment flow.

```
Cart
      │
      ▼
Create Razorpay Order
      │
      ▼
Payment
      │
      ▼
Signature Verification
      │
      ▼
Create Order
      │
      ▼
Batch Processing
```

### Payment Highlights

- Razorpay Integration
- Secure Signature Verification
- Order created **only after successful payment**
- Escrow-style payment flow
- Refund support before batch lock
- Delayed restaurant settlement

---

# 📦 Batch Delivery Concept

Traditional Delivery

```
Order

↓

Delivery Agent

↓

Customer
```

BatchBite

```
Orders

↓

Delivery Slot

↓

Region

↓

Batch

↓

Delivery Agent

↓

Customers
```

This significantly reduces delivery trips while improving efficiency.

---

# 🧠 Core Engineering Concepts

This project is designed to explore real-world backend architecture.

Implemented concepts include:

- REST APIs
- JWT Authentication
- Role-Based Authorization
- MongoDB Data Modeling
- Razorpay Payment Integration
- Secure Payment Verification
- Cloudinary Image Storage
- Multer File Uploads
- Persistent Shopping Cart
- Service-Oriented Backend Structure
- Middleware-based Authentication
- Error Handling
- Protected Routes

---

# ⚙️ Tech Stack

## Frontend

- React
- React Router
- Context API
- Axios
- React Hot Toast
- CSS

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Razorpay
- Multer
- Cloudinary

---

# 🏗️ Project Structure

```
BatchBite

├── client
│   ├── components
│   ├── pages
│   ├── context
│   ├── hooks
│   ├── services
│   └── css
│
└── server
    ├── config
    ├── controllers
    ├── middleware
    ├── models
    ├── routes
    ├── services
    ├── utils
    └── uploads
```

---

# 🔄 Current System Workflow

```
Register/Login
      │
      ▼
Browse Restaurants
      │
      ▼
Browse Menu
      │
      ▼
Add to Cart
      │
      ▼
Choose Delivery Slot
      │
      ▼
Secure Payment
      │
      ▼
Order Creation
      │
      ▼
Batch Processing
      │
      ▼
Restaurant Preparation
      │
      ▼
Delivery Agent
      │
      ▼
Delivered
```

---

# 🚧 Planned Enhancements

- Intelligent Batch Creation Algorithm
- Route Optimization
- Live Order Tracking
- Push Notifications
- Restaurant Settlement System
- Recommendation Engine
- Ratings & Reviews
- Coupons & Offers
- Analytics Dashboard
- WebSockets
- Redis Caching
- Queue-Based Processing
- Event-Driven Architecture
- System Scalability Improvements

---

# 🎓 Learning Objectives

BatchBite is more than a food delivery application.

It is being developed to gain hands-on experience with:

- Full Stack Development
- Payment Gateway Integration
- Backend System Design
- Marketplace Architecture
- Authentication & Authorization
- Scalable API Design
- Cloud Storage Integration
- Real-world Order Management
- Software Engineering Best Practices

---

# 🌟 Why BatchBite?

BatchBite is not another Swiggy or Zomato clone.

It explores how **batch-based logistics** can improve delivery efficiency for university campuses by combining **payments, batching, logistics, and scalable backend architecture** into a single platform.

The long-term vision is to build a **smart campus food delivery ecosystem** that is efficient, scalable, and cost-effective.

---

## 📄 License

This project is developed for learning, experimentation, and portfolio purposes.