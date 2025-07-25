// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://mentors-connect-zh64.onrender.com"); // Match your backend port

export default socket;
