const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },

    last_name: { type: String, required: true },
    first_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    account_type: { type: String, required: true },

    description: { type: String, required: false },
    profile_picture: String,
})

const User = mongoose.model('User', UserSchema)

module.exports = User