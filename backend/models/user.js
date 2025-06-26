const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/margdarshakUsers');

const userSchema = mongoose.Schema({
    username : String,
    name : String,
    mobno : Number,
    email : String,
    password : String,
    gender: {type: String},
    dob : String,
});

module.exports = mongoose.model("user",userSchema);