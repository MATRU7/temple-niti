# 🛕 Temple Niti Platform

![Live Demo](https://img.shields.io/badge/Live_Demo-temple--niti.vercel.app-gold?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)

A premium, full-stack platform built to list local temples, document vital Niti schedules, and help the community stay connected. The platform features an industry-standard modern UI, advanced real-time countdown logic, and an enterprise-hardened secure backend.

---

## 🚀 Live Demo
**[temple-niti.vercel.app](https://temple-niti.vercel.app)**

## 🛠️ Technology Stack
*   **Frontend:** React.js, Vite, Context API, React Router, Lucide Icons, Modern CSS (Glassmorphism, Animations)
*   **Backend:** Node.js, Express.js, MongoDB, Mongoose
*   **Security & Auth:** JSON Web Tokens (JWT), HTTP-Only Cookies, Bcrypt.js, Helmet, Express Rate Limit, Express Validator
*   **Infrastructure:** Vercel (Serverless Functions), RESTful API Design

---

## ✨ Key Features & Technical Highlights

### 🏛️ Serverless MERN Architecture
Architected and deployed a full-stack MERN application to a Vercel serverless environment. This guarantees high availability, infinite scalability, and zero-maintenance overhead by completely separating the local startup environments from the production exports.

### 🛡️ Enterprise-Grade API Security
The backend infrastructure is heavily fortified using modern security best practices:
*   **`helmet`**: Configured to secure HTTP headers and protect against cross-site scripting (XSS).
*   **`express-rate-limit`**: Prevents automated brute-force attacks on sensitive authentication endpoints.
*   **`express-mongo-sanitize`**: Defends the database against complex NoSQL injection vulnerabilities.

### 🔒 Secure Authentication Pipeline
Built a robust, state-of-the-art authentication system. Utilizing **JWT-based authentication**, the app relies on secure, `httpOnly` cookies to protect user sessions from XSS attacks. All passwords are automatically and securely hashed using **`bcryptjs`** via deeply integrated Mongoose lifecycle hooks.

### ✅ Strict Data Validation & Error Handling
Integrated **`express-validator`** to ensure strict data integrity on all incoming HTTP requests. Alongside this, engineered a centralized global error-handling middleware that catches failed validations, database conflicts, and missing parameters, guaranteeing clean, predictable, and standardized JSON API responses.

### ⏱️ Dynamic Real-Time UI Logic
Developed complex frontend algorithms utilizing React hooks (`useEffect`, `useState`) to calculate and display a **live, real-time countdown timer**. This feature tracks the exact hours, minutes, and seconds remaining until the next temple ritual (`Niti`), automatically syncing with the user's local timezone.

### 🎨 Modern Premium UI/UX
Designed a responsive, highly polished user interface tailored for a premium aesthetic. The frontend features glassmorphism, dynamic CSS variables, immersive imagery, and fluid micro-animations without relying on heavy or bloated UI frameworks.

---

## 💻 Running Locally

### 1. Clone the Repository
```bash
git clone https://github.com/MATRU7/temple-niti.git
cd temple-niti
```

### 2. Set Up the Backend
```bash
cd back
npm install
```
Create a `.env` file in the `back` directory:
```env
PORT=5000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```
Run the backend:
```bash
npm run dev
```

### 3. Set Up the Frontend
Open a new terminal window:
```bash
cd front
npm install
```
Create a `.env` file in the `front` directory:
```env
VITE_API_URL=http://localhost:5000
```
Run the frontend:
```bash
npm run dev
```

Your app will be running at `http://localhost:5173`.

---

> **Developer Note:** This project was developed with a heavy focus on backend security, database design, and handling complex state logic, serving as an excellent demonstration of scalable modern web architectures.
