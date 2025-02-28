const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    user_id: { type: Number, ref: 'User', required: true },
    request_date: { type: Date, required: true },
    reserved_date: { type: Date, required: true },
    room_num: { type: String, ref: 'Room', required: true },
    seat_num: { type: Number, required: true },
    anonymous: { type: String, enum: ['Y', 'N'], required: true },
    reserved_for_id: { type: Number, ref: 'User' } // Optional for walk-ins
});

module.exports = mongoose.model('Reservation', ReservationSchema);
