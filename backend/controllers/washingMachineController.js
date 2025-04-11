const { validationResult } = require('express-validator');
const { WashingMachine, Student } = require('../models/');
const { verifyToken } = require('../utils/auth');

// @route   POST api/washingmachine/request
// @desc    Request for washing machine slot
// @access  Public
exports.requestWashingMachine = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ "message": errors.array(), success });
    }
    const { student, slot_date, slot_time } = req.body;
    const today = new Date();
    if (new Date(slot_date) < today) {
        return res.status(400).json({ success, "message": "Request cannot be made for past dates" });
    }
    try {
        // Get student's hostel
        const studentData = await Student.findById(student);
        if (!studentData) {
            return res.status(400).json({ success, "message": "Student not found" });
        }

        // Check if slot is already booked
        const existingSlot = await WashingMachine.findOne({
            hostel: studentData.hostel,
            slot_date,
            slot_time,
            status: { $in: ['pending', 'approved'] }
        });

        if (existingSlot) {
            return res.status(400).json({ success, "message": "This slot is already booked" });
        }

        const washingMachine = new WashingMachine({
            student,
            hostel: studentData.hostel,
            slot_date,
            slot_time
        });
        await washingMachine.save();
        success = true;
        return res.status(200).json({ success, "message": "Washing machine slot requested successfully" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success, "message": "Server Error" });
    }
}

// @route   GET api/washingmachine/list
// @desc    Get all washing machine requests
// @access  Public
exports.listWashingMachine = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success });
    }
    const { hostel } = req.body;
    try {
        const students = await Student.find({ hostel }).select('_id');
        const list = await WashingMachine.find({ student: { $in: students }, status: "pending" })
            .populate('student', ['name', 'room_no']);
        const approved = await WashingMachine.countDocuments({ 
            student: { $in: students }, 
            status: "approved",
            slot_date: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), 
                        $lte: new Date(new Date().getFullYear(), new Date().getMonth()+1, 0) }
        });
        const rejected = await WashingMachine.countDocuments({ 
            student: { $in: students }, 
            status: "rejected",
            slot_date: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), 
                        $lte: new Date(new Date().getFullYear(), new Date().getMonth()+1, 0) }
        });
        success = true;
        return res.status(200).json({ success, list, approved, rejected });
    } catch (err) {
        return res.status(500).json({ success, errors: [{ msg: "Server Error" }] });
    }
}

// @route   POST api/washingmachine/update
// @desc    Update washing machine request
// @access  Public
exports.updateWashingMachine = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success });
    }

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success, errors: [{ msg: 'No token, authorization denied' }] });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ success, errors: [{ msg: 'Token is not valid' }] });
        }

        const { id, status } = req.body;
        const washingMachine = await WashingMachine.findByIdAndUpdate(id, { status });
        success = true;
        return res.status(200).json({ success, washingMachine });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success, errors: [{ msg: "Server Error" }] });
    }
}

// @route   GET api/washingmachine/all
// @desc    Get all washing machine requests
// @access  Private
exports.getAllWashingMachineRequests = async (req, res) => {
    let success = false;
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success, errors: [{ msg: 'No token, authorization denied' }] });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ success, errors: [{ msg: 'Token is not valid' }] });
        }

        const requests = await WashingMachine.find({})
            .populate('student', ['name', 'room_no'])
            .populate('hostel', ['name'])
            .sort({ request_date: -1 });

        const list = requests.filter(req => req.status === 'pending');
        const approved = requests.filter(req => req.status === 'approved');
        const rejected = requests.filter(req => req.status === 'rejected');

        success = true;
        res.json({ success, list, approved, rejected });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success, errors: [{ msg: 'Server error' }] });
    }
} 