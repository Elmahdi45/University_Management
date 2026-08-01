# 🎓 University Management System

A modern **full-stack University Management System** built to simulate how real educational institutions manage students, teachers, departments, classes, modules, attendance, grades, and academic assignments.

This project focuses on **real-world backend architecture**, **role-based authorization**, **relational database design**, and a scalable REST API.

---

# 🚀 Tech Stack

## Frontend
- ⚛️ React.js
- ⚡ Vite
- 🎨 Tailwind CSS
- 🌐 Axios
- 📝 React Hook Form
- ✅ Zod
- 🔄 TanStack Query (React Query)

## Backend
- 🟢 Node.js
- 🚂 Express.js
- 🔐 JWT Authentication
- 🔒 Bcrypt
- 📦 PostgreSQL
- 🐘 pg

---

# 👥 User Roles

The system supports multiple user roles with different permissions.

### 👑 Admin
- Manage users
- Manage departments
- Manage classes
- Manage modules
- Manage teachers
- Manage students
- Manage enrollments
- Manage teaching assignments
- Manage attendance
- Manage grades
- Full system access

---

### 🏫 Registrar

- Register students
- Register teachers
- Manage enrollments
- View academic data

---

### 👨‍🏫 Teacher

- View assigned classes
- View assigned modules
- View assigned students
- Record attendance
- Submit grades
- View grades of assigned classes only

---

### 👨‍🎓 Student

- View personal profile
- View enrolled modules
- View attendance
- View grades
- View assigned teachers

---

# 📚 Features

## 🔐 Authentication

- JWT Authentication
- Password hashing with Bcrypt
- Protected Routes
- Role-Based Authorization
- Secure Login

---

## 👥 User Management

- Register Users
- Login
- User Profiles
- Role Assignment

---

## 🏢 Departments

- Create Department
- View Departments
- Update Department
- Delete Department

---

## 🏫 Classes

- Create Class
- View Classes
- Update Class
- Delete Class

---

## 📖 Modules

- Create Module
- View Modules
- Update Module
- Delete Module

---

## 🎓 Students

- Create Student Profile
- View Students
- Update Student
- Delete Student
- View Personal Information

---

## 👨‍🏫 Teachers

- Create Teacher Profile
- View Teachers
- Update Teacher
- Delete Teacher
- View Assigned Classes
- View Assigned Students

---

## 📑 Enrollments

- Enroll Students
- Update Enrollment
- Delete Enrollment
- View Student Enrollments

---

## 📚 Teaching Assignments

- Assign Teachers to Classes
- Assign Teachers to Modules
- View Assignments
- View Personal Teaching Assignments
- View Assigned Students

---

## 📅 Attendance

- Record Attendance
- Update Attendance
- Delete Attendance
- View Attendance
- Student Attendance Portal
- Teacher Attendance Management

---

## 📝 Grades

- Record Grades
- Update Grades
- Delete Grades
- View Grades
- Student Grade Portal
- Teacher Grade Management

---

# 🔐 Authorization

Every endpoint is protected according to the authenticated user's role.

Examples:

- Students cannot modify grades.
- Teachers can only manage students they teach.
- Admins have full system access.
- Users can only access their own personal information.

---

# 🗄️ Database

The project is built on a **fully relational PostgreSQL database**.

Main entities include:

- Users
- Roles
- Departments
- Classes
- Modules
- Student Profiles
- Teacher Profiles
- Enrollments
- Teaching Assignments
- Attendance
- Grades

The database enforces relationships using:

- Primary Keys
- Foreign Keys
- Cascading Rules
- Constraints
- Relational Integrity

---

# 🛡️ Security

- JWT Authentication
- Password Hashing
- Protected Routes
- Role-Based Authorization
- Input Validation
- Business Logic Validation

---

# 📂 Project Structure

```
backend/
│
├── controllers/
├── routes/
├── middlewares/
├── database/
├── config/
├── utils/
└── server.js

frontend/
│
├── components/
├── pages/
├── layouts/
├── hooks/
├── services/
├── context/
└── App.jsx
```

---

# 🎯 Learning Objectives

This project was built to practice real-world backend development concepts including:

- REST API Design
- Authentication & Authorization
- PostgreSQL Relationships
- Complex SQL JOINs
- Role-Based Access Control (RBAC)
- Business Rule Validation
- CRUD Operations
- Full-Stack Architecture

---

# 📌 Current Status

🚧 Active Development

Frontend and backend are being developed simultaneously with additional features and improvements planned.

---

# 📄 License

This project is built for educational and portfolio purposes.
