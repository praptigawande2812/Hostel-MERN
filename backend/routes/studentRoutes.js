const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { registerStudent, getStudent, getAllStudents, updateStudent, deleteStudent, csvStudent } = require('../controllers/studentController');
const { Student } = require('../models');


// @route  POST api/student/register-student
// @desc   Register student
// @access Public
router.post('/register-student', [
    check('name', 'Name is required').not().isEmpty(),
    check('cms_id', 'CMS ID of at least 6 digit is required').isLength(6),
    check('room_no', 'Room number is required').isLength(1),
    check('batch', 'Batch is required').not().isEmpty(),
    check('dept', 'Department is required').not().isEmpty(),
    check('course', 'Course is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('contact', 'Enter a valid contact number').isLength(11),
    check('parent_mobile', 'Enter a valid parent contact number').isLength(11),
    check('address', 'Address is required').not().isEmpty(),
    check('dob', 'Date of birth is required').not().isEmpty(),
    check('hostel', 'Hostel is required').not().isEmpty(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
], registerStudent);

// @route  POST api/student/get-student
// @desc   Get student by CMS ID
// @access Public
router.post('/get-student', [
    check('isAdmin', 'isAdmin is required').notEmpty(),
    check('token', 'You donot have a valid token').notEmpty()
], getStudent);

// @route  POST api/student/get-all-students
// @access Public
router.post('/get-all-students',[
    check('hostel', 'Hostel is required').not().isEmpty()
],
 getAllStudents);

// @route  POST api/student/update-student
// @desc   Update student
// @access Public
router.post('/update-student', [
    check('cms_id', 'CMS ID is required').not().isEmpty(),
    check('room_no', 'Room number is required').not().isEmpty(),
    check('batch', 'Batch is required').not().isEmpty(),
    check('dept', 'Department is required').not().isEmpty(),
    check('course', 'Course is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('contact', 'Contact is required').not().isEmpty(),
    check('parent_mobile', 'Parent contact is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('dob', 'Date of birth is required').not().isEmpty(),
    check('user', 'User is required').not().isEmpty(),
    check('hostel', 'Hostel is required').not().isEmpty()
], updateStudent);

// @route  POST api/student/delete-student
// @desc   Delete student
// @access Public
router.delete('/delete-student', [
    check('id', 'Enter a valid ID').not().isEmpty(),
], deleteStudent);

// @route  POST api/student/csv
// @desc   Get CSV of students
// @access Public
router.post('/csv', async (req, res) => {
    try {
        const { hostel } = req.body;
        if (!hostel) {
            return res.status(400).json({ errors: [{ msg: 'Hostel ID is required' }] });
        }

        const students = await Student.find({ hostel })
            .populate('hostel', ['name', 'location', 'rooms', 'capacity', 'vacant']);

        if (!students.length) {
            return res.status(404).json({ errors: [{ msg: 'No students found for this hostel' }] });
        }

        // Create CSV headers
        const headers = [
            'CMS ID',
            'Name',
            'Email',
            'Phone',
            'Parent Contact',
            'Department',
            'Course',
            'Batch',
            'Hostel Name',
            'Hostel Location',
            'Room Number',
            'Address',
            'Date of Birth',
            'Admission Date'
        ];

        // Create CSV rows
        const rows = students.map(student => [
            student.cms_id,
            student.name,
            student.email,
            student.contact,
            student.parent_mobile,
            student.dept,
            student.course,
            student.batch,
            student.hostel?.name || 'N/A',
            student.hostel?.location || 'N/A',
            student.room_no,
            student.address,
            new Date(student.dob).toLocaleDateString(),
            new Date(student.date).toLocaleDateString()
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        res.json({ success: true, csv: csvContent });
    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
});


module.exports = router;

