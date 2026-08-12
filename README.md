<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="55" alt="React"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" height="55" alt="Vite"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" height="55" alt="Tailwind CSS"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="55" alt="Node.js"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" height="55" alt="Express.js"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" height="55" alt="PostgreSQL"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="55" alt="JavaScript"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" height="55" alt="Git"/>
</p>

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=28&pause=1000&color=4F46E5&center=true&vCenter=true&width=900&lines=University+Management+System;Full-Stack+React+%2B+Node.js+Application;Role-Based+Academic+Management+Platform" alt="Typing SVG" />

</div>

<div align="center">

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5+-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3+-06B6D4?logo=tailwindcss&logoColor=white)

</div>

# 🎓 University Management System

A full-stack **University Management System** designed to simulate the management of a real academic institution.

The application provides separate interfaces and permissions for **Administrators, Registrars, Teachers, and Students**, allowing academic data and university operations to be managed through a centralized platform.

The project focuses on **real-world backend development**, including REST API design, relational database modeling, authentication, role-based authorization, business-rule validation, and complex SQL queries.

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [👥 User Roles](#-user-roles)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🗄️ Database](#️-database)
- [🔐 Authentication & Authorization](#-authentication--authorization)
- [📂 Project Structure](#-project-structure)
- [🚀 Installation](#-installation)
- [⚙️ Environment Variables](#️-environment-variables)
- [📡 API Overview](#-api-overview)
- [🧠 Business Rules](#-business-rules)
- [📊 Project Status](#-project-status)
- [🎯 Learning Objectives](#-learning-objectives)
- [🔮 Future Improvements](#-future-improvements)
- [📄 License](#-license)

---

# 🎯 Overview

The University Management System centralizes the management of academic information and university operations.

The system is built around four main roles:

- 👑 **Admin**
- 🏫 **Registrar**
- 👨‍🏫 **Teacher**
- 👨‍🎓 **Student**

Each role has different permissions and access to resources.

The backend exposes a REST API built with **Node.js and Express.js**, while the frontend is built with **React and Vite**.

PostgreSQL is used as the main relational database.

---

# ✨ Features

## 🔐 Authentication

- User registration
- User login
- JWT authentication
- Password hashing with Bcrypt
- Protected API routes
- Authentication middleware
- Role-based authorization middleware
- Protected frontend pages

---

## 👥 User Management

- User accounts
- Role management
- Student profiles
- Teacher profiles
- User profile retrieval
- Role-based account creation

---

## 🏢 Departments

Complete CRUD management:

- Create department
- View departments
- View department details
- Update department
- Delete department

---

## 🏫 Classes

Complete CRUD management:

- Create class
- View classes
- View class details
- Update class
- Delete class
- Associate students with classes

---

## 📚 Modules

Complete CRUD management:

- Create module
- View modules
- View module details
- Update module
- Delete module

Modules are associated with academic information such as semesters and coefficients.

---

## 🎓 Students

- Create student profiles
- View students
- View student details
- Update student information
- Delete students
- Assign students to classes
- View enrolled modules
- View attendance
- View grades
- View assigned teachers

---

## 👨‍🏫 Teachers

- Create teacher profiles
- View teachers
- View teacher details
- Update teacher information
- Delete teachers
- View assigned modules
- View assigned classes
- View assigned students

---

## 📑 Enrollments

Students can be enrolled in modules through the enrollment system.

Features include:

- Create enrollment
- View enrollments
- View individual enrollment
- Update enrollment
- Delete enrollment
- Validation of student existence
- Validation of module existence
- Duplicate enrollment prevention

---

## 📚 Teaching Assignments

Teaching assignments connect:

**Teacher → Module → Class**

Features include:

- Create teaching assignment
- View assignments
- View individual assignment
- Update assignment
- Delete assignment
- View teacher assignments
- View assigned students
- Prevent duplicate teaching assignments
- Validate teacher, module, and class relationships

---

## 📅 Attendance

The attendance system allows teachers to manage attendance for their assigned students.

Features include:

- Record attendance
- Update attendance
- Delete attendance
- View attendance records
- Teacher attendance management
- Student attendance access
- Role-based access control

---

## 📝 Grades

The grade management system allows teachers to manage grades for students they teach.

Features include:

- Record grades
- Update grades
- Delete grades
- View grades
- Teacher grade management
- Student grade access
- Role-based authorization

---

## 📂 Course Materials

Course materials allow teachers to provide academic resources to students.

Features include:

- Create course materials
- View course materials
- Update course materials
- Delete course materials
- Associate materials with modules
- Associate materials with teachers
- Teacher-specific material access
- Student access to materials related to their class
- Duplicate material prevention

---

# 👥 User Roles

## 👑 Admin

The Admin has full access to the system.

### Permissions

- Manage users
- Manage departments
- Manage classes
- Manage modules
- Manage students
- Manage teachers
- Manage enrollments
- Manage teaching assignments
- Manage attendance
- Manage grades
- Manage course materials

---

## 🏫 Registrar

The Registrar manages administrative academic operations.

### Permissions

- Register students
- Register teachers
- Manage enrollments
- View academic information
- Manage selected academic resources

---

## 👨‍🏫 Teacher

Teachers have access only to resources related to their assignments.

### Permissions

- View assigned classes
- View assigned modules
- View assigned students
- Record attendance
- Manage grades
- Manage course materials
- View teaching assignments

---

## 👨‍🎓 Student

Students can access their own academic information.

### Permissions

- View personal profile
- View enrolled modules
- View grades
- View attendance
- View assigned teachers
- View course materials

---

# 🛠️ Tech Stack

| Category | Technology |
|---|---|
| ⚛️ Frontend | React.js |
| ⚡ Build Tool | Vite |
| 🎨 Styling | Tailwind CSS |
| 🌐 HTTP Client | Axios |
| 🟢 Backend | Node.js |
| 🚂 Backend Framework | Express.js |
| 🗄️ Database | PostgreSQL |
| 📦 PostgreSQL Driver | pg |
| 🔐 Authentication | JWT |
| 🔒 Password Security | Bcrypt |
| 🔄 Data Fetching | TanStack Query |
| 📝 Forms | React Hook Form |
| ✅ Validation | Zod |
| 🧰 Development | Nodemon |
| 🔀 Version Control | Git / GitHub |

---

# 🏗️ Architecture

The application follows a client-server architecture.

```text
                    ┌──────────────────────┐
                    │      React.js        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ Axios / HTTP
                               ▼
                    ┌──────────────────────┐
                    │      Express.js      │
                    │       REST API       │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          Authentication      RBAC       Controllers
             JWT           Middleware    / Business Logic
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                    ┌──────────────────────┐
                    │      PostgreSQL      │
                    │   Relational DB      │
                    └──────────────────────┘
```

The backend is organized around routes, middleware, controllers, and database queries. Authentication and role authorization are applied before protected resources can be accessed.

---

# 🗄️ Database

PostgreSQL is used to model the academic relationships between users, profiles, departments, classes, modules, enrollments, teaching assignments, attendance, grades, and course materials.

## Main Relationships

| Relationship | Description |
|---|---|
| User → Student Profile | A student profile belongs to a user account. |
| User → Teacher Profile | A teacher profile belongs to a user account. |
| Department → Class | A department can contain multiple classes. |
| Class → Student | A class can contain multiple students. |
| Student → Module | Students are linked to modules through enrollments. |
| Teacher → Module → Class | Teaching assignments connect a teacher, module, and class. |
| Student → Attendance | Students have attendance records. |
| Student → Grade | Students have grades for their academic modules. |

The system uses foreign keys and validation rules to preserve relational integrity and prevent invalid or duplicate records.

---

# 🔐 Authentication & Authorization

The application uses **JSON Web Tokens (JWT)** for authenticated requests.

1. A user logs in with their credentials.
2. The server verifies the password using Bcrypt.
3. The server returns a JWT.
4. The frontend sends the token in protected requests.
5. Authentication middleware validates the token.
6. Authorization middleware verifies whether the user's role can access the resource.

Example protected route:

```js
router.post(
  "/",
  authentificationSecurity,
  authorize(["Admin", "Registrar"]),
  createTeachingAssignment
);
```

---

# 📂 Project Structure

```text
university-management-system/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── database/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🚀 Installation

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL
- Git

## 1. Clone the repository

```bash
git clone https://github.com/your-username/university-management-system.git
cd university-management-system
```

## 2. Install dependencies

Install the backend dependencies:

```bash
cd server
npm install
```

Install the frontend dependencies:

```bash
cd ../client
npm install
```

## 3. Configure environment variables

Create a `.env` file in the server directory and configure it as shown below.

## 4. Create the PostgreSQL database

Create the database and run the SQL schema / seed files used by the project.

## 5. Start the application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the server directory:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/university_management
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

Never commit your real `.env` file or secret values to GitHub.

---

# 📡 API Overview

| Resource | Example endpoints |
|---|---|
| Authentication | `POST /auth/register`, `POST /auth/login` |
| Departments | `GET /departments`, `POST /departments` |
| Classes | `GET /classes`, `POST /classes` |
| Modules | `GET /modules`, `POST /modules` |
| Students | `GET /students`, `POST /students` |
| Teachers | `GET /teachers`, `POST /teachers` |
| Enrollments | `GET /enrollments`, `POST /enrollments` |
| Teaching assignments | `GET /teachingAssignment`, `POST /teachingAssignment` |
| Attendance | `GET /attendance`, `POST /attendance` |
| Grades | `GET /grades`, `POST /grades` |
| Course materials | `GET /courseMaterial`, `POST /courseMaterial` |

Protected endpoints require a valid JWT token in the request headers:

```http
Authorization: Bearer <token>
```

---

# 🧠 Business Rules

The project includes business validation beyond basic CRUD operations.

- A student cannot be enrolled in the same module twice.
- A teaching assignment must reference valid teacher, module, and class records.
- Duplicate teaching assignments are prevented.
- Teachers can access only their own assigned classes, modules, and students.
- Teachers can record attendance and grades only for students they teach.
- Students can access only their own academic information.
- Course materials are restricted to the related teachers and students.
- Unauthorized roles cannot access protected resources.

---

# 📊 Project Status

The core academic management features are implemented, including authentication, role-based authorization, relational PostgreSQL data modeling, student and teacher management, enrollments, teaching assignments, attendance, grades, and course materials.

| Area | Status |
|---|---|
| Authentication & JWT | ✅ Implemented |
| Role-Based Access Control | ✅ Implemented |
| Departments, Classes & Modules | ✅ Implemented |
| Student & Teacher Profiles | ✅ Implemented |
| Enrollments | ✅ Implemented |
| Teaching Assignments | ✅ Implemented |
| Attendance | ✅ Implemented |
| Grades | ✅ Implemented |
| Course Materials | ✅ Implemented |
| UI improvements & documentation | 🔄 In progress |

---

# 🎯 Learning Objectives

This project was built to practice:

- Building REST APIs with Node.js and Express.js
- Designing relational databases with PostgreSQL
- Writing complex SQL queries and joins
- JWT authentication and Bcrypt password hashing
- Role-based authorization (RBAC)
- Protecting frontend routes and backend endpoints
- Managing data with React
- Creating reusable UI components with Tailwind CSS
- Applying real-world business rules and validation
- Structuring a full-stack application

---

# 🔮 Future Improvements

- Add screenshots and a live demo link
- Add API documentation with Swagger / OpenAPI
- Add automated tests
- Add pagination, filtering, and search
- Add email notifications
- Add dashboards and reporting
- Add file uploads for course materials
- Add Docker support and deployment configuration
- Add CI/CD workflows

---

# 📄 License

This project is intended for educational and portfolio purposes.

---

<div align="center">

Built with React, Node.js, Express, PostgreSQL, and a lot of learning. 🚀

</div>
