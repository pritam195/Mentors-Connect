const express = require('express');
const app = express();
const userModel = require("./models/user");
const UserBio = require("./models/userBio")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require("./uploadProfilePhoto");
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cookieParser = require('cookie-parser');
const path = require('path'); 

const cors = require('cors');
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

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

app.get("/login", function(res,res){
    res.render('login');
});

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

app.listen(3000);