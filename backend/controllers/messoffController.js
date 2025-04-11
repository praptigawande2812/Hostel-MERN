const { validationResult } = require('express-validator');
const { MessOff, Student } = require('../models/');
const { verifyToken } = require('../utils/auth');

// @route   request api/messoff/request
// @desc    Request for mess off
// @access  Public
exports.requestMessOff = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({"message": errors.array(), success});
    }
    const { student, leaving_date, return_date } = req.body;
    const today = new Date();
    if (new Date(leaving_date) > new Date(return_date)) {
        return res.status(400).json({success, "message": "Leaving date cannot be greater than return date"});
    }
    else if (new Date(leaving_date) < today) {
        return res.status(400).json({success, "message": "Request cannot be made for past Leave"});
    }
    try {
        // Get student's hostel
        const studentData = await Student.findById(student);
        if (!studentData) {
            return res.status(400).json({success, "message": "Student not found"});
        }

        const messOff = new MessOff({
            student,
            hostel: studentData.hostel,
            leaving_date,
            return_date
        });
        await messOff.save();
        success = true;
        return res.status(200).json({success, "message": "Leave request sent successfully"});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success, "message": "Server Error"});
    }
}

// @route   GET count of request api/messoff/count
// @desc    Get all mess off requests
// @access  Private
exports.countMessOff = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array(), success});
    }
    const { student } = req.body;
    try {
        let date = new Date();
        const list = await MessOff.find({ student, leaving_date: { $gte: new Date(date.getFullYear(), date.getMonth(), 1), $lte: new Date(date.getFullYear(), date.getMonth() + 1, 0) } });
        let approved = await MessOff.find({student, status: "Approved", leaving_date: {$gte: new Date(date.getFullYear(), date.getMonth(), 1), $lte: new Date(date.getFullYear(), date.getMonth()+1, 0)}});
        
        let days = 0;
        for (let i = 0; i < approved.length; i++) {
            days += (new Date(approved[i].return_date) - new Date(approved[i].leaving_date))/(1000*60*60*24);
        }

        approved = days;

        success = true;
        return res.status(200).json({success, list, approved});
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({success, "message": "Server Error"});
    }
}

// @route   GET api/messoff/list
// @desc    Get all mess off requests
// @access  Public
exports.listMessOff = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array(), success});
    }
    const { hostel } = req.body;
    try {
        const students = await Student.find({ hostel }).select('_id');
        const list = await MessOff.find({ student: { $in: students } , status: "pending" }).populate('student', ['name', 'room_no']);
        const approved = await MessOff.countDocuments({ student: { $in: students }, status: "approved", leaving_date: {$gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), $lte: new Date(new Date().getFullYear(), new Date().getMonth()+1, 0)}});
        const rejected = await MessOff.countDocuments({ student: { $in: students }, status: "rejected", leaving_date: {$gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), $lte: new Date(new Date().getFullYear(), new Date().getMonth()+1, 0)}});
        success = true;
        return res.status(200).json({success, list, approved, rejected});
    }
    catch (err) {
        // console.error(err.message);
        return res.status(500).json({success, errors: [{msg: "Server Error"}]});
    }
}

// @route   GET api/messoff/update
// @desc    Update mess off request
// @access  Public
exports.updateMessOff = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array(), success});
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
        const messOff = await MessOff.findByIdAndUpdate(id, { status });
        success = true;
        return res.status(200).json({success, messOff});
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({success, errors: [{msg: "Server Error"}]});
    }
}

exports.getAllMessOffRequests = async (req, res) => {
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

        const requests = await MessOff.find({})
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
