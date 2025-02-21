const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    user_id: { 
        type: Number, 
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{8}$/.test(v);
            },
            message: props => `${props.value} is not a valid 8-digit number!`
        }
    },

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