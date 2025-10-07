# 👨‍🏫 Mentors Connect Platform

A **real-time mentor-student interaction platform** built with **React.js, Node.js, Express.js, MongoDB, Zoom API, and Socket.IO**.  
The platform enables students to connect with mentors through **live chat** and **instant virtual session scheduling**, providing a seamless and secure online learning experience.

---

## 🚀 Features
- 💬 **Real-Time Chat:** Instant mentor-student messaging powered by Socket.IO with an average latency below **200ms**.  
- 🎥 **Live Sessions:** Integrated **Zoom API** for creating instant meeting sessions in under **2 seconds**.  
- 🔐 **Secure Authentication:** Implemented using **JWT** and **HTTP-only cookies** to ensure user data protection.  
- 🧑‍💻 **User-Friendly Interface:** Built an intuitive frontend to simplify mentor-student communication and session management.  
- 📅 **Session Scheduling:** Students can request and manage upcoming mentor sessions easily.  
- 🌐 **Scalable Architecture:** MERN stack with modular APIs for maintainability and future feature expansion.

---

## 🧠 Tech Stack
**Frontend:** React.js, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**APIs:** Zoom API (for meeting creation and management)  
**Real-Time Communication:** Socket.IO  
**Authentication:** JWT, HTTP-only cookies  

---

## ⚙️ How It Works
1. **User Authentication:**  
   Users sign up or log in securely using JWT-based authentication.

2. **Chat System:**  
   Real-time messaging is enabled using Socket.IO channels for mentors and students.

3. **Zoom Integration:**  
   Mentors authorize the platform via **Zoom OAuth**.  
   Once authorized, they can instantly create meetings using the **Zoom API**.

4. **Session Management:**  
   Meeting info (join link, topic, time) is stored in MongoDB and displayed on the dashboard.

---

## 📁 Project Structure
Mentors-Connect/
│
├── client/ # React.js frontend
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── pages/ # Dashboard, Chat, Login, etc.
│ │ └── utils/ # API helpers and hooks
│
├── server/ # Node.js backend
│ ├── routes/ # Express routes (auth, zoom, chat)
│ ├── controllers/ # Request handlers
│ ├── models/ # Mongoose schemas
│ └── server.js # App entry point
│
├── package.json
└── README.md
