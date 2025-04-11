const { validationResult } = require('express-validator');
const { Complaint } = require('../models');
const { verifyToken } = require('../utils/jwt');

// @route   Register api/compalint
// @desc    Register complaint
// @access  Public
exports.registerComplaint = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success });
    }
    const { student, hostel, type, title, description } = req.body;
    try {
        const newComplaint = new Complaint({
            student,
            hostel,
            type,
            title,
            description
        });
        await newComplaint.save();
        success = true;
        res.json({ success, msg: 'Complaint registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

// @route   GET api/complaint
// @desc    Get all complaints by hostel id
// @access  Public
exports.getbyhostel = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success });
    }
    const { hostel } = req.body;
    try {
        const complaints = await Complaint.find({ hostel }).populate('student', ['name', 'room_no']);
        success = true;
        res.json({ success, complaints });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

// @route   GET api/complaint
// @desc    Get all complaints by student id
// @access  Public
exports.getbystudent = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success });
    }
    const { student } = req.body;
    try {
        const complaints = await Complaint.find({ student });
        success = true;
        res.json({ success, complaints });
    }
    catch (err) {
        console.error(err.errors);
        res.status(500).send('Server error');
    }
}

// @route   GET api/complaint
// @desc    Get complaint by complaint id
// @access  Public
exports.resolve = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success });
    }
    const { id } = req.body;
    try {
        const complaint = await Complaint.findById(id);
        complaint.status = "solved";
        await complaint.save();
        success = true;
        res.json({ success });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.getAllComplaints = async (req, res) => {
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

        const complaints = await Complaint.find({})
            .populate('student', ['name', 'room_no'])
            .populate('hostel', ['name'])
            .sort({ date: -1 });

        success = true;
        res.json({ success, complaints });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success, errors: [{ msg: 'Server error' }] });
    }
}