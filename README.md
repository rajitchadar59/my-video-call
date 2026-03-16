# 📹 My Video Call - Real-Time Communication Platform

> A seamless, real-time video calling and collaboration platform built with WebRTC and WebSockets. Designed for smooth, interactive, and secure online meetings.

[![Tech Stack](https://img.shields.io/badge/Tech-MERN_Stack-blue)](#)
[![Real-Time](https://img.shields.io/badge/RealTime-Socket.io-black)](#)
[![P2P Video](https://img.shields.io/badge/Video-WebRTC-green)](#)

## 📖 About The Project

**My Video Call** is a full-stack communication application that allows users to connect instantly. Whether it's a quick chat, a screen-sharing session, or a face-to-face video meeting, this platform handles it all with high performance and minimal latency. 

It completely bypasses complex setups by offering a **"Join as Guest"** feature, making it incredibly user-friendly for instant access, while still maintaining secure accounts and meeting histories for registered users.

---

## ✨ Key Features

- **🎥 Real-Time Video & Audio:** Peer-to-Peer high-quality communication powered by WebRTC.
- **💬 Instant Chat:** Integrated real-time messaging system within the meeting room using Socket.io.
- **🖥️ Screen Sharing:** Easily share your screen with other participants for better collaboration.
- **🏃‍♂️ Join as Guest:** Frictionless entry into meetings without the need for signing up.
- **📜 Meeting History:** Registered users can track and view their past meeting records.
- **🔐 Secure Authentication:** Robust user signup/login using Bcrypt and Crypto for password hashing and data security.

---

## 🧠 System Architecture

This project leverages a hybrid architecture for real-time communication:
1. **Signaling Server (Socket.io & Node.js):** Handles the initial connection setup. It routes the SDP (Session Description Protocol) offers, answers, and ICE candidates between peers.
2. **Peer-to-Peer Connection (WebRTC):** Once the signaling is complete, the actual video, audio, and screen-sharing media streams flow directly between the clients' browsers, ensuring low latency and reduced server load.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Material UI, CSS, Axios
- **Backend:** Node.js, Express.js
- **Real-Time Communication:** WebRTC, Socket.io
- **Database:** MongoDB
- **Security & Auth:** Bcrypt, Crypto, JWT (JSON Web Tokens)

---

## ⚙️ Environment Variables

Create a `.env` file in your backend directory and add the following keys:

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port for the backend server | `5000` |
| `MONGO_URI` | Your MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT authentication | `your_super_secret_key` |

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/rajitchadar59/my-video-call.git](https://github.com/rajitchadar59/my-video-call.git)
cd my-video-call