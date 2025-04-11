const { validationResult } = require('express-validator');
const { Student, Attendance } = require('../models');

const markAttendance = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success, errors: errors.array() });
    }
    const { student, status } = req.body;
    const date = new Date();
    const todayStart = new Date(date.setHours(0, 0, 0, 0));
    const todayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    try {
        const alreadyattendance = await Attendance.findOne({ 
            student, 
            date: { $gte: todayStart, $lte: todayEnd } 
        });
        
        if (alreadyattendance) {
            return res.status(409).json({ 
                success, 
                errors: [{ msg: 'Attendance already marked for today' }] 
            });
        }
        
        const attendance = new Attendance({
            student,
            status,
            date: new Date()
        });
        
        const result = await attendance.save();
        success = true;
        res.status(201).json({ success, result });
    } catch (err) {
        console.error('Error marking attendance:', err);
        res.status(500).json({ 
            success, 
            errors: [{ msg: 'Server error while marking attendance' }] 
        });
    }
}

const getAttendance = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success, errors: errors.array() });
    }
    const { student } = req.body;
    try {
        const attendance = await Attendance.find({ student })
            .populate('student', ['name', 'room_no', 'cms_id'])
            .sort({ date: -1 });
        success = true;
        res.status(200).json({ success, attendance });
    } catch (err) {
        console.error('Error fetching attendance:', err);
        res.status(500).json({ 
            success, 
            errors: [{ msg: 'Server error while fetching attendance' }] 
        });
    }
}

const updateAttendance = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success, errors: errors.array() });
    }
    const { student, status } = req.body;
    const date = new Date();
    const todayStart = new Date(date.setHours(0, 0, 0, 0));
    const todayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    try {
        const attendance = await Attendance.findOneAndUpdate(
            { 
                student, 
                date: { $gte: todayStart, $lte: todayEnd } 
            },
            { status },
            { new: true }
        );
        
        if (!attendance) {
            return res.status(404).json({ 
                success, 
                errors: [{ msg: 'No attendance found for today' }] 
            });
        }
        
        success = true;
        res.status(200).json({ success, attendance });
    } catch (err) {
        console.error('Error updating attendance:', err);
        res.status(500).json({ 
            success, 
            errors: [{ msg: 'Server error while updating attendance' }] 
        });
    }
}

const getHostelAttendance = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success, errors: errors.array() });
    }
    const { hostel } = req.body;
    try {
        const date = new Date();
        const todayStart = new Date(date.setHours(0, 0, 0, 0));
        const todayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const students = await Student.find({ hostel });
        const attendance = await Attendance.find({ 
            student: { $in: students }, 
            date: { $gte: todayStart, $lte: todayEnd } 
        }).populate('student', ['name', 'room_no', 'cms_id']);
        
        success = true;
        res.status(200).json({ success, attendance });
    } catch (err) {
        console.error('Error fetching hostel attendance:', err);
        res.status(500).json({ 
            success, 
            errors: [{ msg: 'Server error while fetching hostel attendance' }] 
        });
    }
}

module.exports = {
    markAttendance,
    getAttendance,
    updateAttendance,
    getHostelAttendance
}

