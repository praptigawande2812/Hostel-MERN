const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { 
    requestWashingMachine, 
    listWashingMachine, 
    updateWashingMachine, 
    getAllWashingMachineRequests 
} = require('../controllers/washingMachineController');

// @route   POST api/washingmachine/request
// @desc    Request for washing machine slot
// @access  Public
router.post('/request', [
    check('student', 'Student ID is required').not().isEmpty(),
    check('slot_date', 'Slot date is required').not().isEmpty(),
    check('slot_time', 'Slot time is required').not().isEmpty()
], requestWashingMachine);

// @route   POST api/washingmachine/list
// @desc    Get all washing machine requests
// @access  Public
router.post('/list', [
    check('hostel', 'Hostel is required').not().isEmpty()
], listWashingMachine);

// @route   POST api/washingmachine/update
// @desc    Update washing machine request
// @access  Public
router.post('/update', [
    check('id', 'ID is required').not().isEmpty(),
    check('status', 'Status is required').not().isEmpty()
], updateWashingMachine);

// @route   GET api/washingmachine/all
// @desc    Get all washing machine requests
// @access  Private
router.get('/all', getAllWashingMachineRequests);

module.exports = router; 