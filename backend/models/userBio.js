const mongoose = require('mongoose')
const userbiodb = mongoose.createConnection('mongodb://127.0.0.1:27017/margdarshakUsers')

let userBioSchema = new mongoose.Schema({
    username: {
        type: String
    },
    name: {
        type: String
    },
    bio: {
        type: String
    },
    resume: {
        type: String
    },
    profile_photo: {
        type: String,
    },
    educational_details: [{
        standard: String,
        marks: String,
        institution: String,
        institution_address: String
    }],
    social_links: [{
        name: String,
        link: String
    }],
    work_experience: [{
        company_name: String,
        role: String,
        place: String,
        duration: String,
        features: []
    }]
})

let UserBio = userbiodb.model("UserBio", userBioSchema)

module.exports = UserBio;