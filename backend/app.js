const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const session = require("express-session");
require("dotenv").config();
const mongoose = require("mongoose");
const qs = require('querystring')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","https://mentors-connect-indol.vercel.app/"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

const userModel = require("./models/user");
const UserBio = require("./models/userBio");
const Message = require("./models/messagemodel");
const sessionModel = require("./models/sessionModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("./uploadProfilePhoto");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cookieParser = require("cookie-parser");
const path = require("path");

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 1024 },
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", function (req, res) {
  res.send("HELLO WORLD");
});

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.post("/create", (req, res) => {
  let { username, name, email, mobno, password, gender, dob, profile_photo } =
    req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
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
      let token = jwt.sign({ username, email }, "abcde");
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

app.post("/login", async function (req, res) {
  let user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (result) {
      let token = jwt.sign(
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
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  });
});

// Add this endpoint to check if user is authenticated
app.get("/api/verify-auth", function (req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, "abcde");
    res.status(200).json({ 
      authenticated: true, 
      username: decoded.username,
      email: decoded.email 
    });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});


app.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
});

app.get("/get_username", async (req, res) => {
  let token = req.cookies.token;
  if (!token) return res.status(401).send("Unauthorized !");
  try {
    let data = jwt.verify(token, "abcde");
    res.status(200).json({ username: data.username });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal servor error! Please try again." });
  }
});

