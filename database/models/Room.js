const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    building_id: { type: Number, ref: 'Building', required: true },
    room_num: { type: String, required: true, maxlength: 45 },
    floor_num: { type: Number, required: true }
});

module.exports = mongoose.model('Room', RoomSchema);
