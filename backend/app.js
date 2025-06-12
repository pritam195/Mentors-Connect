const express = require('express');
const app = express();
const userModel = require("./models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
const path = require('path'); 

const cors = require('cors');
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

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
    let {username ,name, email , mobno , password ,gender , dob } = req.body;

    bcrypt.genSalt(10, (err,salt)=>{
        
        bcrypt.hash(password,salt, async (err,hash)=>{
            let createdUser = await userModel.create({
                username,
                email, 
                name,
                password : hash,
                dob,
                mobno,
                gender
            })
            let token = jwt.sign({email},"abcde");
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
            let token = jwt.sign({email : user.email}, "abcde");
            res.cookie("token",token);
            res.status(200).json({message : "Login Successful"});
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

app.listen(3000);