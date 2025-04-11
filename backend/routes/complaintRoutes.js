const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { registerComplaint, getbyhostel, getbystudent, resolve, getAllComplaints } = require('../controllers/complaintController');
const { verifyToken } = require('../utils/jwt');

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, errors: [{ msg: 'No token, authorization denied' }] });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ success: false, errors: [{ msg: 'Token is not valid' }] });
    }
    next();
};

// @route   POST api/complaint/register
// @desc    Register complaint
// @access  Private
router.post('/register', [
    check('student', 'Student is required').not().isEmpty(),
    check('hostel', 'Hostel is required').not().isEmpty(),
    check('type', 'Type is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
], auth, registerComplaint);

// @route   POST api/complaint/hostel
// @desc    Get all complaints by hostel id
// @access  Private
router.post('/hostel', [
    check('hostel', 'Hostel is required').not().isEmpty()
], auth, getbyhostel);

// @route   POST api/complaint/student
// @desc    Get all complaints by student id
// @access  Private
router.post('/student', [
    check('student', 'Student is required').not().isEmpty()
], auth, getbystudent);

// @route   POST api/complaint/resolve
// @desc    Resolve a complaint
// @access  Private
router.post('/resolve', [
    check('id', 'Complaint ID is required').not().isEmpty()
], auth, resolve);

// @route   GET api/complaint/all
// @desc    Get all complaints
// @access  Private
router.get('/all', auth, getAllComplaints);

module.exports = router;