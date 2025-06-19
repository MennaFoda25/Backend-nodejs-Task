# 🧾 Receipt Management Backend API (SQL Version)

A secure and scalable backend API built with **Node.js**, **Express.js**, and **PostgreSQL** to manage branches, cashiers, products, and receipts.

---

## ✅ Features

- 🚀 Branch, Cashier, Product, and Receipt management
- 🔐 Authentication with JWT (admin & cashier roles)
- 📦 Relational database (PostgreSQL) with foreign key constraints
- 📊 Receipt analytics (e.g., top 3 cashiers, branch sales)
- 🧼 Clean RESTful APIs with error handling and security
- 🛡️ Middleware for route protection and role-based access

---

## 🧱 Technologies Used

| Stack        | Tool/Library             |
|--------------|--------------------------|
| Runtime      | Node.js                  |
| Framework    | Express.js               |
| Database     | PostgreSQL               |
| Auth         | JWT, bcryptjs            |
| Queries      | `pg` (PostgreSQL client) |
| Security     | Helmet, dotenv           |
| Tools        | Postman for testing      |

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/receipt-sql-backend.git
cd receipt-sql-backend
