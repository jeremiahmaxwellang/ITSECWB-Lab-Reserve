const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    room_num: { type: String, ref: 'Room', required: true },
    seat_num: { type: Number, required: true }
});

module.exports = mongoose.model('Seat', SeatSchema);
