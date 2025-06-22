# ⚙️ My First Blog (Backend)

This backend server supports the full-stack blog application [frontend](https://github.com/Nantasit-2001/my-first-blog), handling API routes, authentication, database operations, and business logic.  
It is maintained in a separate Git repository for better modularity and easier maintenance.

---

## 📌 Overview

- Provides RESTful APIs for frontend consumption, including:
  - User authentication with JWT
  - Post management
  - Comments, likes, and notifications
  - Profile handling
- Uses **PostgreSQL** as the primary database. Development began locally and was later migrated to a cloud PostgreSQL instance hosted on **Render**.
- Backend is deployed on **Render's free tier**, offering scalable hosting and managed PostgreSQL services.
- Supports image uploads and management via **Cloudinary**.
- Includes essential middleware such as **CORS** for cross-origin requests, **JSON parsing**, and file uploads using **Multer** integrated with Cloudinary storage.

---

## 🔧 Technologies & Tools

- **Node.js & Express** — server framework for building RESTful APIs  
- **PostgreSQL (pg)** — relational database for data storage  
- **JWT (jsonwebtoken)** — secure token-based authentication  
- **bcryptjs** — password hashing for enhanced user security  
- **Cloudinary** — cloud-based image upload and management  
- **Multer & multer-storage-cloudinary** — handle multipart/form-data and upload files to Cloudinary  
- **cors** — Cross-Origin Resource Sharing middleware to enable frontend-backend communication  
- **nodemon** — development tool for automatic server restarts during development  

---

## 🛠️ Development & Deployment

- The database was initially developed locally and later deployed to Render's managed PostgreSQL service.  
- Backend code is deployed on Render's free tier with automatic restarts and environment variable management.  
- Make sure to configure environment variables correctly on Render, including:  
  - Database connection strings  
  - JWT secret keys  
  - Cloudinary API credentials  
- The backend exposes RESTful endpoints consumed by the [frontend](https://github.com/Nantasit-2001/my-first-blog).

---

## 🔗 Related Links

- Frontend repository: [https://github.com/Nantasit-2001/my-first-blog](https://github.com/Nantasit-2001/my-first-blog)  
- Live Demo (frontend): [https://my-first-blog-lac.vercel.app](https://my-first-blog-lac.vercel.app)  

---
