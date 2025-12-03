# 🦷 MERNPro Dental Clinic Management Web Application

A full-stack MERN application for managing patients, appointments, and clinic staff workflows.


## 📘 Project Overview

The MERNPro Dental Clinic Management System is a full-stack MERN application designed to help dental clinics manage their operations efficiently.

**This system allows staff to manage:**

- Patient records

- Appointments

- User authentication & profiles

- Light/Dark theme settings

- Dashboard insights

This repository includes both backend API (Node.js + Express + MongoDB) and React frontend integrated together.


## ⭐ Features


### 🔐 Authentication & Authorization

- User Registration

- User Login

- JWT-based authentication

- Protected routes (Dashboard, Profile, Appointments)

- Role-aware UI (future-ready)

### 👨‍⚕️ Patient Management

- Add new patients

- Edit patient info

- Delete patient

- View all patients in table

- Search patient by name / email / phone

- Pagination

### 📅 Appointment Management

- Full CRUD for appointments

- NEW: Linked appointments → patients using patientId

- Patient dropdown selector

- Status tracking (Scheduled / Completed / Cancelled)

### 👤 User Profile

- Update username

- Update email

- Navbar dynamically updates “Welcome, {username}”

### 🎨 UI/UX Enhancements

- Light/Dark mode toggle

- Toast notifications (success/error)

- Loading animations (4 seconds spinner + green checkmark)

- Animated route transitions

- Mobile responsive navbar

- Clinic logo integrated into navbar + favicon


## 🛠 Tech Stack

### Frontend

- React

- React Router

- Bootstrap 5

- Axios

- React Toastify

### Backend

- Node.js

- Express.js

- MongoDB Atlas

- Mongoose

- JWT Authentication

- bcryptjs

### Tools

- Postman

- VS Code

- GitHub

- Trello (Agile Project Board)

- Canva / Figma (Wireframes)

## ⚙️ Project Folder Structure

mernpro-dental-clinic/

- server.js

- config/

    - db.js

- controllers/

    - userController.js

    - patientController.js

    - appointmentController.js

- middleware/

    - authMiddleware.js

    - errorMiddleware.js

- models/

    - user.js

    - patient.js

    - appointmentModel.js

- routes/

    - userRoutes.js

    - patientRoutes.js

    - appointmentRoutes.js

- utils/

    - token.js

- client/

    - public/

    - src/

        - api/

        - components/

        - context/

        - pages/

        - App.js

        - index.js


## 🔐 Environment Variables

Create a .env file in the root directory:

- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_secret_key
- JWT_EXPIRES=7d
- PORT=4000

## 🧪 API Endpoints

### 👤 Users
| Method | Endpoint            | Description                   |
| ------ | ------------------- | ----------------------------- |
| POST   | /api/users/register | Register new user             |
| POST   | /api/users/login    | Login user                    |
| PUT    | /api/users/profile  | Update logged-in user profile |

### 👥 Patients
| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| GET    | /api/patients     | List all patients |
| POST   | /api/patients     | Create patient    |
| GET    | /api/patients/:id | Get patient       |
| PUT    | /api/patients/:id | Update patient    |
| DELETE | /api/patients/:id | Delete patient    |

### 📅 Appointments
| Method | Endpoint              | Description        |
| ------ | --------------------- | ------------------ |
| GET    | /api/appointments     | List appointments  |
| POST   | /api/appointments     | Create appointment |
| PUT    | /api/appointments/:id | Update appointment |
| DELETE | /api/appointments/:id | Delete appointment |

## Quick start

### 🟦 Backend Setup
```bash
cd mernpro-dental-clinic
npm install
npm run dev
```
Runs at → http://localhost:4000

### 🟩 Frontend Setup
```bash
cd client
npm install
npm start
```
Runs at → http://localhost:3000