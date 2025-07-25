const mongoose = require('mongoose')

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

module.exports = mongoose.model("UserBio", userBioSchema); 