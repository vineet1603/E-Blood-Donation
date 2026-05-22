# 🩸 E-Blood: Real-Time Blood Donation & Emergency Broadcast Network

E-Blood is a real-time full-stack web application developed to bridge the gap between blood donors and healthcare facilities during emergencies. Unlike traditional systems that rely on slow request-response cycles, E-Blood uses persistent WebSocket communication to instantly notify active donors whenever a hospital broadcasts an urgent blood requirement.

The platform is designed with a modern event-driven architecture, secure JWT-based authentication, and cloud-hosted infrastructure to ensure scalability, responsiveness, and reliability during critical medical situations.

---

# 🚀 Key Features

- ⚡ Real-time emergency blood request broadcasting using Socket.IO
- 🔐 Secure JWT-based authentication and authorization
- 🩸 Donor registration and live donor management system
- 🏥 Emergency request dashboard for hospitals/admins
- ☁️ MongoDB Atlas cloud database integration
- 📱 Fully responsive glassmorphism UI using Tailwind CSS
- 🛡️ Protected admin CRUD operations
- 🌐 Monolithic deployment architecture on Railway

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- JavaScript (ES6+)
- Tailwind CSS

## Backend
- Node.js
- Express.js

## Real-Time Communication
- Socket.IO

## Database
- MongoDB Atlas
- Mongoose ODM

## Authentication
- JSON Web Tokens (JWT)

## Deployment
- Railway

---

# 📁 Project Structure

```text
├── server.js
├── index.html
├── login.html
├── portal.html
├── package.json
└── donor_logs.txt
```

### File Descriptions

| File | Purpose |
|------|----------|
| `server.js` | Main backend server, API routes, Socket.IO configuration, MongoDB connection |
| `index.html` | Main landing page with donor registration |
| `login.html` | User authentication portal |
| `portal.html` | Admin dashboard for donor and emergency management |
| `package.json` | Dependency and project configuration |
| `donor_logs.txt` | Physical logs for donor registrations |

---

# 📡 API Endpoints

## Authentication Routes

### Register User
```http
POST /api/auth/signup
```

### Login User
```http
POST /api/auth/login
```

### Admin Login
```http
POST /api/admin/login
```

---

## Donor Routes

### Register Donor
```http
POST /api/register
```

### Get All Donors
```http
GET /api/donors
```

### Update Donor (Protected)
```http
PUT /api/donors/:id
```

### Delete Donor (Protected)
```http
DELETE /api/donors/:id
```

---

## Emergency Routes

### Create Emergency Broadcast (Protected)
```http
POST /api/emergencies
```

### Get Active Emergencies
```http
GET /api/emergencies
```

---

# 🔐 Authentication Flow

1. User logs in or signs up
2. Server generates a JWT token
3. Token is stored in browser `localStorage`
4. Protected routes verify the token using middleware
5. Authorized users gain access to admin operations

---

# ⚙️ Local Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/vineet1603/E-Blood-Donation.git
cd E-Blood-Donation
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Start Server

```bash
node server.js
```

---

## 4️⃣ Open Application

Visit:

```text
http://localhost:10000
```

---

# ☁️ Railway Deployment

This project is optimized for Railway deployment.

## Steps

1. Push project to GitHub
2. Connect GitHub repository to Railway
3. Set start command:

```bash
node server.js
```

4. Add environment variables if needed
5. Deploy project

Railway automatically handles:
- HTTPS
- Reverse proxy
- Port allocation
- Public domain generation

---

# 🧠 System Architecture

```text
Client Browser
      │
      ▼
Frontend (HTML + Tailwind + JS)
      │
      ▼
Express.js + Socket.IO Server
      │
      ▼
MongoDB Atlas Database
```

---

# 📌 Real-Time Communication Workflow

1. Admin creates emergency request
2. Backend stores request in MongoDB
3. Socket.IO instantly emits event
4. Connected clients receive live updates
5. Emergency appears without page refresh

---

# 🔥 Core Concepts Used

- Event-Driven Architecture
- Persistent WebSocket Connections
- REST APIs
- JWT Authentication
- CRUD Operations
- Cloud Database Management
- Responsive UI Design
- Real-Time Broadcasting

---

# 📷 Future Enhancements

- 📍 GPS-based donor tracking
- 📧 Email/SMS notifications
- 📱 Progressive Web App (PWA)
- 🧠 AI-based donor matching
- 🏥 Hospital verification system
- 📊 Analytics dashboard

---

# 👨‍💻 Author

**Vineet**

---

# 📄 License

This project is developed for educational and research purposes.
