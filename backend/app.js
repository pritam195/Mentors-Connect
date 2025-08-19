const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://mentors-connect-vjti.vercel.app",
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
const UserBio = require("./models/userBio")
const Message = require("./models/messagemodel");
const sessionModel = require("./models/sessionModel");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require("./uploadProfilePhoto");
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cookieParser = require('cookie-parser');
const path = require('path'); 

const cors = require('cors');
app.use(
  cors({
    origin: "https://mentors-connect-vjti.vercel.app",
    credentials: true,
  })
);

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'posts',
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'mkv', 'webm', 'pdf', 'zip', 'txt'],
        resource_type: 'auto'
    },
});

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 1024 } })

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

app.get("/",function(req,res){
    res.send("HELLO WORLD");
})

app.get('/signup', function(req,res){
    res.render('signup')
});

app.post('/create', (req,res) =>{
    let {username ,name, email , mobno , password ,gender , dob, profile_photo } = req.body;

    bcrypt.genSalt(10, (err,salt)=>{
        
        bcrypt.hash(password,salt, async (err,hash)=>{
            let createdUser = await userModel.create({
                username,
                email, 
                name,
                password : hash,
                dob,
                mobno,
                gender,
                profile_photo
            })
            await UserBio.create({ username, name, profile_photo })
            let token = jwt.sign({username, email},"abcde");
            res.cookie("token",token);

            res.send(createdUser)
        })
    })

})

app.post('/login', async function(req,res){
    let user = await userModel.findOne({email : req.body.email});

    if(!user) {
        return res.status(404).json({message : "User not found"});
    }

    bcrypt.compare(req.body.password,user.password , function(err,result){
        if(err){
            return res.status(500).json({message : "Server error"});
        }

        if(result){
            let token = jwt.sign({username: user.username, email : user.email}, "abcde");
            res.cookie("token",token);
            res.status(200).json({message : "Login Successful", username: user.username});
        }
        else{
            res.status(401).json({message : "Incorrect password"});
        }
    })
})

app.get("/logout" , function(req,res){
    res.cookie("token", "");
    res.redirect('/');
})

app.get("/get_username", async (req, res) => {
    let token = req.cookies.token
    if (!token) return res.status(401).send("Unauthorized !")
    try {
        let data = jwt.verify(token, "abcde")
        res.status(200).json({username: data.username})
    }
    catch (error) {
        res.status(500).send({ message: "Internal servor error! Please try again." })
    }
})

