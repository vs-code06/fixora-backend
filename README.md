# 🛠️ Fixora – Smart Local Handyman and Repair Service Finder

> **A modern web platform that connects users with verified local service providers for home repairs and maintenance.**  
> Built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**.

---

## 🌐 Live Demo

| Component | URL |
|------------|-----|
| 🖥️ **Frontend (React)** | [https://fixora-frontend-zeta.vercel.app/](https://fixora-frontend-zeta.vercel.app/) |
| ⚙️ **Backend (API)** | [https://fixora-backend-rqej.onrender.com/](https://fixora-backend-rqej.onrender.com/) |
| 🗄️ **Database (MongoDB Atlas)** | [https://cloud.mongodb.com/v2/690a2fb38c220f45881b8199#/clusters](https://cloud.mongodb.com/v2/690a2fb38c220f45881b8199#/clusters) |

---

## 🚀 Overview

Finding reliable electricians, plumbers, and repair professionals is often a challenge — especially in small towns or residential areas.  
Many people rely on **unverified contacts** or **word-of-mouth**, which leads to:

- ❌ Inconsistent service quality  
- 💸 Overcharging or hidden fees  
- ⚠️ Safety and reliability issues  

**Fixora** provides a **centralized digital platform** that ensures:  
✅ Verified professionals  
✅ Transparent pricing  
✅ Secure bookings and reviews  

---

## 🧩 Table of Contents

- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [API Overview](#-api-overview)
- [Data Flow](#-data-flow)
- [Local Setup Guide](#️-local-setup-guide)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🏗️ System Architecture

### **Architecture Overview**


### **Stack Overview**

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, React Router, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT (JSON Web Token) |
| **Hosting** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## ✨ Key Features

| Category | Description |
|-----------|--------------|
| 🧑‍💼 **Authentication & Authorization** | Secure JWT-based login/signup for users, providers, and admins |
| 🔍 **Service Listings & Search** | Browse electricians, plumbers, and cleaners by location and category |
| 🌟 **Verified Reviews & Ratings** | Only verified users can review after completing a job |
| 💰 **Transparent Pricing** | Estimated service costs before booking to prevent overcharging |
| 🧰 **Provider Dashboard** | Manage bookings, availability, and track earnings |
| 📊 **User Dashboard** | Manage bookings, view history, and download invoices |
| 💬 **Community Help Forum** | Ask repair-related questions and get expert or peer help |
| 🌐 **Cross-Platform Hosting** | Fully deployed and accessible on desktop & mobile browsers |

---

## 🧠 Tech Stack

### **Frontend**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0EA5E9?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

### **Database**
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

### **Authentication & APIs**
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

### **Deployment**
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-2F2F2F?style=for-the-badge&logo=render&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---



## 🔗 API Overview

### Auth Routes (`/api/auth`)
| Endpoint | Method | Description | Access |
|---|---:|---|---|
| `/api/auth/signup` | POST | Register a new user (user or provider) | Public |
| `/api/auth/login` | POST | Login and set httpOnly JWT cookie | Public |
| `/api/auth/me` | GET | Get currently authenticated user | Authenticated |
| `/api/auth/logout` | POST | Logout and clear auth cookie | Authenticated |

---

### Provider Routes (`/api/providers`)
| Endpoint | Method | Description | Access |
|---|---:|---|---|
| `/api/providers` | GET | List providers (filters: `q`, `category`, `city`, `page`, `pageSize`, `sort`) | Public |
| `/api/providers/:id` | GET | Get full provider profile (bio, phone, categories, location) | Public |

---

### Profile & Favorites (`/api/profile`)
| Endpoint | Method | Description | Access |
|---|---:|---|---|
| `/api/profile/me` | GET | Get my profile | Authenticated |
| `/api/profile/me` | PUT | Update my profile (avatar, phone, bio, location, categories) | Authenticated |
| `/api/profile/me` | DELETE | Delete my account | Authenticated |
| `/api/profile/request-provider` | POST | Request upgrade to provider role | Authenticated |
| `/api/profile/favorites` | GET | List my favorite providers | Authenticated |
| `/api/profile/favorites/:providerId` | POST | Add provider to favorites | Authenticated |
| `/api/profile/favorites/:providerId` | DELETE | Remove provider from favorites | Authenticated |
| `/api/profile/favorites/check/:providerId` | GET | Check favorite status for provider | Authenticated |

---

### Bookings (`/api/bookings`)
| Endpoint | Method | Description | Access |
|---|---:|---|---|
| `/api/bookings` | POST | Create a booking (body: `providerId`, `serviceTitle`, `scheduledAt`, `address`, ...) | Authenticated |
| `/api/bookings/me` | GET | Get bookings created by the logged-in user (pagination & search) | Authenticated |
| `/api/bookings/provider` | GET | Get bookings for the logged-in provider | Provider only |
| `/api/bookings/:bookingId` | GET | Get booking details by id | Authenticated (owner/provider/admin) |
| `/api/bookings/:bookingId/status` | PATCH | Update booking status (accept/reject/in_progress/completed/cancel) | Provider or User (cancel) |
| `/api/bookings/me/:masterId` | DELETE | Remove booking from user view (delete UserBooking) | Authenticated |
| `/api/bookings/provider/:masterId` | DELETE | Remove booking from provider view (delete ProviderBooking) | Provider only |

---

### Services (`/api/services`)
| Endpoint | Method | Description | Access |
|---|---:|---|---|
| `/api/services` | GET | Get list of available service categories | Public |

---

### Contact (`/api/contact`)
| Endpoint | Method | Description | Access |
|---|---:|---|---|
| `/api/contact` | POST | Submit contact/support message | Public |

---

### FAQs (`/api/faqs`)
| Endpoint | Method | Description | Access |
|---|---:|---|---|
| `/api/faqs` | GET | Get list of frequently asked questions | Public |

---

### Testimonials (`/api/testimonials`)
| Endpoint | Method | Description | Access |
|---|---:|---|---|
| `/api/testimonials/testimonials` | GET | Get user testimonials | Public |


---

## 🔄 Data Flow

The overall workflow of Fixora operates as follows:

1. 🧍 **User Interaction (Frontend UI):**  
   The user performs an action — such as browsing providers, updating their profile, creating a booking, or managing favorites — through the React.js interface.

2. 🌐 **API Request (Frontend → Backend):**  
   The frontend sends an Axios request to the Express backend.  
   If the user is authenticated, the browser **automatically includes the httpOnly JWT cookie** with the request.

3. 🧠 **Backend Logic & Validation (Express Server):**  
   The server receives the request and:  
   - Validates authentication using `requireAuth`  
   - Validates input data  
   - Applies business logic (booking rules, provider restrictions, availability checks)  
   - Routes the request to the correct controller

4. 🗄️ **Database Operations (MongoDB + Mongoose):**  
   The backend interacts with the MongoDB Atlas cluster using Mongoose models:  
   - Users  
   - Providers  
   - Bookings (Master, UserBooking, ProviderBooking)  
   - Favorites  
   - Services  
   - FAQs  
   - Testimonials  
   The server performs reads/writes, validates IDs, checks relationships, and ensures consistency.

5. 🔁 **Response Generation:**  
   After processing, the backend returns a structured JSON response containing the required data (profile info, providers list, booking status, favorites, etc.).  
   Any errors are returned with proper HTTP status codes.

6. 🖥️ **Frontend Rendering (State Update):**  
   React receives the response and updates the UI accordingly:  
   - Updated provider list  
   - Success message for booking  
   - Updated favorites  
   - Live booking status changes  
   - Profile update confirmation

7. ⭐ **Post-Booking Flow:**  
   When a provider completes a booking and enters the price:  
   - The booking status is updated to "completed"  
   - The user can then see the updated booking  
   - (Future-ready) The user may leave a verified rating/review to maintain quality and trust

This cycle continues smoothly for every interaction in the application.

---

## ⚙️ Local Setup Guide

Follow these steps to run **Fixora** locally 👇

---

### 1️⃣ Clone the Repository
```bash

# For Backend
git clone https://github.com/vs-code06/fixora-backend.git
npm install

# .env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
FRONTEND_ORIGIN=http://localhost:3000
NODE_ENV=development

# Run Backend
npm run dev


# For Frontend
git clone https://github.com/vs-code06/fixora-frontend.git
npm install

# .env
REACT_APP_API_URL=http://localhost:8080/api

# Run Frontend (in another terminal)
npm start
```


## 🚀 Future Enhancements

Here are several improvements planned for future versions of Fixora:

- 🧠 **AI-powered service recommendations**  
  Suggest the best provider using machine learning and user booking history.

- 💬 **Real-time chat between users and providers**  
  Allow live messaging for coordination and clarification.

- 🪪 **Provider verification system**  
  Upload ID, certificates, and proof of experience for admin approval.

- 📍 **Live location tracking**  
  Track provider arrival during active bookings.

- 📄 **Downloadable invoices & payment integration**  
  Add Razorpay/Stripe for secure payments and auto-generated bills.

- 🌐 **Multi-language support**  
  Make the platform accessible to a wider audience.

- 📱 **Mobile App (React Native)**  
  Build Android/iOS versions for greater convenience.

---

## 👨‍💻 Contributors

| Name | Role | GitHub |
|------|-------|--------|
| **Vipul Sharma** | Full-stack Developer, Designer | https://github.com/vs-code06 |

> If you'd like to contribute to Fixora, feel free to fork the repository and submit a pull request.

---

## 📜 License

This project is licensed under the **MIT License**, which permits personal and commercial use, modification, distribution, and private use.

You are free to:
- Use  
- Modify

As long as you include the original copyright notice.

