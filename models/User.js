const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Username 
    username: {
        type: String,
        required: true,
        min: 6,
    },
    
    // Email for contacting
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    },

    // Each user must have a password to secure there account
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },

    // Have to match with password above
    repeatPassword: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },

    // Date to check when the user was created
    date: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('User', userSchema);