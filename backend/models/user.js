const mongoose = require('mongoose');

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