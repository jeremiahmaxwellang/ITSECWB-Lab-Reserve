const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, index: true }, // Explicitly set as primary key

    last_name: { type: String, required: true },
    first_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    account_type: { type: String, required: true },

    description: { type: String, required: false },
    profile_picture: String,
});

// Set `user_id` as the primary key by overriding `_id`
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;