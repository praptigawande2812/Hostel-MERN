const mongoose = require('mongoose');
const { Hostel } = require('./models');

const listHostels = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/hostel', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Find all hostels
        const hostels = await Hostel.find({});
        console.log('Hostels in database:');
        console.log(JSON.stringify(hostels, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error listing hostels:', error);
        process.exit(1);
    }
};

listHostels(); 