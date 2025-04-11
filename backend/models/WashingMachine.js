const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WashingMachineSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'student'
    },
    hostel: {
        type: Schema.Types.ObjectId,
        ref: 'hostel'
    },
    slot_date: {
        type: Date,
        required: true
    },
    slot_time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    request_date: {
        type: Date,
        default: Date.now
    }
})

module.exports = WashingMachine = mongoose.model('machine', WashingMachineSchema); 