app.get("/:name/profile", async (req, res) => {
  let { name } = req.params;
  try {
    let userInfo = await userModel
      .findOne({ username: name })
      .select("name username email mobno profile_photo gender dob");
    let userBio = await UserBio.findOne({ username: name });
    return res.status(200).json({ userInfo, userBio });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

app.post(
  "/:username/profile/profile-photo",
  upload.single("profile_photo"),
  async (req, res) => {
    let { username } = req.params;
    let profile_photo = req.file.path;
    try {
      await UserBio.findOneAndUpdate(
        { username },
        { profile_photo },
        { new: true }
      );
      let data = await userModel.findOneAndUpdate(
        { username },
        { profile_photo },
        { new: true }
      );
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

app.post("/:username/profile", async (req, res) => {
  let { username } = req.params;
  let { userBio } = req.body;
  try {
    let data = await UserBio.findOneAndUpdate(
      { username },
      { $set: { ...userBio } },
      { upsert: true, new: true }
    );
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/search-users", async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(200).json([]); // Return empty list for empty input
  }

  try {
    const results = await userModel
      .find({
        $or: [
          { name: { $regex: query.trim(), $options: "i" } },
          { username: { $regex: query.trim(), $options: "i" } },
        ],
      })
      .select("username name profile_photo");

    res.status(200).json(results);
  } catch (error) {
    console.error("Error during user search:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/mentor", async (req, res) => {
  try {
    let mentorsData = await UserBio.find({
      work_experience: { $ne: [] },
    }).select("username name profile_photo work_experience");
    return res.status(200).json(mentorsData);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

app.post("/mentor", async (req, res) => {
  let { mentorSearch, filters } = req.body;
  let query = {};
  if (mentorSearch && mentorSearch.trim() !== "") {
    query.$or = [
      { username: { $regex: mentorSearch.trim(), $options: "i" } },
      {
        "work_experience.0.company_name": {
          $regex: mentorSearch.trim(),
          $options: "i",
        },
      },
      {
        "work_experience.0.place": {
          $regex: mentorSearch.trim(),
          $options: "i",
        },
      },
      {
        "work_experience.0.role": {
          $regex: mentorSearch.trim(),
          $options: "i",
        },
      },
    ];
  }
  const yearMap = {
    "Less than 1 year": ["0 years", "0.5 years", "less than 1 year"],
    "1+ year": [
      "1 year",
      "1.5 years",
      "2 years",
      "3 years",
      "4 years",
      "5 years",
      "6 years",
      "7 years",
      "8 years",
      "9 years",
      "10 years",
    ],
    "2+ years": [
      "2 years",
      "3 years",
      "4 years",
      "5 years",
      "6 years",
      "7 years",
      "8 years",
      "9 years",
      "10 years",
    ],
    "3+ years": [
      "3 years",
      "4 years",
      "5 years",
      "6 years",
      "7 years",
      "8 years",
      "9 years",
      "10 years",
    ],
    "5+ years": [
      "5 years",
      "6 years",
      "7 years",
      "8 years",
      "9 years",
      "10 years",
    ],
    "10+ years": ["10 years", "11 years", "12 years"],
  };
  const expConditions = {};

  if (filters.company.length > 0) {
    expConditions.company_name = { $in: filters.company };
  }
  if (filters.year_of_exp.length > 0) {
    let durationsToMatch = [];
    filters.year_of_exp.forEach((label) => {
      if (yearMap[label]) {
        durationsToMatch = durationsToMatch.concat(yearMap[label]);
      }
    });
    if (durationsToMatch.length > 0) {
      expConditions.duration = { $in: durationsToMatch };
    }
  }
  if (filters.location.length > 0) {
    expConditions.place = { $in: filters.location };
  }

  if (Object.keys(expConditions).length > 0) {
    query.work_experience = { $elemMatch: expConditions };
  }
  try {
    let mentorsData = await UserBio.find(query);
    return res.status(200).json(mentorsData);
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Get all messages related to a user
app.get("/users", async (req, res) => {
  try {
    const users = await userModel.find({}, "username name profile_photo");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/messages/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const messages = await Message.find({
      $or: [{ senderId: username }, { receiverId: username }],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("send_message", async (data) => {
    try {
      const { senderId, receiverId, text } = data;
      const newMessage = new Message({ senderId, receiverId, text });
      await newMessage.save();

      // Broadcast message to all clients
      io.emit("receive_message", newMessage);
    } catch (error) {
      console.error("Socket message save error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.use(
  session({
    secret: "your-secret-key-here", // Change this to a secure random string
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true in production with HTTPS
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);

const { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_REDIRECT_URI } = process.env;

// Step 1: Store session info temporarily (DON'T save to DB yet)
app.post("/api/sessionInfo", async (req, res) => {
  const { sessionName, description, date, time } = req.body;

  if (!sessionName || !description || !date || !time) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    console.log("Session info received:", {
      sessionName,
      description,
      date,
      time,
    });

    // ✅ Store in express-session (temporary storage)
    req.session.pendingSession = {
      sessionName,
      description,
      date,
      time,
    };

    // ✅ Save session before redirect (CRITICAL!)
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Failed to save session" });
      }
      console.log("✅ Session saved successfully");
      return res.status(200).json({
        message: "Ready to redirect to Zoom",
        redirect: true,
      });
    });
  } catch (err) {
    console.log("Error storing session info:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Step 2: Redirect to Zoom OAuth
app.get("/zoom/auth", (req, res) => {
  console.log("🔐 Redirecting to Zoom OAuth...");
  const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${ZOOM_CLIENT_ID}&redirect_uri=${ZOOM_REDIRECT_URI}`;
  res.redirect(zoomAuthUrl);
});

// Step 3: Handle Zoom callback and create meeting
app.get("/zoom/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code missing");
  }

  try {
    console.log("🔄 Exchanging code for access token...");

    // Exchange authorization code for access token
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
    console.log("✅ Access token received");

    // ✅ Retrieve pending session from express-session
    const pendingSession = req.session.pendingSession;

    if (!pendingSession) {
      console.error("❌ No pending session found!");
      return res.status(400).send("Session data not found. Please try again.");
    }

    console.log("📋 Pending session data:", pendingSession);

    // Create Zoom meeting with stored session data
    const meetingResponse = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: pendingSession.sessionName,
        type: 2, // Scheduled meeting
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
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const meetingData = meetingResponse.data;
    console.log("🎉 Zoom meeting created:", meetingData.id);

    // ✅ NOW save to database with all required fields
    const newSession = await sessionModel.create({
      sessionName: pendingSession.sessionName,
      description: pendingSession.description,
      date: pendingSession.date,
      time: pendingSession.time,
      meetingId: meetingData.id.toString(),
      joinLink: meetingData.join_url,
      password: meetingData.password || "N/A",
    });

    console.log("💾 Session saved to database:", newSession._id);

    // Clear pending session
    req.session.pendingSession = null;

    // Store meeting data in session for display
    req.session.completedMeeting = meetingData;

    // Redirect back to frontend with success
    res.redirect(`http://localhost:5173/host-meeting?success=true`);
  } catch (err) {
    console.error(
      "❌ Error in Zoom callback:",
      err.response?.data || err.message
    );
    res.status(500).send("Failed to create meeting. Please try again.");
  }
});

// Step 4: Get created meeting data
app.get("/api/meeting-data", (req, res) => {
  const meeting = req.session.completedMeeting;

  if (!meeting) {
    return res.status(404).json({ message: "No meeting data found" });
  }

  res.json(meeting);
});



// ===== Routes =====

// GET all sessions
app.get("/api/sessions", async (req, res) => {
  try {
    const sessions = await sessionModel.find().sort({ date: 1, time: 1 });
    res.json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
});

// GET a single session by ID
app.get("/api/sessions/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  } catch (err) {
    console.error("Error fetching session:", err);
    res.status(500).json({ message: "Failed to fetch session" });
  }
});

// (Optional) POST a new session
app.post("/api/sessions", async (req, res) => {
  try {
    const { sessionName, description, date, time } = req.body;
    const session = new Session({ sessionName, description, date, time });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(400).json({ message: "Failed to create session" });
  }
});

// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
