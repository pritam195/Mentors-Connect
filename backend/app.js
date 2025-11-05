const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const session = require("express-session");
require("dotenv").config();
const mongoose = require("mongoose");
const qs = require("querystring");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("./uploadProfilePhoto");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

const userModel = require("./models/user");
const UserBio = require("./models/userBio");
const Message = require("./models/messagemodel");
const Session = require("./models/sessionModel"); // ✅ fixed variable name

const app = express();
const server = http.createServer(app);

// Trust proxy for Render cookies
app.set("trust proxy", 1);

// ✅ Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://mentors-connect-indol.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mentors-connect-indol.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.set("view engine", "ejs");

// ✅ Cloudinary upload setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "posts",
    allowedFormats: [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "mp4",
      "mov",
      "avi",
      "mkv",
      "webm",
      "pdf",
      "zip",
      "txt",
    ],
    resource_type: "auto",
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 },
});

// ✅ Session setup (for Zoom)
app.use(
  session({
    secret: "secure-key-here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // HTTPS only
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    },
  })
);

// =================== BASIC ROUTES ===================
app.get("/", (req, res) => res.send("HELLO WORLD"));

app.get("/signup", (req, res) => res.render("signup"));

// =================== AUTH ROUTES ===================
app.post("/create", (req, res) => {
  const { username, name, email, mobno, password, gender, dob, profile_photo } =
    req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      const createdUser = await userModel.create({
        username,
        email,
        name,
        password: hash,
        dob,
        mobno,
        gender,
        profile_photo,
      });
      await UserBio.create({ username, name, profile_photo });

      const token = jwt.sign({ username, email }, "abcde");
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.send(createdUser);
    });
  });
});

app.post("/login", async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result) {
      const token = jwt.sign(
        { username: user.username, email: user.email },
        "abcde"
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res
        .status(200)
        .json({ message: "Login Successful", username: user.username });
    } else res.status(401).json({ message: "Incorrect password" });
  });
});

// Auth verification
app.get("/api/verify-auth", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false });
  try {
    const decoded = jwt.verify(token, "abcde");
    res
      .status(200)
      .json({
        authenticated: true,
        username: decoded.username,
        email: decoded.email,
      });
  } catch {
    res.status(401).json({ authenticated: false });
  }
});

// Logout
app.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, secure: true, sameSite: "none" });
  res.redirect("/");
});

// =================== USER & PROFILE ROUTES ===================
app.get("/get_username", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Unauthorized!");
  try {
    const data = jwt.verify(token, "abcde");
    res.status(200).json({ username: data.username });
  } catch {
    res.status(500).send({ message: "Internal server error" });
  }
});

// Upload Profile Photo
app.post(
  "/:username/profile/profile-photo",
  upload.single("profile_photo"),
  async (req, res) => {
    const { username } = req.params;
    const profile_photo = req.file.path;
    try {
      await UserBio.findOneAndUpdate(
        { username },
        { profile_photo },
        { new: true }
      );
      const data = await userModel.findOneAndUpdate(
        { username },
        { profile_photo },
        { new: true }
      );
      res.status(200).send(data);
    } catch {
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

// =================== ZOOM INTEGRATION ===================
const { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_REDIRECT_URI } = process.env;

app.post("/api/sessionInfo", async (req, res) => {
  const { sessionName, description, date, time } = req.body;
  if (!sessionName || !description || !date || !time)
    return res.status(400).json({ message: "All fields required" });

  req.session.pendingSession = { sessionName, description, date, time };
  req.session.save((err) => {
    if (err) return res.status(500).json({ message: "Failed to save session" });
    res
      .status(200)
      .json({ message: "Ready to redirect to Zoom", redirect: true });
  });
});

app.get("/zoom/auth", (req, res) => {
  const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${ZOOM_CLIENT_ID}&redirect_uri=${ZOOM_REDIRECT_URI}`;
  res.redirect(zoomAuthUrl);
});

app.get("/zoom/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Authorization code missing");

  try {
    const tokenResponse = await axios.post(
      "https://zoom.us/oauth/token",
      qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: ZOOM_REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString(
              "base64"
            ),
        },
      }
    );

    const { access_token } = tokenResponse.data;
    const pendingSession = req.session.pendingSession;
    if (!pendingSession) return res.status(400).send("No session data found");

    const meetingResponse = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: pendingSession.sessionName,
        type: 2,
        start_time: `${pendingSession.date}T${pendingSession.time}:00`,
        duration: 60,
        timezone: "Asia/Kolkata",
        agenda: pendingSession.description,
        settings: {
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: true,
        },
      },
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const meetingData = meetingResponse.data;

    const newSession = await Session.create({
      sessionName: pendingSession.sessionName,
      description: pendingSession.description,
      date: pendingSession.date,
      time: pendingSession.time,
      meetingId: meetingData.id.toString(),
      joinLink: meetingData.join_url,
      password: meetingData.password || "N/A",
    });

    req.session.pendingSession = null;
    req.session.completedMeeting = meetingData;

    res.redirect(
      "https://mentors-connect-indol.vercel.app/host-meeting?success=true"
    );
  } catch (err) {
    console.error("Zoom Callback Error:", err.response?.data || err.message);
    res.status(500).send("Failed to create meeting");
  }
});

// =================== SOCKET.IO ===================
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("send_message", async (data) => {
    try {
      const { senderId, receiverId, text } = data;
      const newMessage = new Message({ senderId, receiverId, text });
      await newMessage.save();
      io.emit("receive_message", newMessage);
    } catch (err) {
      console.error("Socket message error:", err);
    }
  });

  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

console.log("✅ Server setup complete");
