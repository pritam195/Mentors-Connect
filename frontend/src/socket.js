// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://mentors-connect-1-m3po.onrender.com"); // Match your backend port

export default socket;