app.get("/:name/profile", async (req, res) => {
    let { name } = req.params
    try {
        let userInfo = await userModel.findOne({ username: name }).select("name username email mobno profile_photo gender dob")
        let userBio = await UserBio.findOne({ username: name })
        return res.status(200).json({ userInfo, userBio })
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/:username/profile/profile-photo", upload.single("profile_photo"), async (req, res) => {
    let { username } = req.params
    let profile_photo = req.file.path
    try {
        await UserBio.findOneAndUpdate({ username }, { profile_photo }, { new: true })
        let data = await userModel.findOneAndUpdate({ username }, { profile_photo }, { new: true })
        res.status(200).send(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/:username/profile", async (req, res) => {
    let { username } = req.params
    let { userBio } = req.body
    try {
        let data = await UserBio.findOneAndUpdate({ username }, { $set: { ...userBio } }, { upsert: true, new: true })
        return res.status(200).json(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})


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
        let mentorsData = await UserBio.find({ work_experience: { $ne: [] } }).select("username name profile_photo work_experience")
        return res.status(200).json(mentorsData)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/mentor", async (req, res) => {
    let { mentorSearch, filters } = req.body
    let query = {}
    if (mentorSearch && mentorSearch.trim() !== "") {
        query.$or = [
            { username: { $regex: mentorSearch.trim(), $options: "i" } },
            { "work_experience.0.company_name": { $regex: mentorSearch.trim(), $options: "i" } },
            { "work_experience.0.place": { $regex: mentorSearch.trim(), $options: "i" } },
            { "work_experience.0.role": { $regex: mentorSearch.trim(), $options: "i" } }
        ]
    }
    const yearMap = {
        "Less than 1 year": ["0 years", "0.5 years", "less than 1 year"],
        "1+ year": ["1 year", "1.5 years", "2 years", "3 years", "4 years", "5 years", "6 years", "7 years", "8 years", "9 years", "10 years"],
        "2+ years": ["2 years", "3 years", "4 years", "5 years", "6 years", "7 years", "8 years", "9 years", "10 years"],
        "3+ years": ["3 years", "4 years", "5 years", "6 years", "7 years", "8 years", "9 years", "10 years"],
        "5+ years": ["5 years", "6 years", "7 years", "8 years", "9 years", "10 years"],
        "10+ years": ["10 years", "11 years", "12 years"]
    }
    const expConditions = {};

    if (filters.company.length > 0) {
        expConditions.company_name = { $in: filters.company };
    }
    if (filters.year_of_exp.length > 0) {
        let durationsToMatch = []
        filters.year_of_exp.forEach(label => {
            if (yearMap[label]) {
                durationsToMatch = durationsToMatch.concat(yearMap[label])
            }
        })
        if (durationsToMatch.length > 0) {
            expConditions.duration = { $in: durationsToMatch }
        }
    }
    if (filters.location.length > 0) {
        expConditions.place = { $in: filters.location };
    }

    if (Object.keys(expConditions).length > 0) {
        query.work_experience = { $elemMatch: expConditions };
    }
    try {
        let mentorsData = await UserBio.find(query)
        return res.status(200).json(mentorsData)
    }
    catch (error) {
        console.error("Error fetching mentors:", error)
        res.status(500).send({ message: "Internal server error" })
    }
})


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
  




// Zoom api integration

const { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_REDIRECT_URI } = process.env;
const qs = require("querystring");

// Create a meeting info
app.post("/api/sessionInfo", async (req, res) => {
  const { sessionName, description, date , time } = req.body;

  if (!sessionName || !description || !date || !time) {
    return res.status(400).json({ message: "All the fields are required" });
  }

  try {
    console.log("Session info received :", { sessionName, description, date, time });

    await sessionModel.create({ sessionName, description, date , time});
    return res.status(200).json({ message: "Session detail saved successfully" });
  } catch (err) {
    console.log("Error saving session info : ", err);
    return res.status(500).json({ message: "Server error" });
  }
})

// Step 1: Redirect to Zoom
app.get("/zoom/auth", (req, res) => {
  const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${ZOOM_CLIENT_ID}&redirect_uri=${ZOOM_REDIRECT_URI}`;
  res.redirect(zoomAuthUrl);
});

// Step 2: Handle Zoom callback
app.get("/zoom/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post(
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

    const { access_token } = response.data;

    // Set token in cookie
    res.cookie("zoom_token", access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.redirect("https://mentors-connect-vjti.vercel.app/host-meeting");
    console.log("Zoom token exchanged successfully:", access_token);
  } catch (err) {
    console.error(
      "Zoom token exchange failed:",
      err.response?.data || err.message
    );
    res.status(500).send("Zoom auth failed");
  }
});

// Step 3: Create Zoom meeting
app.get("/api/create-meeting", async (req, res) => {
  console.log("Creating Zoom meeting API called");

  const token = req.cookies.zoom_token;
  if (!token) {
    console.error("Zoom token not found in cookies");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const now = new Date();
    const isoTime = new Date(now.getTime() + 5 * 60 * 1000).toISOString(); // 5 minutes from now

    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "Mentorship Session",
        type: 2, // Scheduled meeting
        start_time: isoTime,
        timezone: "Asia/Kolkata",
        settings: {
          join_before_host: false,
          mute_upon_entry: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Meeting created:", response.data); 
    res.json(response.data); 
  } catch (err) {
    console.error(
      "Meeting creation failed:",
      err.response?.data || err.message
    );
    res.status(500).json({ message: "Failed to create meeting" });
  }
});





// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
  