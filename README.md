# 🎓 University Management System

A secure **full-stack University Management System** built to manage the daily operations of a university.

This project provides a complete backend API with **JWT Authentication**, **Role-Based Access Control (RBAC)**, **PostgreSQL**, and a modern frontend (coming soon) to manage students, teachers, registrars, departments, announcements, and more.

---

## 🚀 Tech Stack

### Backend

- 🟢 Node.js
- ⚡ Express.js
- 🐘 PostgreSQL
- 🔐 JWT Authentication
- 🔑 bcrypt Password Hashing
- 🌍 REST API
- 📦 dotenv
- 🧪 Thunder Client / Postman

### Frontend (Coming Soon)

- ⚛️ React
- ⚡ Vite
- 🎨 Tailwind CSS
- 🔄 React Query
- 📋 React Hook Form
- ✅ Zod
- 🌐 Axios

---

# ✨ Features

## 🔐 Authentication

- Login with JWT
- Password hashing using bcrypt
- Protected routes
- Role-based authorization
- Secure middleware

---

## 👨‍💼 Admin Management

- Create Admin
- Login
- Manage Registrars
- Manage Students
- Manage Teachers
- Manage Departments
- Publish Announcements

---

## 👨‍💻 Registrar Management

- Create Registrar
- Edit Registrar
- Delete Registrar
- View Registrars

---

## 🎓 Student Management

- Create Student
- Auto-generate university email
- Auto-generate Student Number
- Edit Student
- Delete Student
- View Students
- Assign Student to a Class

---

## 👨‍🏫 Teacher Management

- Create Teacher
- Auto-generate university email
- Assign Teacher to Department
- Edit Teacher
- Delete Teacher
- View Teachers

---

## 🏛 Department Management

- Create Departments
- Edit Departments
- Delete Departments
- View Departments

---

## 📢 Announcement System

- Create Announcement
- Edit Announcement
- Delete Announcement
- View All Announcements
- View Single Announcement
- Track Announcement Creator

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Role-Based Access Control (RBAC)
- SQL Injection Protection (Parameterized Queries)
- Environment Variables (.env)
- Input Validation
- Secure Password Storage

---

# 🗂 Database Design

Current entities include:

- 👤 Users
- 🎭 Roles
- 🎓 Student Profiles
- 👨‍🏫 Teacher Profiles
- 🏛 Departments
- 🏫 Classes
- 📢 Announcements

### Relationships

```
Department
     │
     ├───────────────┐
     │               │
  Teachers        Classes
                      │
                  Students
```

Users are the central entity.

Every Student, Teacher, Registrar, and Admin is first created as a User with a specific role.

---

# 📁 Project Structure

```
back-end/
│
├── controllers/
├── routes/
├── middlewares/
├── database/
├── .env.example
├── server.js
└── package.json
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/Elmahdi45/University_Management.git
```

```
cd University_Management/back-end
```

## Install dependencies

```bash
npm install
```

## Configure environment variables

Create a `.env` file.

Example:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=university

JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
```

## Run the server

```bash
npm run dev
```

or

```bash
node server.js
```

---

# 🔑 Authentication

After login you'll receive a JWT token.

Include it in every protected request:

```
Authorization: Bearer YOUR_TOKEN
```

---

# 📌 Current Progress

- ✅ Authentication
- ✅ Authorization
- ✅ Admin Management
- ✅ Registrar CRUD
- ✅ Student CRUD
- ✅ Teacher CRUD
- ✅ Department CRUD
- ✅ Announcement CRUD
- 🚧 Class Management
- 🚧 Course Management
- 🚧 Enrollment System
- 🚧 Grades
- 🚧 Attendance
- 🚧 Frontend

---

# 🛣 Roadmap

Planned improvements after the core application is completed:

- 🔄 Refresh Tokens
- 📖 Swagger Documentation
- 📁 File Uploads
- 📧 Email Notifications
- 📝 Logging
- ✅ Validation with Zod/Joi
- 🧪 Unit & Integration Testing
- 🐳 Docker
- 🚀 CI/CD
- ⚡ Redis Caching
- 🌐 Production Deployment

---

# 💡 What I Learned

Through this project I practiced:

- REST API Design
- Express.js Architecture
- PostgreSQL Relationships
- SQL Joins
- Dynamic SQL Queries
- Authentication & Authorization
- Role-Based Access Control
- Password Hashing
- Middleware
- Environment Variables
- Database Normalization
- Backend Project Organization
- CRUD Operations
- Error Handling

---

# 📬 Contact

**El Mehdi Khardi**

- 💼 LinkedIn: www.linkedin.com/in/elmahdi-khardi-429422286


- 💻 GitHub: https://github.com/Elmahdi45

---

## ⭐ If you like this project, consider giving it a star!
