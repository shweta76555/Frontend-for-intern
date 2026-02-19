# Role-Based Project Management System (Frontend)

A React (Vite) frontend application integrated with an ASP.NET Core Web API backend using JWT Authentication, API Versioning, and Role-Based Authorization (User/Admin).

---

## 🚀 Tech Stack

- React (Vite)
- Axios
- React Router DOM
- JWT Authentication
- Role-Based Routing
- Protected Routes
- LocalStorage Token Management
- API Versioning Support

---

## 🔐 Authentication Features

- User Registration
- User Login
- JWT Token securely stored in localStorage
- Role extracted from JWT payload
- Automatic redirect after login:
  - Admin → /admin-dashboard
  - User → /dashboard
- Protected routes using token validation
- Automatic logout on token expiry

---

## 👤 User Features (User Dashboard)

- View Profile Information
- Create Project
- View Own Projects (My Items)
- Edit Project
- Delete Own Project
- Logout functionality

---

## 🛠 Admin Features (Admin Dashboard)

- View All Users
- View All Projects
- Delete Any Project
- Role-based access validation
- Token Inspection Panel (Role & Expiry Display)

---

## 🔒 Security Implementation

- JWT Authorization Header (Bearer Token)
- Axios Interceptor to attach token automatically
- Role-Based Route Protection
- API Versioned Endpoints (/api/v1/...)
- Token decoding for role-based rendering

---

## 🌐 API Integration

Frontend consumes the following backend endpoints:

POST   /api/v1/auth/login  
POST   /api/v1/auth/register  
GET    /api/v1/user/profile  
GET    /api/v1/user          (Admin only)  
GET    /api/v1/projectitem/my-items  
POST   /api/v1/projectitem  
PUT    /api/v1/projectitem/{id}  
DELETE /api/v1/projectitem/{id}  

---

## 📁 Folder Structure

src/  
 ├── api/  
 │   └── axiosInstance.js  
 ├── pages/  
 │   ├── Login.jsx  
 │   ├── Register.jsx  
 │   ├── Dashboard.jsx  
 │   └── AdminDashboard.jsx  
 ├── components/  
 │   └── ProtectedRoute.jsx  
 ├── utils/  
 │   └── decodeToken.js  
 ├── App.jsx  
 └── main.jsx  

---

## ⚙️ Setup Instructions

1. Clone the repository  

2. Install dependencies:

npm install  

3. Start development server:

npm run dev  

Frontend runs on:  
http://localhost:5173  

Backend must be running on:  
http://localhost:5052  

---

## 🔄 Authentication Flow

1. User logs in via /api/v1/auth/login  
2. Backend validates credentials  
3. JWT token returned  
4. Token stored in localStorage  
5. Axios attaches token automatically to future requests  
6. Role extracted from token  
7. User redirected based on role  

---

## 🧠 Role-Based Access Logic

Role  | Access Level  
User  | Own Projects Only  
Admin | All Users + All Projects  

---

## 📌 Requirements

- Node.js (v18+ recommended)
- Backend API running locally
- SQL Server database configured
- Valid JWT Secret configured in backend

---

## 👩‍💻 Author

Shweta  
Full Stack Developer (Backend + Frontend Implementation)

---

This project demonstrates full-stack implementation including secure authentication, role-based authorization, service-layer architecture, and versioned RESTful APIs.
