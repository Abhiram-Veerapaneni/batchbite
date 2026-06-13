# BatchBite 🍽️

BatchBite is a food delivery platform that focuses on **batch-based delivery** instead of the traditional order-by-order delivery model.

The main idea is to group nearby orders from the same delivery slot into batches, reducing delivery cost and increasing efficiency.

---

# Why BatchBite?

Traditional food delivery apps such as Swiggy and Zomato usually assign one delivery agent to one order (or a small number of orders).

BatchBite introduces a different approach:

```
Users
    ↓
Choose Delivery Slot
    ↓
Orders inside the slot
    ↓
Grouping Algorithm
    ↓
Batch Creation
    ↓
Delivery Agent
```

Multiple orders in the same area and time slot can be delivered together.

Benefits:

* Reduced delivery cost
* Better route optimization
* Fewer delivery agents required
* Environment friendly
* More scalable during peak hours

---

# Features Implemented

## User Features

### Authentication

* Register
* Login
* Logout

### Restaurants

* Browse restaurants
* View restaurant menus
* Food cards with images
* Veg / Non-Veg indicators

### Search

* Search restaurants
* Search food items
* Debounced search

### Cart

* Persistent cart stored in MongoDB
* One active restaurant at a time
* Quantity increase/decrease
* Cart survives refresh and logout
* Explore more button
* Toast notifications

### Orders

* Place orders
* Slot selection
* Cash on Delivery
* UPI option (basic)
* Order history
* Order status

### UI

* Reusable FoodCard component
* Responsive design
* Empty states
* Loading states
* Toast notifications

---

# Current Architecture

```
User
│
├── Cart
│     └── Items
│
├── Orders
│
└── Authentication
```

Cart exists permanently for every user.

After registration:

```
User
    ↓
Cart (always exists)
    ↓
Items
```

This avoids creating and deleting carts repeatedly.

---

# Tech Stack

Frontend

* React
* React Router
* Context API
* Axios
* React Hot Toast
* CSS

Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

---

# Long-Term Vision

```
Users
    ↓
Delivery Slots
    ↓
Orders
    ↓
Grouping Algorithm
    ↓
Batch Creation
    ↓
Route Optimization
    ↓
Delivery Agents
```

The goal is to create a smarter and more efficient delivery system than traditional food delivery platforms.

---

# Future Features

* Search API
* Batch creation algorithm
* Route optimization
* Delivery agent assignment
* Live order tracking
* Notifications
* Ratings and reviews
* Favorites
* Coupons
* Admin analytics
* Payment gateway integration
* Recommendation system

---

# Project Structure

```
client/
server/

client
 ├── pages
 ├── components
 ├── context
 ├── css

server
 ├── controllers
 ├── models
 ├── routes
 ├── middleware
```

---

# Module Progress

| Module   | Description                     | Status            |
| -------- | ------------------------------- | ----------------- |
| Module 1 | Authentication and Setup        | ✅ Complete        |
| Module 2 | Restaurants, Menu, Cart, Orders | ✅ Mostly Complete |
| Module 3 | Search API and Food Details     | 🔄 In Progress    |
| Module 4 | Batch Creation Algorithm        | ⏳ Planned         |
| Module 5 | Route Optimization              | ⏳ Planned         |
| Module 6 | Delivery Agent System           | ⏳ Planned         |
| Module 7 | Notifications and Tracking      | ⏳ Planned         |
| Module 8 | Analytics and Recommendations   | ⏳ Planned         |

---

# Difference From Existing Apps

### Swiggy / Zomato

```
Order
    ↓
Delivery Agent
```

### BatchBite

```
Orders in Same Slot
        ↓
Grouping
        ↓
Batch
        ↓
Route Optimization
        ↓
Delivery Agent
```

BatchBite prioritizes efficiency through intelligent batching instead of individual deliveries.
