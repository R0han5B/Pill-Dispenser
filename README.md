# Pill Dispenser Management System 💊

A comprehensive **full-stack web application** designed to manage and monitor medication schedules digitally.  
The project simulates a smart pill dispenser system aimed at improving medication adherence, reducing missed doses, and minimizing human error in healthcare routines.

This system is suitable for real-world healthcare use cases such as elderly care, hospitals, and personal medication management.

---

## 📌 Problem Statement

Many patients forget to take medications on time, take incorrect doses, or fail to track their medication history properly.  
This project addresses these issues by providing a centralized digital system to manage pill schedules and medication data efficiently.

---

## 🚀 Key Features

- 📅 Create and manage medication schedules
- ⏰ Time-based pill reminders
- ➕ Add, update, and delete pill information
- 📊 Structured backend for reliable data handling
- 🔐 Environment-based configuration for security
- 🧩 Modular architecture for scalability
- 🌐 Ready for real-world hardware (IoT) integration

---

## 🧠 Project Type

**Full-Stack Application**

This project includes:
- A frontend for user interaction and visualization
- A backend server for business logic and API handling
- Database integration for persistent data storage

---

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript / TypeScript
- HTML5
- CSS3

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL  
  *(Supabase can be used as a hosted PostgreSQL backend)*

### Tools & Utilities
- Git & GitHub
- VS Code
- REST APIs
- Environment Variables (`.env`)

---

## 🏗️ System Architecture

```

User Interface (React)
↓
REST API Layer (Express.js)
↓
Database (PostgreSQL / Supabase)

```

The frontend communicates with the backend using RESTful APIs.  
The backend processes business logic and interacts with the database for CRUD operations.

---

## 📂 Project Structure

```

pill-dispenser/
│
├── frontend/                 # Client-side application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/                  # Server-side logic
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   └── server.js
│
├── .env                      # Environment variables
├── package.json              # Dependencies & scripts
└── README.md

````

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/R0han5B/pill-dispenser.git
cd pill-dispenser
````

---

### 2️⃣ Install Dependencies

For backend:

```bash
cd backend
npm install
```

For frontend:

```bash
cd ../frontend
npm install
```

---

### 3️⃣ Environment Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
DATABASE_URL=your_database_url
```

---

### 4️⃣ Run the Application

Start backend:

```bash
cd backend
npm start
```

Start frontend:

```bash
cd frontend
npm start
```

The application will run on:

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:5000`

---

## 📡 API Overview (Sample)

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| GET    | /api/pills     | Fetch all medications     |
| POST   | /api/pills     | Add a new medication      |
| PUT    | /api/pills/:id | Update medication details |
| DELETE | /api/pills/:id | Remove medication         |

---

## 🔮 Future Enhancements

* 🔐 User authentication & authorization
* 📲 Email / SMS notifications
* 📈 Medication adherence analytics
* ⌚ Real-time alerts
* 🤖 IoT-based pill dispenser hardware integration
* 📱 Mobile application support

---

## 🎯 Career Relevance

This project demonstrates:

* Full-stack development skills
* REST API design
* Database integration
* Scalable system architecture
* Real-world problem solving
* Clean project structuring

### Suitable Roles:

* Full-Stack Developer
* Frontend Developer
* Backend Developer
* Software Engineer Intern

---

## 📜 License

This project is developed for **educational and learning purposes**.

---

